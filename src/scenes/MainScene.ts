import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config/constants';
import { FOODS } from '../data/foods';
import { CUSTOMERS } from '../data/customers';
import { UPGRADES } from '../data/upgrades';
import { AudioSystem } from '../systems/AudioSystem';
import { CustomerSystem } from '../systems/CustomerSystem';
import { DaySystem } from '../systems/DaySystem';
import { EconomySystem } from '../systems/EconomySystem';
import { SaveSystem } from '../systems/SaveSystem';
import { OfflineEarningsSystem } from '../systems/OfflineEarningsSystem';
import { OrderSystem } from '../systems/OrderSystem';
import { RushHourSystem } from '../systems/RushHourSystem';
import { SatisfactionSystem } from '../systems/SatisfactionSystem';
import { StreakSystem } from '../systems/StreakSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { FoodStation } from '../entities/FoodStation';
import { Stall } from '../entities/Stall';
import { MarketBackdrop } from '../entities/MarketBackdrop';
import { HUD } from '../ui/HUD';
import { DaySummaryPanel } from '../ui/DaySummaryPanel';
import { HelpPanel } from '../ui/HelpPanel';
import { OfflineRewardPanel } from '../ui/OfflineRewardPanel';
import { UpgradePanel } from '../ui/UpgradePanel';
import type {
  CustomerOrder,
  CustomerState,
  DaySummary,
  FoodDefinition,
  LoadedSave,
  OfflineEarningsResult,
} from '../types/gameTypes';

export class MainScene extends Phaser.Scene {
  private customerSystem!: CustomerSystem;
  private audioSystem!: AudioSystem;
  private daySystem!: DaySystem;
  private economySystem!: EconomySystem;
  private saveSystem!: SaveSystem;
  private offlineEarningsSystem!: OfflineEarningsSystem;
  private orderSystem!: OrderSystem;
  private rushHourSystem!: RushHourSystem;
  private satisfactionSystem!: SatisfactionSystem;
  private streakSystem!: StreakSystem;
  private upgradeSystem!: UpgradeSystem;
  private progressionSystem!: ProgressionSystem;
  private foodStation!: FoodStation;
  private stall!: Stall;
  private hud!: HUD;
  private upgradePanel!: UpgradePanel;
  private daySummaryPanel?: DaySummaryPanel;
  private helpPanel?: HelpPanel;
  private offlineRewardPanel?: OfflineRewardPanel;
  private pendingOfflineReward?: OfflineEarningsResult;

  constructor() {
    super(SCENE_KEYS.MAIN);
  }

  create(): void {
    this.saveSystem = new SaveSystem(UPGRADES);
    const loadedSave = this.saveSystem.load();

    this.economySystem = new EconomySystem(loadedSave.snapshot.coins);
    this.audioSystem = new AudioSystem(loadedSave.snapshot.settings.soundEnabled);
    this.upgradeSystem = new UpgradeSystem(UPGRADES, loadedSave.snapshot.upgrades);
    this.progressionSystem = new ProgressionSystem(
      loadedSave.snapshot.stallLevel,
      loadedSave.snapshot.stallXp,
    );

    new MarketBackdrop(this);
    this.stall = new Stall(this, GAME_WIDTH / 2, 830, loadedSave.snapshot.stallLevel);
    this.daySystem = new DaySystem();
    this.satisfactionSystem = new SatisfactionSystem();
    this.streakSystem = new StreakSystem();
    this.offlineEarningsSystem = new OfflineEarningsSystem();
    this.orderSystem = new OrderSystem(FOODS, () => this.progressionSystem.getStallLevel());
    this.rushHourSystem = new RushHourSystem();

    this.hud = new HUD(
      this,
      () => {
        this.handleRushHourRequest();
      },
      () => {
        this.handleResetSave();
      },
      () => {
        this.handleHelpRequest();
      },
      () => {
        this.handleSoundToggle();
      },
      () => {
        this.handleStartDayRequest();
      },
      this.audioSystem.isEnabled(),
    );
    this.hud.updateCoins(this.economySystem.getCoins());
    this.hud.updateRushState(this.rushHourSystem.getState());
    this.hud.updateDayState(this.daySystem.getState());
    this.hud.updateStreak(this.streakSystem.getCurrentStreak(), this.streakSystem.getBestStreak());
    this.renderProgression();

    this.upgradePanel = new UpgradePanel(this, (upgradeId) => {
      this.handleBuyUpgrade(upgradeId);
    });
    this.renderUpgradePanel();

    this.foodStation = new FoodStation(
      this,
      GAME_WIDTH / 2,
      905,
      (slotIndex) => {
        this.handleFoodSlotTap(slotIndex);
      },
      (foodIds) => {
        this.handleFoodDiscard(foodIds);
      }
    );

    this.customerSystem = new CustomerSystem({
      scene: this,
      customers: CUSTOMERS,
      spawnPoint: { x: GAME_WIDTH / 2, y: 520 },
      getStallLevel: () => this.progressionSystem.getStallLevel(),
      getPatienceBonusMs: () => this.upgradeSystem.getPatienceBonusMs(),
      createOrder: (customer) => this.orderSystem.createOrder(customer),
      onCustomerSelected: () => {
        this.handleCustomerTap();
      },
      onCustomerExpired: (customerState) => {
        this.handleCustomerExpired(customerState);
      },
    });

    this.hud.setStartDayVisible(true);
    this.hud.setMessage(this.getLoadedSaveMessage(loadedSave.status));
    this.hud.updateFoodState('Tap Start Day when ready.');
    this.showOfflineRewardIfAvailable(loadedSave);
  }

  update(_time: number, delta: number): void {
    const endedRush = this.rushHourSystem.update(delta);
    this.hud.updateRushState(this.rushHourSystem.getState());

    if (this.daySystem.getState().isActive) {
      this.customerSystem.update(delta);
    }

    if (endedRush) {
      this.audioSystem.play('rush_end');
      this.hud.setMessage('Rush Hour ended. Normal rewards and pacing are back.');
      this.showFloatingText('Rush Ended', GAME_WIDTH / 2, 300, '#ffd166');
    }
  }

  private handleStartDayRequest(): void {
    this.audioSystem.unlock();
    this.audioSystem.play('button_tap');

    if (this.daySystem.getState().isActive) {
      this.hud.setMessage('Day already running. Finish these customers first.');
      return;
    }

    this.daySummaryPanel?.destroy();
    this.daySummaryPanel = undefined;
    this.foodStation.clearAll();
    this.customerSystem.clear();
    this.daySystem.startDay();
    this.satisfactionSystem.startDay();
    this.streakSystem.startDay();
    this.hud.setStartDayVisible(false);
    this.hud.updateDayState(this.daySystem.getState());
    this.hud.updateSatisfaction(this.satisfactionSystem.getSatisfaction());
    this.hud.updateStreak(this.streakSystem.getCurrentStreak(), this.streakSystem.getBestStreak());
    this.hud.updateFoodState('Read the order. Tap an empty slot to cook.');
    this.hud.setMessage('Day started. Serve 6 customers before patience runs out.');
    this.customerSystem.spawnNextCustomer();
  }

  private handleFoodSlotTap(slotIndex: number): void {
    this.audioSystem.unlock();
    const dayState = this.daySystem.getState();

    if (!dayState.isActive) {
      this.audioSystem.play('button_tap');
      this.hud.setMessage('Tap Start Day before cooking.');
      return;
    }

    const slot = this.foodStation.getSlotSnapshots()[slotIndex];

    if (!slot) {
      return;
    }

    if (slot.state === 'ready' || slot.state === 'cooking') {
      const foodId = this.foodStation.selectReadySlot(slotIndex);
      this.audioSystem.play('button_tap');
      this.updateDayHud();
      this.hud.updateFoodState(this.getSelectedFoodMessage());
      if (slot.state === 'cooking') {
        this.hud.setMessage('Cooking item selected. Tap Discard to clear slot.');
      } else {
        this.hud.setMessage(foodId ? 'Ready food selected. Tap the customer to serve.' : 'Select ready food to serve.');
      }
      return;
    }

    if (slot.state === 'burnt') {
      this.foodStation.clearSlot(slotIndex);
      this.updateDayHud();
      this.audioSystem.play('button_tap');
      this.hud.updateFoodState('Burnt food cleared.');
      this.hud.setMessage('Burnt food cleared. Use an empty slot for the next item.');
      this.showFloatingText('Burnt cleared', GAME_WIDTH / 2, 905, '#ffd166');
      return;
    }

    const order = this.customerSystem.getActiveOrder();

    if (!order) {
      this.audioSystem.play('button_tap');
      this.hud.setMessage('No customer waiting. Watch the day counter.');
      return;
    }

    const nextFood = this.getNextNeededFood(order);

    if (!nextFood) {
      this.audioSystem.play('button_tap');
      this.hud.setMessage('All order items are already cooking or ready.');
      return;
    }

    const prepTimeMs = this.upgradeSystem.getAdjustedPrepTime(nextFood);
    const started = this.foodStation.startCooking(
      slotIndex,
      nextFood,
      prepTimeMs,
      nextFood.readyWindowMs,
      (_readySlotIndex, readyFood) => {
        this.audioSystem.play('food_ready');
        this.hud.setMessage(`${readyFood.name} ready. Tap its slot, then tap the customer.`);
        this.hud.updateFoodState(`${readyFood.name} ready`);
      },
      (_burntSlotIndex, burntFood) => {
        this.audioSystem.play('button_tap');
        this.satisfactionSystem.recordBurntFood();
        this.streakSystem.reset();
        this.updateDayHud();
        this.hud.setMessage(`${burntFood.name} burned. Tap burnt slot to clear it.`);
        this.hud.updateFoodState(`${burntFood.name} burned`);
        this.showFloatingText('Burnt Food', GAME_WIDTH / 2, 620, '#ffb3b3');
      },
    );

    if (!started) {
      this.audioSystem.play('button_tap');
      return;
    }

    this.audioSystem.play('food_prep_start');
    this.hud.updateFoodState(`Cooking ${nextFood.name} (${(prepTimeMs / 1000).toFixed(1)}s)`);
    this.hud.setMessage(`Cooking ${nextFood.name}. Ready food can burn if ignored.`);
  }

  private handleFoodDiscard(foodIds: string[]): void {
    this.audioSystem.play('button_tap');
    this.updateDayHud();
    this.hud.updateFoodState(this.getSelectedFoodMessage());
    this.hud.setMessage('Discarded unwanted food from grill.');
    this.showFloatingText('Discarded', GAME_WIDTH / 2, 905, '#ffb3b3');
  }

  private handleCustomerTap(): void {
    this.audioSystem.unlock();

    if (!this.daySystem.getState().isActive) {
      this.audioSystem.play('button_tap');
      this.hud.setMessage('Tap Start Day first.');
      return;
    }

    const activeCustomer = this.customerSystem.getActiveCustomer();
    const order = activeCustomer?.order;

    if (!activeCustomer || !order) {
      this.audioSystem.play('button_tap');
      this.hud.setMessage('No customer waiting yet.');
      return;
    }

    const selectedFoodIds = this.foodStation.getSelectedReadyFoodIds();

    if (selectedFoodIds.length === 0) {
      this.audioSystem.play('button_tap');
      this.hud.setMessage('No food selected. Tap a ready food slot first.');
      this.showFloatingText('No food selected', GAME_WIDTH / 2, 470, '#ffb3b3');
      return;
    }

    const orderCheck = this.orderSystem.checkOrder(order, selectedFoodIds);

    if (!orderCheck.isCorrect) {
      this.handleWrongOrder();
      return;
    }

    const servedCustomer = this.customerSystem.removeActiveCustomerAsServed();

    if (!servedCustomer) {
      return;
    }

    this.foodStation.consumeSelectedReadyFoodIds();
    const isFastServe = servedCustomer.remainingPatienceMs / servedCustomer.patienceMs >= 0.55;
    const currentStreak = this.streakSystem.recordCorrectOrder();
    const baseCoins = this.awardCorrectOrderBaseCoins(order);
    const tipsEarned = this.awardTipCoins(baseCoins, servedCustomer, isFastServe);
    const progress = this.progressionSystem.awardServiceProgress(this.getServiceXp(order));
    const satisfaction = this.satisfactionSystem.recordCorrectServe(isFastServe);
    const summary = this.daySystem.recordServed(
      baseCoins + tipsEarned,
      tipsEarned,
      satisfaction,
      this.streakSystem.getBestStreak(),
    );

    this.saveGame();
    this.updatePostServiceHud();
    this.audioSystem.play('serve_success');
    this.audioSystem.play('coin_gain');
    this.showFloatingText(`+${baseCoins + tipsEarned} coins`, GAME_WIDTH / 2, 470, '#7bd88f');

    if (isFastServe) {
      this.showFloatingText(currentStreak > 1 ? `Fast Streak x${currentStreak}` : 'Fast Serve', GAME_WIDTH / 2, 420, '#ffd166');
    }

    if (progress.didLevelUp) {
      this.celebrateLevelUp(progress.currentLevel);
    }

    if (summary) {
      this.handleDayComplete(summary);
      return;
    }

    this.hud.setMessage(this.getServedMessage(baseCoins, tipsEarned, isFastServe, progress.didLevelUp, progress.currentLevel));
    this.hud.updateFoodState('Next customer incoming.');
    this.customerSystem.scheduleNextCustomer(
      this.rushHourSystem.getSpawnIntervalMultiplier(),
      this.upgradeSystem.getSpawnDelayReductionMs(),
    );
  }

  private handleWrongOrder(): void {
    this.foodStation.consumeSelectedReadyFoodIds();
    this.customerSystem.removeActiveCustomerAsFailed();
    const satisfaction = this.satisfactionSystem.recordWrongOrder();
    this.streakSystem.reset();
    const summary = this.daySystem.recordMissed(satisfaction, this.streakSystem.getBestStreak());
    this.updateDayHud();
    this.hud.updateFoodState('Wrong order served.');
    this.hud.setMessage('Wrong Order. Check the bubble before serving.');
    this.showFloatingText('Wrong Order', GAME_WIDTH / 2, 470, '#ffb3b3');

    if (summary) {
      this.handleDayComplete(summary);
      return;
    }

    this.customerSystem.scheduleNextCustomer(
      this.rushHourSystem.getSpawnIntervalMultiplier(),
      this.upgradeSystem.getSpawnDelayReductionMs(),
    );
  }

  private handleCustomerExpired(_customerState: CustomerState): void {
    const satisfaction = this.satisfactionSystem.recordCustomerLeft();
    this.streakSystem.reset();
    const summary = this.daySystem.recordMissed(satisfaction, this.streakSystem.getBestStreak());
    this.updateDayHud();
    this.hud.updateFoodState('Customer left.');
    this.hud.setMessage('Customer Left. Serve before patience runs out.');
    this.showFloatingText('Customer Left', GAME_WIDTH / 2, 470, '#ffb3b3');

    if (summary) {
      this.handleDayComplete(summary);
      return;
    }

    this.customerSystem.scheduleNextCustomer(
      this.rushHourSystem.getSpawnIntervalMultiplier(),
      this.upgradeSystem.getSpawnDelayReductionMs(),
    );
  }

  private handleDayComplete(summary: DaySummary): void {
    this.foodStation.clearAll();
    this.customerSystem.clear();
    this.customerSystem.setActiveCustomerReadyState('waiting');
    this.saveGame();
    this.hud.setStartDayVisible(true);
    this.hud.updateDayState(this.daySystem.getState());
    this.hud.updateFoodState('Day complete.');
    this.hud.setMessage('Review the day summary, then start another day.');
    this.daySummaryPanel?.destroy();
    this.daySummaryPanel = new DaySummaryPanel(this, summary, this.progressionSystem.getStallLevel(), () => {
      this.audioSystem.unlock();
      this.audioSystem.play('button_tap');
      this.daySummaryPanel?.destroy();
      this.daySummaryPanel = undefined;
      this.hud.setMessage('Tap Start Day for another short shift.');
    });
  }

  private handleBuyUpgrade(upgradeId: string): void {
    this.audioSystem.unlock();
    this.audioSystem.play('button_tap');
    const purchase = this.upgradeSystem.purchaseUpgrade(
      upgradeId,
      this.economySystem,
      this.progressionSystem.getStallLevel(),
    );

    if (!purchase.success) {
      this.renderUpgradePanel();
      this.hud.setMessage(this.getPurchaseFailureMessage(purchase.reason));
      return;
    }

    this.saveGame();
    this.hud.updateCoins(this.economySystem.getCoins());
    this.renderUpgradePanel();
    this.hud.setMessage(`Upgrade purchased. Level ${purchase.level}.`);
    this.audioSystem.play('upgrade_bought');
    this.showFloatingText('Upgrade Bought', GAME_WIDTH / 2, 1012, '#7bd88f');
  }

  private handleRushHourRequest(): void {
    this.audioSystem.unlock();
    this.audioSystem.play('button_tap');
    const started = this.rushHourSystem.startRushHour();
    this.hud.updateRushState(this.rushHourSystem.getState());

    if (!started) {
      this.hud.setMessage('Rush hour is already active.');
      return;
    }

    this.hud.setMessage('Rush Hour active: correct orders earn 2x base coins.');
    this.audioSystem.play('rush_start');
    this.showFloatingText('Rush Hour', GAME_WIDTH / 2, 300, '#ffd166');
  }

  private handleResetSave(): void {
    this.audioSystem.unlock();
    this.audioSystem.play('button_tap');
    this.saveSystem.reset();
    this.scene.restart();
  }

  private handleHelpRequest(): void {
    this.audioSystem.unlock();
    this.audioSystem.play('button_tap');
    if (this.helpPanel) {
      return;
    }

    this.helpPanel = new HelpPanel(this, () => {
      this.helpPanel?.destroy();
      this.helpPanel = undefined;
    });
  }

  private handleSoundToggle(): void {
    this.audioSystem.unlock();
    const nextEnabled = !this.audioSystem.isEnabled();
    this.audioSystem.setEnabled(nextEnabled);
    this.hud.updateSoundState(nextEnabled);
    this.saveGame();
    this.hud.setMessage(nextEnabled ? 'Sound enabled.' : 'Sound muted.');
    this.audioSystem.play('button_tap');
  }

  private handleCollectOfflineReward(): void {
    this.audioSystem.unlock();
    if (!this.pendingOfflineReward || !this.pendingOfflineReward.shouldReward) {
      this.offlineRewardPanel?.destroy();
      this.offlineRewardPanel = undefined;
      return;
    }

    const coinsAwarded = this.economySystem.awardCoins(this.pendingOfflineReward.coinsEarned);
    this.pendingOfflineReward = undefined;
    this.offlineRewardPanel?.destroy();
    this.offlineRewardPanel = undefined;
    this.saveGame();
    this.hud.updateCoins(this.economySystem.getCoins());
    this.renderUpgradePanel();
    this.hud.setMessage(`Offline earnings collected. +${coinsAwarded} coins.`);
    this.audioSystem.play('coin_gain');
    this.showFloatingText(`+${coinsAwarded} coins`, GAME_WIDTH / 2, 430, '#ffd166');
  }

  private awardCorrectOrderBaseCoins(order: CustomerOrder): number {
    const rewardMultiplier = this.rushHourSystem.getRewardMultiplier();
    const rewardBonus = this.upgradeSystem.getRewardBonus();
    const rawCoins = order.items.reduce((total, item) => {
      const food = this.findFood(item.foodId);
      return total + food.baseReward + rewardBonus;
    }, 0);

    return this.economySystem.awardCoins(Math.round(rawCoins * rewardMultiplier));
  }

  private awardTipCoins(baseCoins: number, customerState: CustomerState, isFastServe: boolean): number {
    if (!isFastServe) {
      return 0;
    }

    const customerTipBonus = Math.max(0, customerState.customer.tipMultiplier - 1);
    const tipMultiplier = this.streakSystem.getTipMultiplier() + customerTipBonus;
    return this.economySystem.awardCoins(Math.round(baseCoins * 0.18 * tipMultiplier));
  }

  private getNextNeededFood(order: CustomerOrder): FoodDefinition | undefined {
    const expectedCounts = this.createFoodCountMap(order.items.map((item) => item.foodId));
    const currentCounts = this.createFoodCountMap(
      this.foodStation
        .getSlotSnapshots()
        .filter((slot) => slot.foodId && (slot.state === 'cooking' || slot.state === 'ready'))
        .map((slot) => slot.foodId as string),
    );

    const nextItem = order.items.find((item) => {
      const expectedCount = expectedCounts.get(item.foodId) ?? 0;
      const currentCount = currentCounts.get(item.foodId) ?? 0;
      return currentCount < expectedCount;
    });

    return nextItem ? this.findFood(nextItem.foodId) : undefined;
  }

  private createFoodCountMap(foodIds: readonly string[]): Map<string, number> {
    return foodIds.reduce((counts, foodId) => {
      counts.set(foodId, (counts.get(foodId) ?? 0) + 1);
      return counts;
    }, new Map<string, number>());
  }

  private updatePostServiceHud(): void {
    this.hud.updateCoins(this.economySystem.getCoins());
    this.renderProgression();
    this.renderUpgradePanel();
    this.updateDayHud();
  }

  private updateDayHud(): void {
    this.hud.updateDayState(this.daySystem.getState());
    this.hud.updateSatisfaction(this.satisfactionSystem.getSatisfaction());
    this.hud.updateStreak(this.streakSystem.getCurrentStreak(), this.streakSystem.getBestStreak());
    
    const order = this.customerSystem.getActiveOrder();
    const selectedFoodIds = this.foodStation.getSelectedReadyFoodIds();
    if (!order || selectedFoodIds.length === 0) {
      this.customerSystem.setActiveCustomerReadyState('waiting');
    } else {
      const isCorrectMatch = this.orderSystem.checkOrder(order, selectedFoodIds).isCorrect;
      this.customerSystem.setActiveCustomerReadyState(isCorrectMatch ? 'ready' : 'mismatch');
    }
  }

  private getSelectedFoodMessage(): string {
    const selectedReadyNames = this.foodStation.getSelectedReadyFoodNames();
    const selectedCookingNames = this.foodStation.getSelectedCookingFoodNames();

    const parts: string[] = [];
    if (selectedReadyNames.length > 0) {
      parts.push(`Ready: ${selectedReadyNames.join(' + ')}`);
    }
    if (selectedCookingNames.length > 0) {
      parts.push(`Cooking: ${selectedCookingNames.join(' + ')}`);
    }

    if (parts.length === 0) {
      return 'No food selected';
    }

    return parts.join(' | ');
  }

  private renderUpgradePanel(): void {
    this.upgradePanel.render(
      this.upgradeSystem.getUpgradeStates(
        this.economySystem.getCoins(),
        this.progressionSystem.getStallLevel(),
      ),
    );
  }

  private renderProgression(): void {
    const progression = this.progressionSystem.getState();
    this.hud.updateProgression(progression.stallLevel, progression.stallXp, progression.nextLevelXp);
    if (this.stall) {
      this.stall.setLevel(progression.stallLevel);
    }
  }

  private showOfflineRewardIfAvailable(loadedSave: LoadedSave): void {
    if (!loadedSave.canGrantOfflineEarnings) {
      return;
    }

    const stallLevel = this.progressionSystem.getStallLevel();
    const reward = this.offlineEarningsSystem.calculate({
      lastSavedAt: loadedSave.lastSavedAt,
      now: Date.now(),
      stallLevel,
      unlockedFoodCount: this.getUnlockedFoodCount(stallLevel),
      foodValueUpgradeLevel: this.upgradeSystem.getLevel('food_value'),
    });

    if (!reward.shouldReward) {
      return;
    }

    this.pendingOfflineReward = reward;
    this.offlineRewardPanel = new OfflineRewardPanel(this, reward, () => {
      this.handleCollectOfflineReward();
    });
  }

  private saveGame(): void {
    this.saveSystem.save({
      coins: this.economySystem.getCoins(),
      upgrades: this.upgradeSystem.getUpgradeLevels(),
      stallLevel: this.progressionSystem.getStallLevel(),
      stallXp: this.progressionSystem.getStallXp(),
      settings: {
        soundEnabled: this.audioSystem.isEnabled(),
      },
    });
  }

  private findFood(foodId: string): FoodDefinition {
    const food = FOODS.find((candidate) => candidate.id === foodId);

    if (!food) {
      throw new Error(`Unknown food id: ${foodId}`);
    }

    return food;
  }

  private getUnlockedFoodCount(stallLevel: number): number {
    return FOODS.filter((food) => food.unlockStallLevel <= stallLevel).length;
  }

  private getServiceXp(order: CustomerOrder): number {
    const highestUnlockLevel = Math.max(...order.items.map((item) => this.findFood(item.foodId).unlockStallLevel));
    return 12 + highestUnlockLevel * 3 + (order.items.length - 1) * 4;
  }

  private getLoadedSaveMessage(status: string): string {
    if (status === 'repaired') {
      return 'Save repaired. Tap Start Day to begin the cooking shift.';
    }

    if (status === 'reset') {
      return 'Save reset. Tap Start Day to begin.';
    }

    return 'Tap Start Day. Then cook the exact customer order before patience runs out.';
  }

  private getPurchaseFailureMessage(reason: string): string {
    if (reason === 'not_enough_coins') {
      this.showFloatingText('Not Enough Coins', GAME_WIDTH / 2, 1012, '#ffb3b3');
      return 'Serve more correct orders to afford that upgrade.';
    }

    if (reason === 'max_level') {
      return 'That upgrade is already maxed.';
    }

    if (reason === 'locked') {
      return 'Raise your stall level to unlock that upgrade.';
    }

    return 'Upgrade is unavailable.';
  }

  private showFloatingText(message: string, x: number, y: number, color: string): void {
    const feedbackText = this.add
      .text(x, y, message, {
        align: 'center',
        color,
        fontFamily: 'Arial, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        stroke: '#11131e',
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: feedbackText,
      y: y - 36,
      alpha: 0,
      duration: 950,
      ease: 'Sine.easeOut',
      onComplete: () => {
        feedbackText.destroy();
      },
    });
  }

  private getServedMessage(
    baseCoins: number,
    tipsEarned: number,
    isFastServe: boolean,
    didLevelUp: boolean,
    stallLevel: number,
  ): string {
    if (didLevelUp) {
      return `Stall level ${stallLevel}! New menu options unlocked.`;
    }

    const tipText = tipsEarned > 0 ? ` +${tipsEarned} tip` : '';

    if (this.rushHourSystem.isActive()) {
      return `Rush serve. +${baseCoins} coins${tipText}.`;
    }

    if (isFastServe) {
      return `Fast Serve. +${baseCoins} coins${tipText}.`;
    }

    return `Correct order. +${baseCoins} coins.`;
  }

  private celebrateLevelUp(level: number): void {
    this.audioSystem.play('level_up');
    
    const flash = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xfff7df, 0.4);
    flash.setDepth(3000);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 350,
      ease: 'Sine.easeOut',
      onComplete: () => flash.destroy()
    });

    const titleText = this.add.text(GAME_WIDTH / 2, 420, 'STALL UPGRADED!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#ffd166',
      stroke: '#11131e',
      strokeThickness: 8
    }).setOrigin(0.5).setScale(0.5).setDepth(2500);

    const descText = this.add.text(GAME_WIDTH / 2, 474, `Stage ${level}: ${this.getStallStageName(level)}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#7bd88f',
      stroke: '#11131e',
      strokeThickness: 6
    }).setOrigin(0.5).setScale(0.5).setDepth(2500);

    this.tweens.add({
      targets: [titleText, descText],
      scale: 1.1,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: [titleText, descText],
          y: (target: unknown) => (target === titleText ? 360 : 414),
          alpha: 0,
          delay: 1100,
          duration: 500,
          ease: 'Sine.easeIn',
          onComplete: () => {
            titleText.destroy();
            descText.destroy();
          }
        });
      }
    });
  }

  private getStallStageName(level: number): string {
    const stageNames = [
      'Tiny Push Cart',
      'Better Grill Setup',
      'Menu Board & Sign',
      'Fairy Lights & Counter',
      'Full Kingston Booth'
    ];
    return stageNames[Phaser.Math.Clamp(level - 1, 0, 4)];
  }
}

import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config/constants';
import { FOODS } from '../data/foods';
import { CUSTOMERS } from '../data/customers';
import { UPGRADES } from '../data/upgrades';
import { CustomerSystem } from '../systems/CustomerSystem';
import { EconomySystem } from '../systems/EconomySystem';
import { SaveSystem } from '../systems/SaveSystem';
import { OfflineEarningsSystem } from '../systems/OfflineEarningsSystem';
import { RushHourSystem } from '../systems/RushHourSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { FoodStation } from '../entities/FoodStation';
import { Stall } from '../entities/Stall';
import { HUD } from '../ui/HUD';
import { HelpPanel } from '../ui/HelpPanel';
import { OfflineRewardPanel } from '../ui/OfflineRewardPanel';
import { UpgradePanel } from '../ui/UpgradePanel';
import type { FoodDefinition, LoadedSave, OfflineEarningsResult } from '../types/gameTypes';

export class MainScene extends Phaser.Scene {
  private customerSystem!: CustomerSystem;
  private economySystem!: EconomySystem;
  private saveSystem!: SaveSystem;
  private offlineEarningsSystem!: OfflineEarningsSystem;
  private rushHourSystem!: RushHourSystem;
  private upgradeSystem!: UpgradeSystem;
  private progressionSystem!: ProgressionSystem;
  private foodStation!: FoodStation;
  private hud!: HUD;
  private upgradePanel!: UpgradePanel;
  private helpPanel?: HelpPanel;
  private offlineRewardPanel?: OfflineRewardPanel;
  private pendingOfflineReward?: OfflineEarningsResult;

  constructor() {
    super(SCENE_KEYS.MAIN);
  }

  create(): void {
    this.createMarketBackdrop();

    new Stall(this, GAME_WIDTH / 2, 830);

    this.saveSystem = new SaveSystem(UPGRADES);
    const loadedSave = this.saveSystem.load();

    this.economySystem = new EconomySystem(loadedSave.snapshot.coins);
    this.upgradeSystem = new UpgradeSystem(UPGRADES, loadedSave.snapshot.upgrades);
    this.progressionSystem = new ProgressionSystem(
      loadedSave.snapshot.stallLevel,
      loadedSave.snapshot.stallXp,
    );
    this.offlineEarningsSystem = new OfflineEarningsSystem();
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
    );
    this.hud.updateCoins(this.economySystem.getCoins());
    this.hud.updateRushState(this.rushHourSystem.getState());
    this.renderProgression();

    this.upgradePanel = new UpgradePanel(this, (upgradeId) => {
      this.handleBuyUpgrade(upgradeId);
    });
    this.renderUpgradePanel();

    this.foodStation = new FoodStation(this, GAME_WIDTH / 2, 905, () => {
      this.handleFoodStationTap();
    });

    this.customerSystem = new CustomerSystem({
      scene: this,
      customers: CUSTOMERS,
      foods: FOODS,
      spawnPoint: { x: GAME_WIDTH / 2, y: 520 },
      getStallLevel: () => this.progressionSystem.getStallLevel(),
      getPatienceBonusMs: () => this.upgradeSystem.getPatienceBonusMs(),
      onCustomerSelected: () => {
        this.handleCustomerTap();
      },
    });

    this.customerSystem.spawnNextCustomer();
    this.hud.setMessage(this.getLoadedSaveMessage(loadedSave.status));
    this.showOfflineRewardIfAvailable(loadedSave);
  }

  update(_time: number, delta: number): void {
    const endedRush = this.rushHourSystem.update(delta);
    this.hud.updateRushState(this.rushHourSystem.getState());

    if (endedRush) {
      this.hud.setMessage('Rush Hour ended. Normal rewards and pacing are back.');
    }
  }

  private handleFoodStationTap(): void {
    const order = this.customerSystem.getActiveOrder();

    if (!order) {
      this.hud.setMessage('No customer waiting yet.');
      this.hud.updateFoodState('Station idle');
      return;
    }

    const food = this.findFood(order.foodId);
    const prepTimeMs = this.upgradeSystem.getAdjustedPrepTime(food);
    const started = this.foodStation.startPreparing(food, prepTimeMs, () => {
      this.hud.setMessage(`${food.name} ready. Tap the customer order bubble.`);
      this.hud.updateFoodState(`${food.name} ready`);
      this.customerSystem.setActiveCustomerReady(true);
    });

    if (started) {
      this.hud.setMessage(`Preparing ${food.name}...`);
      this.hud.updateFoodState(`Cooking ${food.name} (${(prepTimeMs / 1000).toFixed(1)}s)`);
      this.customerSystem.setActiveCustomerReady(false);
      return;
    }

    if (this.foodStation.isPreparing()) {
      this.hud.setMessage('Cooking now. Watch the green bar fill.');
      return;
    }

    this.hud.setMessage('Food is ready. Tap the customer order bubble.');
  }

  private handleCustomerTap(): void {
    const preparedFoodId = this.foodStation.getPreparedFoodId();

    if (!preparedFoodId) {
      this.hud.setMessage('Tap the grill first to prepare this order.');
      return;
    }

    const served = this.customerSystem.tryServeActiveCustomer(preparedFoodId);

    if (!served.success) {
      this.hud.setMessage('That order is not ready yet.');
      return;
    }

    this.foodStation.consumePreparedFood(preparedFoodId);

    const food = this.findFood(served.foodId);
    const customer = CUSTOMERS.find((candidate) => candidate.id === served.customerTypeId);

    if (!customer) {
      return;
    }

    const coinsEarned = this.economySystem.awardCustomerOrder(
      food,
      customer,
      this.rushHourSystem.getRewardMultiplier(),
      this.upgradeSystem.getRewardBonus(),
    );
    const progress = this.progressionSystem.awardServiceProgress(this.getServiceXp(food));
    this.saveGame();
    this.hud.updateCoins(this.economySystem.getCoins());
    this.renderProgression();
    this.renderUpgradePanel();
    this.hud.updateFoodState('Station idle');
    this.hud.setMessage(this.getServedMessage(coinsEarned, progress.didLevelUp, progress.currentLevel));
    this.showFloatingText(`+${coinsEarned} coins`, GAME_WIDTH / 2, 470, '#7bd88f');

    if (progress.didLevelUp) {
      this.showFloatingText(`Level ${progress.currentLevel}`, GAME_WIDTH / 2, 380, '#ffd166');
    }

    this.customerSystem.scheduleNextCustomer(
      this.rushHourSystem.getSpawnIntervalMultiplier(),
      this.upgradeSystem.getSpawnDelayReductionMs(),
    );
  }

  private handleBuyUpgrade(upgradeId: string): void {
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
    this.showFloatingText('Upgrade Bought', GAME_WIDTH / 2, 1012, '#7bd88f');
  }

  private handleRushHourRequest(): void {
    const started = this.rushHourSystem.startRushHour();
    this.hud.updateRushState(this.rushHourSystem.getState());

    if (!started) {
      this.hud.setMessage('Rush hour is already active.');
      return;
    }

    this.hud.setMessage('Rush Hour active: serve fast for 2x coins.');
    this.showFloatingText('Rush Hour', GAME_WIDTH / 2, 300, '#ffd166');
  }

  private handleResetSave(): void {
    this.saveSystem.reset();
    this.scene.restart();
  }

  private handleHelpRequest(): void {
    if (this.helpPanel) {
      return;
    }

    this.helpPanel = new HelpPanel(this, () => {
      this.helpPanel?.destroy();
      this.helpPanel = undefined;
    });
  }

  private handleCollectOfflineReward(): void {
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
    this.showFloatingText(`+${coinsAwarded} coins`, GAME_WIDTH / 2, 430, '#ffd166');
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

  private getServiceXp(food: FoodDefinition): number {
    return 12 + food.unlockStallLevel * 3;
  }

  private getLoadedSaveMessage(status: string): string {
    if (status === 'repaired') {
      return 'Save repaired. Tap the grill to prepare the next order.';
    }

    if (status === 'reset') {
      return 'Save reset. Tap the grill to prepare the next order.';
    }

    return 'Tap the grill to prepare the customer order.';
  }

  private getPurchaseFailureMessage(reason: string): string {
    if (reason === 'not_enough_coins') {
      this.showFloatingText('Not Enough Coins', GAME_WIDTH / 2, 1012, '#ffb3b3');
      return 'Serve more customers to afford the grill upgrade.';
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

  private getServedMessage(coinsEarned: number, didLevelUp: boolean, stallLevel: number): string {
    if (didLevelUp) {
      return `Stall level ${stallLevel}! New menu options unlocked.`;
    }

    if (this.rushHourSystem.isActive()) {
      return `Rush serve. +${coinsEarned} coins.`;
    }

    return `Served order. +${coinsEarned} coins.`;
  }

  private createMarketBackdrop(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.skyTop);
    this.add.rectangle(GAME_WIDTH / 2, 360, GAME_WIDTH, 260, 0x1a2440, 0.55);
    this.add.rectangle(GAME_WIDTH / 2, 830, GAME_WIDTH, 900, COLORS.skyBottom);
    this.add.rectangle(GAME_WIDTH / 2, 1085, GAME_WIDTH, 390, COLORS.street);

    this.add
      .text(GAME_WIDTH / 2, 108, 'Kingston Night Market', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '46px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 160, 'Street Food Empire', {
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    for (let index = 0; index < 9; index += 1) {
      const x = 36 + index * 84;
      const y = 245 + (index % 2) * 28;
      this.add.circle(x, y, 8, COLORS.warning, 0.9);
      this.add.line(x, y, 0, 0, 48, 40, 0xfff0a8, 0.32).setOrigin(0, 0);
    }

    this.add.rectangle(GAME_WIDTH / 2, 690, GAME_WIDTH, 34, 0x3d2f36, 0.7);
  }
}

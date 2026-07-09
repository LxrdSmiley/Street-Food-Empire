import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
import { FeedbackEffects } from './FeedbackEffects';
import { formatCoins } from '../utils/format';
import type { UpgradeState } from '../types/gameTypes';

export class UpgradePanel extends Phaser.GameObjects.Container {
  private readonly backdrop: Phaser.GameObjects.Rectangle;
  private readonly panelBg: Phaser.GameObjects.Graphics;
  private readonly titleText: Phaser.GameObjects.Text;
  private readonly closeXText: Phaser.GameObjects.Text;
  private readonly closeButton: Phaser.GameObjects.Graphics;
  private readonly closeButtonText: Phaser.GameObjects.Text;

  private readonly rows: Phaser.GameObjects.GameObject[] = [];
  private readonly rowBackgrounds = new Map<string, Phaser.GameObjects.Rectangle>();
  private readonly onBuyUpgrade: (upgradeId: string) => void;
  private readonly onClose: () => void;
  private latestUpgradeStates: readonly UpgradeState[] = [];

  constructor(scene: Phaser.Scene, onBuyUpgrade: (upgradeId: string) => void, onClose: () => void) {
    super(scene, 0, 0);
    this.onBuyUpgrade = onBuyUpgrade;
    this.onClose = onClose;

    // Full-screen semi-transparent backdrop overlay
    this.backdrop = scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.7
    );
    this.backdrop.setInteractive();

    // Modal Card Graphic Bounds
    // Center card: width = 640, height = 590
    // Card bounds: x [40, 680], y [340, 930]
    const cardW = 640;
    const cardH = 590;
    const cardX = GAME_WIDTH / 2 - cardW / 2; // 40
    const cardY = GAME_HEIGHT / 2 - cardH / 2 - 10; // 335

    this.panelBg = scene.add.graphics();
    this.panelBg.fillStyle(COLORS.hudPanel, 0.97);
    this.panelBg.lineStyle(3.5, COLORS.hudStroke, 1);
    this.panelBg.fillRoundedRect(cardX, cardY, cardW, cardH, 14);
    this.panelBg.strokeRoundedRect(cardX, cardY, cardW, cardH, 14);

    // Title
    this.titleText = scene.add
      .text(cardX + 32, cardY + 40, 'Equipment & Stall Upgrades', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);
    this.titleText.setStroke('#11131e', 3);

    // Close "X" Button (Top-Right)
    this.closeXText = scene.add
      .text(cardX + cardW - 40, cardY + 40, '✕', {
        color: '#94a3b8',
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Close Button (Bottom)
    const btnY = cardY + cardH - 45; // 335 + 590 - 45 = 880
    this.closeButton = scene.add.graphics();
    this.closeButtonText = scene.add
      .text(GAME_WIDTH / 2, btnY, 'Close Upgrades', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.drawRoundedButton(this.closeButton, GAME_WIDTH / 2, btnY, 240, 48, COLORS.success, 0xffffff);

    this.add([
      this.backdrop,
      this.panelBg,
      this.titleText,
      this.closeXText,
      this.closeButton,
      this.closeButtonText,
    ]);

    this.setDepth(1700);
    scene.add.existing(this);

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    });
  }

  render(upgradeStates: readonly UpgradeState[]): void {
    this.latestUpgradeStates = upgradeStates;
    this.rows.forEach((rowObject) => rowObject.destroy());
    this.rows.length = 0;
    this.rowBackgrounds.clear();

    const cardY = GAME_HEIGHT / 2 - 590 / 2 - 10; // 335
    // Render 4 rows vertically spaced out inside the card (Y positions: 490, 575, 660, 745)
    upgradeStates.forEach((upgradeState, index) => {
      const y = cardY + 115 + index * 85;
      const rowObjects = this.createRow(upgradeState, y);
      this.rows.push(...rowObjects);
      this.add(rowObjects);
    });
  }

  flashUpgrade(upgradeId: string): void {
    const rowBg = this.rowBackgrounds.get(upgradeId);

    if (!rowBg) {
      FeedbackEffects.pulse(this.scene, this, 1.02);
      return;
    }

    rowBg.setFillStyle(0x284c34, 0.92);
    FeedbackEffects.pulse(this.scene, rowBg, 1.02);
    this.scene.tweens.add({
      targets: rowBg,
      alpha: 0.55,
      duration: 120,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        rowBg.setAlpha(1);
        rowBg.setFillStyle(0x1d1e26, 0.75);
      },
    });
  }

  private createRow(upgradeState: UpgradeState, y: number): Phaser.GameObjects.GameObject[] {
    const scene = this.scene;

    // Row Background Card (w = 580, h = 68, centered at GAME_WIDTH / 2)
    const rowBg = scene.add.rectangle(GAME_WIDTH / 2, y, 580, 68, 0x1d1e26, 0.75).setStrokeStyle(1.5, 0x2e303d);
    this.rowBackgrounds.set(upgradeState.definition.id, rowBg);

    const recommendedId = this.getRecommendedUpgradeId(upgradeState);
    const displayName = upgradeState.definition.id === recommendedId
      ? `${upgradeState.definition.name} (Recommended)`
      : upgradeState.definition.name;

    const label = scene.add
      .text(90, y, displayName, {
        color: upgradeState.definition.id === recommendedId ? '#ffd166' : (upgradeState.isUnlocked ? '#fff7df' : '#64748b'),
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    const level = scene.add
      .text(285, y, `Lv ${upgradeState.level}/${upgradeState.definition.maxLevel}`, {
        color: upgradeState.isMaxed ? '#7bd88f' : '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold'
      })
      .setOrigin(0, 0.5);

    const status = this.getStatusText(upgradeState);
    const costColor = upgradeState.isMaxed
      ? '#7bd88f'
      : !upgradeState.isUnlocked
      ? '#64748b'
      : upgradeState.canAfford
      ? '#7bd88f'
      : '#e85d5d';
    
    const statusText = scene.add
      .text(395, y, status, {
        color: costColor,
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold'
      })
      .setOrigin(0, 0.5);

    const canBuy = upgradeState.canAfford && !upgradeState.isMaxed && upgradeState.isUnlocked;
    
    // Styled Button with border
    const button = scene.add.rectangle(560, y, 140, 36, canBuy ? COLORS.success : 0x2a2c3a, 1);
    button.setStrokeStyle(1.5, canBuy ? 0xffffff : 0x475569);
    
    const buttonText = scene.add
      .text(560, y, this.getButtonText(upgradeState), {
        align: 'center',
        color: canBuy ? '#112015' : '#94a3b8',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    return [rowBg, label, level, statusText, button, buttonText];
  }

  private getStatusText(upgradeState: UpgradeState): string {
    if (!upgradeState.isUnlocked) {
      return `Stall Level ${upgradeState.unlockStallLevel}`;
    }

    if (upgradeState.isMaxed || upgradeState.cost === null) {
      return '⭐ Maxed';
    }

    return `${formatCoins(upgradeState.cost)} coins`;
  }

  private getButtonText(upgradeState: UpgradeState): string {
    if (!upgradeState.isUnlocked) {
      return 'Locked';
    }

    if (upgradeState.isMaxed) {
      return 'Max Level';
    }

    return upgradeState.canAfford ? 'Buy' : 'Locked';
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    const x = pointer.x;
    const y = pointer.y;

    const cardW = 640;
    const cardH = 590;
    const cardX1 = GAME_WIDTH / 2 - cardW / 2; // 40
    const cardX2 = GAME_WIDTH / 2 + cardW / 2; // 680
    const cardY1 = GAME_HEIGHT / 2 - cardH / 2 - 10; // 335
    const cardY2 = GAME_HEIGHT / 2 + cardH / 2 - 10; // 925

    // 1. Close on backdrop tap (outside card bounds)
    const isOutsideCard = x < cardX1 || x > cardX2 || y < cardY1 || y > cardY2;
    if (isOutsideCard) {
      this.onClose();
      return;
    }

    // 2. Close on X button tap (640, 375)
    const isInsideCloseX =
      x >= cardX2 - 50 &&
      x <= cardX2 - 10 &&
      y >= cardY1 + 20 &&
      y <= cardY1 + 60;

    if (isInsideCloseX) {
      this.onClose();
      return;
    }

    // 3. Close on Close button tap (GAME_WIDTH / 2, cardY1 + cardH - 45)
    const btnY = cardY1 + cardH - 45;
    const isInsideCloseBtn =
      x >= GAME_WIDTH / 2 - 120 &&
      x <= GAME_WIDTH / 2 + 120 &&
      y >= btnY - 24 &&
      y <= btnY + 24;

    if (isInsideCloseBtn) {
      this.onClose();
      return;
    }

    // 4. Check each row Buy Button (centered at x = 560, w = 140, h = 36)
    this.latestUpgradeStates.forEach((upgradeState, index) => {
      const canBuy = upgradeState.canAfford && !upgradeState.isMaxed && upgradeState.isUnlocked;

      if (!canBuy) {
        return;
      }

      const rowY = cardY1 + 115 + index * 85;
      const isInsideBuyButton =
        x >= 560 - 70 &&
        x <= 560 + 70 &&
        y >= rowY - 18 &&
        y <= rowY + 18;

      if (isInsideBuyButton) {
        this.onBuyUpgrade(upgradeState.definition.id);
      }
    });
  }

  private getRecommendedUpgradeId(upgradeState: UpgradeState): string | null {
    const mainScene = this.scene as any;
    if (!mainScene || !mainScene.upgradeSystem || !mainScene.economySystem || !mainScene.progressionSystem) {
      return null;
    }

    const states: UpgradeState[] = mainScene.upgradeSystem.getUpgradeStates(
      mainScene.economySystem.getCoins(),
      mainScene.progressionSystem.getStallLevel()
    );

    // 1. Prioritize Hotter Grill (grill_speed) if it is still level 0
    const grillSpeed = states.find((s) => s.definition.id === 'grill_speed');
    if (grillSpeed && grillSpeed.isUnlocked && grillSpeed.level === 0) {
      return 'grill_speed';
    }

    // 2. Recommend Better Portions (food_value) if unlocked and still level 0
    const foodValue = states.find((s) => s.definition.id === 'food_value');
    if (foodValue && foodValue.isUnlocked && foodValue.level === 0) {
      return 'food_value';
    }

    // 3. Otherwise, recommend the first unlocked, non-maxed upgrade
    const firstAvailable = states.find((s) => s.isUnlocked && !s.isMaxed);
    return firstAvailable ? firstAvailable.definition.id : null;
  }

  private drawRoundedButton(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    fillColor: number,
    strokeColor: number
  ): void {
    graphics.clear();
    graphics.fillStyle(fillColor, 1);
    graphics.lineStyle(2.5, strokeColor, 0.85);
    graphics.fillRoundedRect(x - w / 2, y - h / 2, w, h, 10);
    graphics.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 10);
  }
}

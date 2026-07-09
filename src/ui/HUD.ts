import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
import { FeedbackEffects } from './FeedbackEffects';
import { formatCoins } from '../utils/format';
import type { DayState, RushHourState } from '../types/gameTypes';

export class HUD {
  private readonly coinText: Phaser.GameObjects.Text;
  private readonly progressionText: Phaser.GameObjects.Text;
  private readonly dayText: Phaser.GameObjects.Text;
  private readonly satisfactionText: Phaser.GameObjects.Text;
  private readonly streakText: Phaser.GameObjects.Text;
  private readonly foodStateText: Phaser.GameObjects.Text;
  private readonly messageText: Phaser.GameObjects.Text;
  private readonly rushButton: Phaser.GameObjects.Graphics;
  private readonly rushButtonText: Phaser.GameObjects.Text;
  private readonly rushStateText: Phaser.GameObjects.Text;
  private readonly rushHitZone: Phaser.GameObjects.Zone;
  private readonly startButton: Phaser.GameObjects.Graphics;
  private readonly startButtonText: Phaser.GameObjects.Text;
  private readonly startHitZone: Phaser.GameObjects.Zone;

  // Compact management buttons at y = 214
  private readonly upgradesButton: Phaser.GameObjects.Graphics;
  private readonly upgradesButtonText: Phaser.GameObjects.Text;
  private readonly upgradesHitZone: Phaser.GameObjects.Zone;
  private readonly goalsButton: Phaser.GameObjects.Graphics;
  private readonly goalsButtonText: Phaser.GameObjects.Text;
  private readonly goalsHitZone: Phaser.GameObjects.Zone;
  private readonly menuButton: Phaser.GameObjects.Graphics;
  private readonly menuButtonText: Phaser.GameObjects.Text;
  private readonly menuHitZone: Phaser.GameObjects.Zone;

  private readonly onRushRequested: () => void;
  private readonly onUpgradesRequested: () => void;
  private readonly onMenuRequested: () => void;
  private readonly onGoalsRequested: () => void;
  private readonly onStartDayRequested: () => void;

  constructor(
    scene: Phaser.Scene,
    onRushRequested: () => void,
    onUpgradesRequested: () => void,
    onMenuRequested: () => void,
    onGoalsRequested: () => void,
    onStartDayRequested: () => void
  ) {
    this.onRushRequested = onRushRequested;
    this.onUpgradesRequested = onUpgradesRequested;
    this.onMenuRequested = onMenuRequested;
    this.onGoalsRequested = onGoalsRequested;
    this.onStartDayRequested = onStartDayRequested;

    // Draw Rounded Top Stats Panel
    const panel = scene.add.graphics();
    panel.fillStyle(COLORS.hudPanel, 0.94);
    panel.lineStyle(3.5, COLORS.hudStroke, 1);
    panel.fillRoundedRect(18, 6, GAME_WIDTH - 36, 122, 14);
    panel.strokeRoundedRect(18, 6, GAME_WIDTH - 36, 122, 14);

    // Coins
    const coinIcon = scene.add.circle(44, 30, 11, 0xffd166, 1).setStrokeStyle(1.5, 0xb07d50);
    const coinLetter = scene.add.text(44, 30, 'c', { color: '#6d3f28', fontSize: '12px', fontStyle: 'bold' }).setOrigin(0.5);
    this.coinText = scene.add
      .text(64, 30, 'Coins: 0', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    // XP
    const starIcon = scene.add.text(44, 70, '⭐', { fontSize: '15px' }).setOrigin(0.5);
    this.progressionText = scene.add
      .text(64, 70, 'Stall 1 | 0/45 XP', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    // Shift Progress (Customers)
    const dayIcon = scene.add.text(44, 100, '📋', { fontSize: '14px' }).setOrigin(0.5);
    this.dayText = scene.add
      .text(64, 100, 'Customers 0/6', {
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    // Center Column - Quality & Performance
    this.satisfactionText = scene.add
      .text(370, 30, 'Satisfaction 100%', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.satisfactionText.setStroke('#11131e', 3);

    this.streakText = scene.add
      .text(370, 62, 'Streak 0', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.streakText.setStroke('#11131e', 3);

    this.rushStateText = scene.add
      .text(370, 94, 'Rush inactive', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
      })
      .setOrigin(0.5);
    this.rushStateText.setStroke('#11131e', 3);

    // Right Column - Buttons
    this.rushButton = scene.add.graphics();
    this.drawRoundedButton(this.rushButton, 584, 36, 178, 52, COLORS.danger, 0xffffff);
    this.rushButtonText = scene.add
      .text(584, 36, 'Rush Hour', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.rushButtonText.setStroke('#11131e', 3);
    this.rushHitZone = scene.add.zone(584, 36, 206, 72).setInteractive({ useHandCursor: true });
    this.rushHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onRushRequested();
    });

    this.startButton = scene.add.graphics();
    this.drawRoundedButton(this.startButton, 584, 96, 178, 52, COLORS.success, 0xffffff);
    this.startButtonText = scene.add
      .text(584, 96, 'Start Day', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.startHitZone = scene.add.zone(584, 96, 206, 72).setInteractive({ useHandCursor: true });
    this.startHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onStartDayRequested();
    });

    // Row of Action Buttons at y = 214
    // Upgrades Button (x = 180, w = 160, h = 44)
    this.upgradesButton = scene.add.graphics();
    this.upgradesButtonText = scene.add
      .text(180, 214, 'Upgrades', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.drawRoundedButton(this.upgradesButton, 180, 214, 160, 44, 0x2d313e, COLORS.hudStroke);
    this.upgradesHitZone = scene.add.zone(180, 214, 180, 60).setInteractive({ useHandCursor: true });
    this.upgradesHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onUpgradesRequested();
    });

    // Goals Button (x = 360, w = 140, h = 44)
    this.goalsButton = scene.add.graphics();
    this.goalsButtonText = scene.add
      .text(360, 214, 'Goals', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.drawRoundedButton(this.goalsButton, 360, 214, 140, 44, 0x2d313e, COLORS.hudStroke);
    this.goalsHitZone = scene.add.zone(360, 214, 160, 60).setInteractive({ useHandCursor: true });
    this.goalsHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onGoalsRequested();
    });

    // Menu Button (x = 540, w = 140, h = 44)
    this.menuButton = scene.add.graphics();
    this.menuButtonText = scene.add
      .text(540, 214, 'Menu', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.drawRoundedButton(this.menuButton, 540, 214, 140, 44, 0x2d313e, COLORS.hudStroke);
    this.menuHitZone = scene.add.zone(540, 214, 160, 60).setInteractive({ useHandCursor: true });
    this.menuHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onMenuRequested();
    });

    // Low-clutter Status Texts at the Bottom
    this.foodStateText = scene.add
      .text(GAME_WIDTH / 2, 1210, 'Day idle', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        wordWrap: { width: GAME_WIDTH - 96 },
      })
      .setOrigin(0.5);
    this.foodStateText.setStroke('#11131e', 4);

    this.messageText = scene.add
      .text(GAME_WIDTH / 2, 1245, '', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        wordWrap: { width: GAME_WIDTH - 96 },
      })
      .setOrigin(0.5);
    this.messageText.setStroke('#11131e', 3);
  }

  setInteractiveButtons(activeDay: boolean): void {
    // Disable Upgrades & Menu during active shift, keeping Goals available
    const isInteractive = !activeDay;
    const alpha = isInteractive ? 1 : 0.42;

    this.upgradesButton.setAlpha(alpha);
    this.upgradesButtonText.setAlpha(alpha);
    this.menuButton.setAlpha(alpha);
    this.menuButtonText.setAlpha(alpha);

    if (isInteractive) {
      this.upgradesHitZone.setInteractive({ useHandCursor: true });
      this.menuHitZone.setInteractive({ useHandCursor: true });
    } else {
      this.upgradesHitZone.disableInteractive();
      this.menuHitZone.disableInteractive();
    }
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

  updateCoins(coins: number): void {
    this.coinText.setText(`Coins: ${formatCoins(coins)}`);
  }

  pulseCoins(): void {
    FeedbackEffects.pulse(this.coinText.scene, this.coinText, 1.13);
  }

  setMessage(message: string): void {
    this.messageText.setText(message);
  }

  updateFoodState(message: string): void {
    this.foodStateText.setText(message);
  }

  updateProgression(stallLevel: number, stallXp: number, nextLevelXp: number | null): void {
    const stageNames = ['Tiny Cart', 'Better Setup', 'Menu Sign', 'Fairy Lights', 'Kingston Booth'];
    const stageName = stageNames[Phaser.Math.Clamp(stallLevel - 1, 0, 4)];
    
    if (nextLevelXp === null) {
      this.progressionText.setText(`Stall ${stallLevel} (${stageName}) | Max Level`);
      return;
    }

    this.progressionText.setText(`Stall ${stallLevel} (${stageName}) | ${stallXp}/${nextLevelXp} XP`);
  }

  pulseProgression(): void {
    FeedbackEffects.pulse(this.progressionText.scene, this.progressionText, 1.09);
  }

  updateDayState(state: DayState): void {
    const handledCustomers = state.customersServed + state.customersMissed;
    this.dayText.setText(`Customers ${handledCustomers}/${state.targetCustomers}`);
    this.updateSatisfaction(state.satisfaction);
  }

  updateSatisfaction(satisfaction: number): void {
    this.satisfactionText.setText(`Satisfaction ${Math.round(satisfaction)}%`);
  }

  pulseSatisfaction(): void {
    FeedbackEffects.pulse(this.satisfactionText.scene, this.satisfactionText, 1.08);
  }

  updateStreak(currentStreak: number, bestStreak: number): void {
    this.streakText.setText(`Streak ${currentStreak} | Best ${bestStreak}`);
  }

  pulseStreak(): void {
    FeedbackEffects.pulse(this.streakText.scene, this.streakText, 1.12);
  }

  setStartDayVisible(isVisible: boolean): void {
    const alpha = isVisible ? 1 : 0.42;
    this.startButton.setAlpha(alpha);
    this.startButtonText.setAlpha(alpha);
    this.startHitZone.setInteractive({ useHandCursor: isVisible });

    if (!isVisible) {
      this.startHitZone.disableInteractive();
    }
  }

  updateRushState(state: RushHourState): void {
    if (state.isActive) {
      this.rushStateText.setText(`Rush ${state.remainingSeconds}s | ${state.rewardMultiplier}x`);
      this.drawRoundedButton(this.rushButton, 584, 36, 178, 52, 0x475569, 0xffffff);
      this.rushButtonText.setText('Active');
      return;
    }

    this.rushStateText.setText('Rush inactive');
    this.drawRoundedButton(this.rushButton, 584, 36, 178, 52, COLORS.danger, 0xffffff);
    this.rushButtonText.setText('Rush Hour');
  }

  updateSoundState(soundEnabled: boolean): void {
    // Sound display update is now delegated to the MenuPanel.
    // Keeping this method as a safe no-op to preserve scene compatibility.
  }
}

import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../config/constants';
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
  private readonly hintText: Phaser.GameObjects.Text;
  private readonly rushButton: Phaser.GameObjects.Graphics;
  private readonly rushButtonText: Phaser.GameObjects.Text;
  private readonly rushStateText: Phaser.GameObjects.Text;
  private readonly rushHitZone: Phaser.GameObjects.Zone;
  private readonly resetButton: Phaser.GameObjects.Graphics;
  private readonly resetButtonText: Phaser.GameObjects.Text;
  private readonly resetHitZone: Phaser.GameObjects.Zone;
  private readonly helpButton: Phaser.GameObjects.Graphics;
  private readonly helpButtonText: Phaser.GameObjects.Text;
  private readonly helpHitZone: Phaser.GameObjects.Zone;
  private readonly soundButton: Phaser.GameObjects.Graphics;
  private readonly soundButtonText: Phaser.GameObjects.Text;
  private readonly soundHitZone: Phaser.GameObjects.Zone;
  private readonly startButton: Phaser.GameObjects.Graphics;
  private readonly startButtonText: Phaser.GameObjects.Text;
  private readonly startHitZone: Phaser.GameObjects.Zone;
  private readonly onRushRequested: () => void;
  private readonly onResetRequested: () => void;
  private readonly onHelpRequested: () => void;
  private readonly onSoundToggleRequested: () => void;
  private readonly onStartDayRequested: () => void;

  constructor(
    scene: Phaser.Scene,
    onRushRequested: () => void,
    onResetRequested: () => void,
    onHelpRequested: () => void,
    onSoundToggleRequested: () => void,
    onStartDayRequested: () => void,
    soundEnabled: boolean,
  ) {
    this.onRushRequested = onRushRequested;
    this.onResetRequested = onResetRequested;
    this.onHelpRequested = onHelpRequested;
    this.onSoundToggleRequested = onSoundToggleRequested;
    this.onStartDayRequested = onStartDayRequested;

    // Draw Rounded Panel Base using Graphics
    const panel = scene.add.graphics();
    panel.fillStyle(COLORS.hudPanel, 0.94);
    panel.lineStyle(3.5, COLORS.hudStroke, 1);
    panel.fillRoundedRect(18, 6, GAME_WIDTH - 36, 122, 14);
    panel.strokeRoundedRect(18, 6, GAME_WIDTH - 36, 122, 14);

    // Decorative Icon Overlays
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

    const starIcon = scene.add.text(44, 70, '⭐', { fontSize: '15px' }).setOrigin(0.5);
    this.progressionText = scene.add
      .text(64, 70, 'Stall 1 | 0/40 XP', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    const dayIcon = scene.add.text(44, 100, '📋', { fontSize: '14px' }).setOrigin(0.5);
    this.dayText = scene.add
      .text(64, 100, 'Customers 0/6', {
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    // Center Column
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

    // Bottom Action Row (Reset, Help, Sound)
    this.resetButton = scene.add.graphics();
    this.drawRoundedButton(this.resetButton, 102, 214, 164, 52, 0x2d313e, COLORS.hudStroke);
    this.resetButtonText = scene.add
      .text(102, 214, 'Reset Save', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.resetHitZone = scene.add.zone(102, 214, 188, 72).setInteractive({ useHandCursor: true });
    this.resetHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onResetRequested();
    });

    this.helpButton = scene.add.graphics();
    this.drawRoundedButton(this.helpButton, 270, 214, 124, 52, 0x2d313e, COLORS.hudStroke);
    this.helpButtonText = scene.add
      .text(270, 214, 'Help', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.helpHitZone = scene.add.zone(270, 214, 148, 72).setInteractive({ useHandCursor: true });
    this.helpHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onHelpRequested();
    });

    this.soundButton = scene.add.graphics();
    this.drawRoundedButton(this.soundButton, 438, 214, 150, 52, 0x2d313e, COLORS.hudStroke);
    this.soundButtonText = scene.add
      .text(438, 214, 'Sound: On', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.soundHitZone = scene.add.zone(438, 214, 174, 72).setInteractive({ useHandCursor: true });
    this.soundHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onSoundToggleRequested();
    });
    this.updateSoundState(soundEnabled);

    // Guides & Status Texts
    this.hintText = scene.add
      .text(GAME_WIDTH / 2, 266, 'Start Day -> read order -> cook slots -> tap ready food -> serve customer', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        wordWrap: { width: GAME_WIDTH - 80 },
      })
      .setOrigin(0.5);
    this.hintText.setStroke('#11131e', 4);

    this.foodStateText = scene.add
      .text(GAME_WIDTH / 2, 1218, 'Day idle', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '21px',
        fontStyle: 'bold',
        wordWrap: { width: GAME_WIDTH - 96 },
      })
      .setOrigin(0.5);
    this.foodStateText.setStroke('#11131e', 4);

    this.messageText = scene.add
      .text(GAME_WIDTH / 2, 1254, '', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '21px',
        wordWrap: { width: GAME_WIDTH - 96 },
      })
      .setOrigin(0.5);
    this.messageText.setStroke('#11131e', 3);
  }

  private drawRoundedButton(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    fillColor: number,
    strokeColor: number,
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

  updateDayState(state: DayState): void {
    const handledCustomers = state.customersServed + state.customersMissed;
    this.dayText.setText(`Customers ${handledCustomers}/${state.targetCustomers}`);
    this.updateSatisfaction(state.satisfaction);
  }

  updateSatisfaction(satisfaction: number): void {
    this.satisfactionText.setText(`Satisfaction ${Math.round(satisfaction)}%`);
  }

  updateStreak(currentStreak: number, bestStreak: number): void {
    this.streakText.setText(`Streak ${currentStreak} | Best ${bestStreak}`);
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
    this.soundButtonText.setText(soundEnabled ? 'Sound: On' : 'Sound: Off');
    this.drawRoundedButton(this.soundButton, 438, 214, 150, 52, soundEnabled ? 0x2d313e : 0x1e2230, COLORS.hudStroke);
  }
}

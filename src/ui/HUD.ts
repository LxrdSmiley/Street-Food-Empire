import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../config/constants';
import { formatCoins } from '../utils/format';
import type { RushHourState } from '../types/gameTypes';

export class HUD {
  private readonly coinText: Phaser.GameObjects.Text;
  private readonly progressionText: Phaser.GameObjects.Text;
  private readonly foodStateText: Phaser.GameObjects.Text;
  private readonly messageText: Phaser.GameObjects.Text;
  private readonly hintText: Phaser.GameObjects.Text;
  private readonly rushButton: Phaser.GameObjects.Rectangle;
  private readonly rushButtonText: Phaser.GameObjects.Text;
  private readonly rushStateText: Phaser.GameObjects.Text;
  private readonly rushHitZone: Phaser.GameObjects.Zone;
  private readonly resetButton: Phaser.GameObjects.Rectangle;
  private readonly resetButtonText: Phaser.GameObjects.Text;
  private readonly resetHitZone: Phaser.GameObjects.Zone;
  private readonly helpButton: Phaser.GameObjects.Rectangle;
  private readonly helpButtonText: Phaser.GameObjects.Text;
  private readonly helpHitZone: Phaser.GameObjects.Zone;
  private readonly onRushRequested: () => void;
  private readonly onResetRequested: () => void;
  private readonly onHelpRequested: () => void;

  constructor(
    scene: Phaser.Scene,
    onRushRequested: () => void,
    onResetRequested: () => void,
    onHelpRequested: () => void,
  ) {
    this.onRushRequested = onRushRequested;
    this.onResetRequested = onResetRequested;
    this.onHelpRequested = onHelpRequested;

    const panel = scene.add.rectangle(GAME_WIDTH / 2, 50, GAME_WIDTH - 40, 88, COLORS.hudPanel, 0.94);
    panel.setStrokeStyle(3, COLORS.hudStroke);

    this.coinText = scene.add
      .text(48, 36, 'Coins: 0', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    this.rushButton = scene.add.rectangle(570, 50, 200, 58, COLORS.danger, 1);
    this.rushButton.setStrokeStyle(2, 0xffffff, 0.6);

    this.rushButtonText = scene.add
      .text(570, 50, 'Rush Hour', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '23px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.rushHitZone = scene.add.zone(570, 50, 224, 76).setInteractive({ useHandCursor: true });
    this.rushHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onRushRequested();
    });

    this.resetButton = scene.add.rectangle(102, 214, 164, 52, 0x3b3f4d, 1);
    this.resetButton.setStrokeStyle(2, COLORS.hudStroke, 0.85);

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

    this.helpButton = scene.add.rectangle(270, 214, 124, 52, 0x3b3f4d, 1);
    this.helpButton.setStrokeStyle(2, COLORS.hudStroke, 0.85);

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

    this.rushStateText = scene.add
      .text(346, 66, 'Rush inactive', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.progressionText = scene.add
      .text(346, 28, 'Stall 1 | 0/40 XP', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.hintText = scene.add
      .text(GAME_WIDTH / 2, 254, '1 Tap grill  2 Tap customer  3 Buy upgrades', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        wordWrap: { width: GAME_WIDTH - 80 },
      })
      .setOrigin(0.5);
    this.hintText.setStroke('#11131e', 4);

    this.foodStateText = scene.add
      .text(GAME_WIDTH / 2, 1228, 'Station idle', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '21px',
        fontStyle: 'bold',
        wordWrap: { width: GAME_WIDTH - 96 },
      })
      .setOrigin(0.5);

    this.messageText = scene.add
      .text(GAME_WIDTH / 2, 1262, '', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        wordWrap: { width: GAME_WIDTH - 96 },
      })
      .setOrigin(0.5);
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
    if (nextLevelXp === null) {
      this.progressionText.setText(`Stall ${stallLevel} | Max level`);
      return;
    }

    this.progressionText.setText(`Stall ${stallLevel} | ${stallXp}/${nextLevelXp} XP`);
  }

  updateRushState(state: RushHourState): void {
    if (state.isActive) {
      this.rushStateText.setText(`Rush active: ${state.remainingSeconds}s | ${state.rewardMultiplier}x coins`);
      this.rushButton.setFillStyle(0x5d6672, 1);
      this.rushButtonText.setText('Active');
      return;
    }

    this.rushStateText.setText('Rush inactive');
    this.rushButton.setFillStyle(COLORS.danger, 1);
    this.rushButtonText.setText('Rush Hour');
  }
}

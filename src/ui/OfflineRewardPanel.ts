import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';
import { formatCoins } from '../utils/format';
import type { OfflineEarningsResult } from '../types/gameTypes';

export class OfflineRewardPanel extends Phaser.GameObjects.Container {
  private readonly onCollect: () => void;

  constructor(scene: Phaser.Scene, reward: OfflineEarningsResult, onCollect: () => void) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.onCollect = onCollect;

    const scrim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.48);
    scrim.setInteractive();
    const panel = scene.add.rectangle(0, 0, GAME_WIDTH - 72, 350, COLORS.hudPanel, 0.98);
    panel.setStrokeStyle(4, COLORS.hudStroke);

    const title = scene.add
      .text(0, -108, 'Welcome Back', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '40px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const timeAway = scene.add
      .text(0, -46, `Away: ${this.formatMinutes(reward.minutesAway)}`, {
        align: 'center',
        color: '#d8d0bd',
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
      })
      .setOrigin(0.5);

    const coins = scene.add
      .text(0, 8, `${formatCoins(reward.coinsEarned)} coins earned`, {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const capText = scene.add
      .text(0, 52, reward.wasCapped ? 'Offline time capped at 4 hours.' : 'Your cart kept earning while away.', {
        align: 'center',
        color: '#d8d0bd',
        fontFamily: 'Arial, sans-serif',
        fontSize: '21px',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);

    const button = scene.add.rectangle(0, 124, 240, 68, COLORS.success, 1);
    button.setStrokeStyle(3, 0xffffff, 0.55);
    const hitZone = scene.add.zone(0, 124, 270, 92).setInteractive({ useHandCursor: true });
    hitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onCollect();
    });

    const buttonText = scene.add
      .text(0, 124, 'Collect', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '27px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add([scrim, panel, title, timeAway, coins, capText, button, hitZone, buttonText]);
    this.setDepth(1000);

    scene.add.existing(this);
  }

  private formatMinutes(minutes: number): string {
    const safeMinutes = Math.max(0, Math.round(minutes));
    const hours = Math.floor(safeMinutes / 60);
    const remainingMinutes = safeMinutes % 60;

    if (hours <= 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  }
}

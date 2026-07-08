import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';
import { formatCoins } from '../utils/format';
import type { DaySummary } from '../types/gameTypes';

export class DaySummaryPanel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, summary: DaySummary, onClose: () => void) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2);

    const dim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.56);
    const panel = scene.add.rectangle(0, 0, 560, 560, COLORS.hudPanel, 0.98).setStrokeStyle(4, COLORS.hudStroke);
    const title = scene.add
      .text(0, -226, summary.resultText, {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '42px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const subtitle = scene.add
      .text(0, -174, 'Day Complete', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    const rows = [
      `Served: ${summary.customersServed}`,
      `Missed: ${summary.customersMissed}`,
      `Coins: ${formatCoins(summary.coinsEarned)}`,
      `Tips: ${formatCoins(summary.tipsEarned)}`,
      `Satisfaction: ${summary.satisfaction}%`,
      `Best Streak: ${summary.bestStreak}`,
    ];
    const body = scene.add
      .text(0, -52, rows.join('\n'), {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '27px',
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    const button = scene.add.rectangle(0, 216, 300, 74, COLORS.success, 1).setStrokeStyle(3, 0xffffff, 0.6);
    const buttonText = scene.add
      .text(0, 216, 'Continue', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const hitZone = scene.add.zone(0, 216, 330, 96).setInteractive({ useHandCursor: true });
    hitZone.on(Phaser.Input.Events.POINTER_DOWN, onClose);

    this.add([dim, panel, title, subtitle, body, button, buttonText, hitZone]);
    this.setDepth(2000);
    scene.add.existing(this);
  }
}

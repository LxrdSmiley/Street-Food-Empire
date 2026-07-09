import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';
import { formatCoins } from '../utils/format';
import type { OfflineEarningsResult } from '../types/gameTypes';

export class OfflineRewardPanel extends Phaser.GameObjects.Container {
  private readonly onCollect: () => void;

  constructor(scene: Phaser.Scene, reward: OfflineEarningsResult, onCollect: () => void) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.onCollect = onCollect;

    const scrim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
    scrim.setInteractive();

    // Round panel base
    const panelG = scene.add.graphics();
    panelG.fillStyle(COLORS.hudPanel, 0.98);
    panelG.lineStyle(4, COLORS.hudStroke, 1);
    panelG.fillRoundedRect(-(GAME_WIDTH - 72) / 2, -175, GAME_WIDTH - 72, 350, 16);
    panelG.strokeRoundedRect(-(GAME_WIDTH - 72) / 2, -175, GAME_WIDTH - 72, 350, 16);

    const title = scene.add
      .text(0, -118, 'Welcome Back', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '38px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    title.setStroke('#11131a', 4);

    const timeAway = scene.add
      .text(0, -56, `Away: ${this.formatMinutes(reward.minutesAway)}`, {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    const coinsIcon = scene.add.circle(-110, 8, 12, 0xffd166, 1).setStrokeStyle(1.5, 0xb07d50);
    const coinsC = scene.add.text(-110, 8, 'c', { color: '#6d3f28', fontSize: '13px', fontStyle: 'bold' }).setOrigin(0.5);

    const coinsText = scene.add
      .text(-86, 8, `${formatCoins(reward.coinsEarned)} coins earned`, {
        align: 'left',
        color: '#7bd88f',
        fontFamily: 'Arial, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);
    coinsText.setStroke('#11131a', 3);

    const capText = scene.add
      .text(0, 56, reward.wasCapped ? 'Offline time capped at 4 hours.' : 'Your cart kept earning while you were away.', {
        align: 'center',
        color: '#d8d0bd',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);

    // Rounded collect button
    const buttonG = scene.add.graphics();
    buttonG.fillStyle(COLORS.success, 1);
    buttonG.lineStyle(3, 0xffffff, 0.65);
    buttonG.fillRoundedRect(-120, 96, 240, 56, 12);
    buttonG.strokeRoundedRect(-120, 96, 240, 56, 12);

    const buttonText = scene.add
      .text(0, 124, 'Collect', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const hitZone = scene.add.zone(0, 124, 250, 72).setInteractive({ useHandCursor: true });
    hitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onCollect();
    });

    this.add([scrim, title, timeAway, coinsIcon, coinsC, coinsText, capText, buttonText, hitZone]);
    this.addAt(panelG, 1);
    this.addAt(buttonG, 2);
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

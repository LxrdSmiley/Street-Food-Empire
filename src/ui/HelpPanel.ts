import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';

export class HelpPanel {
  private readonly container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose: () => void) {
    const scrim = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05070d, 0.62);
    scrim.setInteractive();

    const panel = scene.add.rectangle(GAME_WIDTH / 2, 565, GAME_WIDTH - 96, 560, COLORS.hudPanel, 0.98);
    panel.setStrokeStyle(4, COLORS.hudStroke, 0.95);

    const title = scene.add
      .text(GAME_WIDTH / 2, 335, 'How to Play', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '36px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const body = scene.add
      .text(
        GAME_WIDTH / 2,
        510,
        'Tap grill to prepare\nTap customer to serve\nEarn coins\nBuy upgrades\nRush Hour gives bonus rewards',
        {
          align: 'center',
          color: '#fff7df',
          fontFamily: 'Arial, sans-serif',
          fontSize: '27px',
          lineSpacing: 15,
          wordWrap: { width: GAME_WIDTH - 150 },
        },
      )
      .setOrigin(0.5);

    const closeButton = scene.add.rectangle(GAME_WIDTH / 2, 790, 210, 62, COLORS.success, 1);
    closeButton.setStrokeStyle(3, 0xffffff, 0.65);

    const closeText = scene.add
      .text(GAME_WIDTH / 2, 790, 'Close', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const closeHitZone = scene.add.zone(GAME_WIDTH / 2, 790, 250, 86).setInteractive({ useHandCursor: true });
    closeHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      onClose();
    });

    this.container = scene.add.container(0, 0, [
      scrim,
      panel,
      title,
      body,
      closeButton,
      closeText,
      closeHitZone,
    ]);
    this.container.setDepth(1000);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}

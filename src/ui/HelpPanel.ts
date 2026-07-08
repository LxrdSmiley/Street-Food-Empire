import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';

export class HelpPanel {
  private readonly container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose: () => void) {
    const scrim = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05070d, 0.62);
    scrim.setInteractive();

    const panel = scene.add.rectangle(GAME_WIDTH / 2, 565, GAME_WIDTH - 72, 590, COLORS.hudPanel, 0.98);
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
        'Tap Start Day for a short shift\nRead the customer order bubble\nTap empty grill slots to cook needed items\nTap ready food, then tap the customer\nFast correct serves earn tips and streaks\nBurnt, wrong, or late orders hurt satisfaction\nRush Hour speeds up customers and boosts base coins',
        {
          align: 'center',
          color: '#fff7df',
          fontFamily: 'Arial, sans-serif',
          fontSize: '25px',
          lineSpacing: 13,
          wordWrap: { width: GAME_WIDTH - 120 },
        },
      )
      .setOrigin(0.5);

    const closeButton = scene.add.rectangle(GAME_WIDTH / 2, 810, 230, 66, COLORS.success, 1);
    closeButton.setStrokeStyle(3, 0xffffff, 0.65);

    const closeText = scene.add
      .text(GAME_WIDTH / 2, 810, 'Close', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const closeHitZone = scene.add.zone(GAME_WIDTH / 2, 810, 270, 92).setInteractive({ useHandCursor: true });
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

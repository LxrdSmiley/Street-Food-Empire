import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';

export class HelpPanel {
  private readonly container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose: () => void) {
    const scrim = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05070d, 0.65);
    scrim.setInteractive();

    // Round panel base
    const panelG = scene.add.graphics();
    panelG.fillStyle(COLORS.hudPanel, 0.98);
    panelG.lineStyle(4, COLORS.hudStroke, 0.95);
    panelG.fillRoundedRect(36, 270, GAME_WIDTH - 72, 590, 16);
    panelG.strokeRoundedRect(36, 270, GAME_WIDTH - 72, 590, 16);

    const title = scene.add
      .text(GAME_WIDTH / 2, 325, 'How to Play', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '34px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    title.setStroke('#11131e', 4);

    const body = scene.add
      .text(
        GAME_WIDTH / 2,
        510,
        'Tap Start Day for a short shift\nRead the customer order bubble\nTap empty grill slots to cook needed items\nTap ready food, then tap the customer\nFast correct serves earn tips and streaks\nBurnt, wrong, or late orders hurt satisfaction\nRush Hour speeds up customers and boosts base coins',
        {
          align: 'center',
          color: '#fff7df',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          lineSpacing: 13,
          wordWrap: { width: GAME_WIDTH - 120 },
        },
      )
      .setOrigin(0.5);
    body.setStroke('#11131e', 3);

    // Rounded Close button
    const closeButtonG = scene.add.graphics();
    closeButtonG.fillStyle(COLORS.success, 1);
    closeButtonG.lineStyle(3, 0xffffff, 0.65);
    closeButtonG.fillRoundedRect(GAME_WIDTH / 2 - 115, 777, 230, 66, 12);
    closeButtonG.strokeRoundedRect(GAME_WIDTH / 2 - 115, 777, 230, 66, 12);

    const closeText = scene.add
      .text(GAME_WIDTH / 2, 810, 'Close', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const closeHitZone = scene.add.zone(GAME_WIDTH / 2, 810, 250, 80).setInteractive({ useHandCursor: true });
    closeHitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      onClose();
    });

    this.container = scene.add.container(0, 0, [
      scrim,
      title,
      body,
      closeText,
      closeHitZone,
    ]);
    this.container.addAt(panelG, 1);
    this.container.addAt(closeButtonG, 2);
    this.container.setDepth(1000);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}

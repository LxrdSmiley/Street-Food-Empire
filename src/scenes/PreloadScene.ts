import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config/constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Loading Kingston Night Market...', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
      })
      .setOrigin(0.5);

    this.time.delayedCall(180, () => {
      this.scene.start(SCENE_KEYS.TITLE);
    });
  }
}

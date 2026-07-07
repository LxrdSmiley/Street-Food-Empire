import Phaser from 'phaser';
import { COLORS } from '../config/constants';
import type { FoodDefinition } from '../types/gameTypes';

export class FoodStation extends Phaser.GameObjects.Container {
  private readonly statusText: Phaser.GameObjects.Text;
  private readonly progressBar: Phaser.GameObjects.Rectangle;
  private readonly progressTrack: Phaser.GameObjects.Rectangle;
  private preparingFoodId?: string;
  private preparedFoodId?: string;
  private prepTimer?: Phaser.Time.TimerEvent;
  private progressTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, onSelected: () => void) {
    super(scene, x, y);

    const hitZone = scene.add.zone(0, 0, 350, 230).setInteractive({ useHandCursor: true });
    const base = scene.add.rectangle(0, 0, 330, 180, COLORS.grill, 1).setStrokeStyle(5, 0xffd166);
    const heat = scene.add.rectangle(0, -36, 250, 58, 0x181a21, 1);
    const grateA = scene.add.line(0, -56, -104, 0, 104, 0, 0x6f7785, 1);
    const grateB = scene.add.line(0, -36, -104, 0, 104, 0, 0x6f7785, 1);
    const grateC = scene.add.line(0, -16, -104, 0, 104, 0, 0x6f7785, 1);
    const label = scene.add
      .text(0, 36, 'Jerk Grill', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.statusText = scene.add
      .text(0, 74, 'Tap to cook', {
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
      })
      .setOrigin(0.5);

    this.progressTrack = scene.add.rectangle(0, 112, 250, 14, 0x11131e, 1);
    this.progressBar = scene.add.rectangle(-125, 112, 0, 14, COLORS.success, 1).setOrigin(0, 0.5);

    hitZone.on(Phaser.Input.Events.POINTER_DOWN, onSelected);

    this.add([
      hitZone,
      base,
      heat,
      grateA,
      grateB,
      grateC,
      label,
      this.statusText,
      this.progressTrack,
      this.progressBar,
    ]);

    scene.add.existing(this);
  }

  startPreparing(food: FoodDefinition, prepTimeMs: number, onComplete: () => void): boolean {
    if (this.preparingFoodId || this.preparedFoodId) {
      return false;
    }

    this.preparingFoodId = food.id;
    this.statusText.setText('Cooking...');
    this.progressBar.width = 0;
    this.progressTween?.stop();
    this.progressTween = this.scene.tweens.add({
      targets: this.progressBar,
      width: 250,
      duration: prepTimeMs,
      ease: 'Linear',
    });

    this.prepTimer = this.scene.time.delayedCall(prepTimeMs, () => {
      this.preparingFoodId = undefined;
      this.preparedFoodId = food.id;
      this.statusText.setText('Ready');
      this.progressBar.width = 250;
      onComplete();
    });

    return true;
  }

  isPreparing(): boolean {
    return Boolean(this.preparingFoodId);
  }

  getPreparedFoodId(): string | undefined {
    return this.preparedFoodId;
  }

  consumePreparedFood(foodId: string): boolean {
    if (this.preparedFoodId !== foodId) {
      return false;
    }

    this.preparedFoodId = undefined;
    this.prepTimer?.remove(false);
    this.statusText.setText('Tap to cook');
    this.progressBar.width = 0;
    return true;
  }
}

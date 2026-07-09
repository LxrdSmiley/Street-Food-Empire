import Phaser from 'phaser';

interface FloatingTextOptions {
  x: number;
  y: number;
  message: string;
  color: string;
  fontSize?: number;
  rise?: number;
  durationMs?: number;
  delayMs?: number;
  depth?: number;
}

export class FeedbackEffects {
  static floatingText(scene: Phaser.Scene, options: FloatingTextOptions): Phaser.GameObjects.Text {
    const feedbackText = scene.add
      .text(options.x, options.y, options.message, {
        align: 'center',
        color: options.color,
        fontFamily: 'Arial, sans-serif',
        fontSize: `${options.fontSize ?? 30}px`,
        fontStyle: 'bold',
        stroke: '#11131e',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(options.depth ?? 2200)
      .setAlpha(0);

    scene.tweens.add({
      targets: feedbackText,
      alpha: 1,
      scale: { from: 0.72, to: 1 },
      duration: 130,
      delay: options.delayMs ?? 0,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: feedbackText,
          y: options.y - (options.rise ?? 42),
          alpha: 0,
          duration: options.durationMs ?? 860,
          ease: 'Sine.easeOut',
          onComplete: () => {
            feedbackText.destroy();
          },
        });
      },
    });

    return feedbackText;
  }

  static pulse(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    scale = 1.12,
    durationMs = 140,
  ): void {
    scene.tweens.add({
      targets: target,
      scale,
      duration: durationMs,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  }

  static flashAlpha(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    maxAlpha = 1,
    minAlpha = 0.55,
    durationMs = 110,
  ): void {
    scene.tweens.add({
      targets: target,
      alpha: minAlpha,
      duration: durationMs,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        const targets = Array.isArray(target) ? target : [target];
        targets.forEach((item) => {
          if ('setAlpha' in item && typeof item.setAlpha === 'function') {
            item.setAlpha(maxAlpha);
          }
        });
      },
    });
  }
}

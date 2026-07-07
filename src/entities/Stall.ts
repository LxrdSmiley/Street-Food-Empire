import Phaser from 'phaser';
import { COLORS } from '../config/constants';

export class Stall extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const awningBack = scene.add.rectangle(0, -178, 470, 70, 0xbd3a3a, 1);
    const awningStripeA = scene.add.rectangle(-150, -178, 72, 70, 0xfff7df, 1);
    const awningStripeB = scene.add.rectangle(0, -178, 72, 70, 0xfff7df, 1);
    const awningStripeC = scene.add.rectangle(150, -178, 72, 70, 0xfff7df, 1);
    const counter = scene.add.rectangle(0, -40, 440, 210, COLORS.stallWood, 1).setStrokeStyle(5, 0x4f2f23);
    const trim = scene.add.rectangle(0, -130, 456, 30, COLORS.stallTrim, 1);
    const sign = scene.add.rectangle(0, -80, 310, 70, 0x232533, 1).setStrokeStyle(4, COLORS.stallTrim);
    const signText = scene.add
      .text(0, -80, 'Kingston Cart', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '31px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const wheelA = scene.add.circle(-158, 82, 28, 0x1d1d24, 1);
    const wheelB = scene.add.circle(158, 82, 28, 0x1d1d24, 1);

    this.add([
      awningBack,
      awningStripeA,
      awningStripeB,
      awningStripeC,
      counter,
      trim,
      sign,
      signText,
      wheelA,
      wheelB,
    ]);

    scene.add.existing(this);
  }
}

import Phaser from 'phaser';
import { COLORS } from '../config/constants';

export class Stall extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const awningBack = scene.add.rectangle(0, -182, 490, 76, 0xbd3a3a, 1);
    const awningStripeA = scene.add.rectangle(-158, -182, 78, 76, 0xfff7df, 1);
    const awningStripeB = scene.add.rectangle(0, -182, 78, 76, 0xfff7df, 1);
    const awningStripeC = scene.add.rectangle(158, -182, 78, 76, 0xfff7df, 1);
    const awningLip = scene.add.rectangle(0, -138, 510, 18, COLORS.stallTrim, 1);
    const counter = scene.add.rectangle(0, -40, 456, 218, COLORS.stallWood, 1).setStrokeStyle(5, 0x4f2f23);
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
    const shelf = scene.add.rectangle(0, 24, 360, 18, 0x6d3f28, 1);
    const crateA = scene.add.rectangle(-150, 38, 62, 48, 0x5d8c5a, 1).setStrokeStyle(2, 0x263a25);
    const crateB = scene.add.rectangle(150, 38, 62, 48, 0xcc7a2b, 1).setStrokeStyle(2, 0x4f2f23);

    this.add([
      awningBack,
      awningStripeA,
      awningStripeB,
      awningStripeC,
      awningLip,
      counter,
      trim,
      sign,
      signText,
      shelf,
      crateA,
      crateB,
      wheelA,
      wheelB,
    ]);

    scene.add.existing(this);
  }
}

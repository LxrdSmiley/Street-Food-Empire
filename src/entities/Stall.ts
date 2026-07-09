import Phaser from 'phaser';
import { COLORS } from '../config/constants';

export class Stall extends Phaser.GameObjects.Container {
  private currentLevel = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, level = 1) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setLevel(level);
  }

  setLevel(level: number): void {
    this.currentLevel = Phaser.Math.Clamp(Math.round(level), 1, 5);
    this.removeAll(true);

    const scene = this.scene;

    switch (this.currentLevel) {
      case 1:
        this.buildStage1(scene);
        break;
      case 2:
        this.buildStage2(scene);
        break;
      case 3:
        this.buildStage3(scene);
        break;
      case 4:
        this.buildStage4(scene);
        break;
      case 5:
        this.buildStage5(scene);
        break;
      default:
        this.buildStage1(scene);
        break;
    }
  }

  private buildStage1(scene: Phaser.Scene): void {
    // Stage 1: Tiny Push Cart
    const counter = scene.add.rectangle(0, -20, 360, 160, 0x6e473b, 1).setStrokeStyle(4, 0x3d2720);
    const trim = scene.add.rectangle(0, -90, 370, 16, COLORS.stallTrim, 1);
    
    const sign = scene.add.rectangle(0, -60, 240, 52, 0x222431, 1).setStrokeStyle(3, COLORS.stallTrim);
    const signText = scene.add.text(0, -60, 'Kingston Cart', {
      color: '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const wheelA = scene.add.circle(-130, 50, 32, 0x1d1d24, 1).setStrokeStyle(4, 0x5a545e);
    const spokeA1 = scene.add.line(-130, 50, -28, 0, 28, 0, 0x5a545e, 1);
    const spokeA2 = scene.add.line(-130, 50, 0, -28, 0, 28, 0x5a545e, 1);
    const centerA = scene.add.circle(-130, 50, 6, 0x3d3942, 1);

    const wheelB = scene.add.circle(130, 50, 32, 0x1d1d24, 1).setStrokeStyle(4, 0x5a545e);
    const spokeB1 = scene.add.line(130, 50, -28, 0, 28, 0, 0x5a545e, 1);
    const spokeB2 = scene.add.line(130, 50, 0, -28, 0, 28, 0x5a545e, 1);
    const centerB = scene.add.circle(130, 50, 6, 0x3d3942, 1);

    this.add([counter, trim, sign, signText, wheelA, spokeA1, spokeA2, centerA, wheelB, spokeB1, spokeB2, centerB]);
  }

  private buildStage2(scene: Phaser.Scene): void {
    // Stage 2: Better Grill Setup
    const counter = scene.add.rectangle(0, -28, 400, 172, 0x825446, 1).setStrokeStyle(4, 0x4f322a);
    const trim = scene.add.rectangle(0, -104, 410, 20, COLORS.stallTrim, 1);

    const umbrellaPole = scene.add.rectangle(0, -140, 6, 110, 0x4a453f, 1);
    const umbrella = scene.add.triangle(0, -210, -160, -165, 160, -165, 0, -210, 0xbd3a3a, 1).setStrokeStyle(3, 0xfff7df);
    
    const sign = scene.add.rectangle(0, -66, 260, 56, 0x222431, 1).setStrokeStyle(3, COLORS.success);
    const signText = scene.add.text(0, -66, 'Kingston Grill', {
      color: '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '26px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const wheelA = scene.add.circle(-140, 50, 28, 0x1d1d24, 1).setStrokeStyle(3, 0x3a353e);
    const wheelB = scene.add.circle(140, 50, 28, 0x1d1d24, 1).setStrokeStyle(3, 0x3a353e);

    this.add([umbrellaPole, umbrella, counter, trim, sign, signText, wheelA, wheelB]);
  }

  private buildStage3(scene: Phaser.Scene): void {
    // Stage 3: Menu Board + Sign
    const counter = scene.add.rectangle(0, -34, 430, 184, COLORS.stallWood, 1).setStrokeStyle(5, 0x4f2f23);
    const trim = scene.add.rectangle(0, -118, 440, 22, COLORS.stallTrim, 1);

    const pillarL = scene.add.rectangle(-170, -130, 8, 120, 0x6d3f28, 1);
    const pillarR = scene.add.rectangle(170, -130, 8, 120, 0x6d3f28, 1);
    const awning = scene.add.rectangle(0, -188, 440, 60, 0xbd3a3a, 1).setStrokeStyle(2, 0xfff7df);
    const awningStripe = scene.add.rectangle(0, -188, 140, 60, 0xfff7df, 1);

    const sign = scene.add.rectangle(0, -70, 280, 60, 0x11131e, 1).setStrokeStyle(3, COLORS.warning);
    const signText = scene.add.text(0, -70, 'Liguanea Grill', {
      color: '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: '26px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const menuBoard = scene.add.rectangle(-230, -30, 80, 110, 0x222431, 1).setStrokeStyle(3, 0x6d3f28);
    const menuTitle = scene.add.text(-230, -70, 'MENU', { color: '#ffd166', fontSize: '13px', fontStyle: 'bold' }).setOrigin(0.5);
    const menuLine1 = scene.add.text(-230, -50, '- Jerk Chk', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);
    const menuLine2 = scene.add.text(-230, -34, '- Festival', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);

    const crate = scene.add.rectangle(230, 10, 70, 50, 0x8a5a36, 1).setStrokeStyle(2, 0x4f2f23);
    const cornItem1 = scene.add.circle(215, 8, 8, 0xffd166, 1);
    const cornItem2 = scene.add.circle(230, 14, 8, 0xffd166, 1);
    const cornItem3 = scene.add.circle(245, 8, 8, 0xffd166, 1);

    const wheelA = scene.add.circle(-140, 52, 24, 0x1d1d24, 1);
    const wheelB = scene.add.circle(140, 52, 24, 0x1d1d24, 1);

    this.add([
      pillarL, pillarR, awning, awningStripe,
      counter, trim, sign, signText,
      menuBoard, menuTitle, menuLine1, menuLine2,
      crate, cornItem1, cornItem2, cornItem3,
      wheelA, wheelB
    ]);
  }

  private buildStage4(scene: Phaser.Scene): void {
    // Stage 4: Fairy Lights + Bigger Counter
    const counter = scene.add.rectangle(0, -40, 456, 196, COLORS.stallWood, 1).setStrokeStyle(5, 0x4f2f23);
    const trim = scene.add.rectangle(0, -130, 466, 24, COLORS.stallTrim, 1);

    const pillarL = scene.add.rectangle(-190, -130, 10, 140, 0x6d3f28, 1);
    const pillarR = scene.add.rectangle(190, -130, 10, 140, 0x6d3f28, 1);
    const awning = scene.add.rectangle(0, -200, 480, 68, 0xbd3a3a, 1).setStrokeStyle(3, 0xffd166);
    const stripeG = scene.add.rectangle(-120, -200, 120, 68, 0x3ab85d, 1);
    const stripeY = scene.add.rectangle(120, -200, 120, 68, 0xffd166, 1);

    const sign = scene.add.rectangle(0, -78, 300, 66, 0x11131e, 1).setStrokeStyle(3, COLORS.success);
    const signText = scene.add.text(0, -78, 'DUB PLATTER', {
      color: '#7bd88f',
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const menuBoard = scene.add.rectangle(-246, -34, 86, 120, 0x222431, 1).setStrokeStyle(3, 0x6d3f28);
    const menuTitle = scene.add.text(-246, -78, 'MENU', { color: '#ffd166', fontSize: '13px', fontStyle: 'bold' }).setOrigin(0.5);
    const menuLine1 = scene.add.text(-246, -56, '- Jerk Chk', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);
    const menuLine2 = scene.add.text(-246, -38, '- Festival', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);
    const menuLine3 = scene.add.text(-246, -20, '- Rst Corn', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);

    const crateA = scene.add.rectangle(240, 20, 54, 44, 0x5a8c5a, 1).setStrokeStyle(2, 0x263a25);
    const crateB = scene.add.rectangle(240, -20, 54, 44, 0xcc7a2b, 1).setStrokeStyle(2, 0x4f2f23);

    const lights: Phaser.GameObjects.Arc[] = [];
    for (let i = 0; i < 9; i++) {
      const lx = -210 + (i * 420) / 8;
      const ly = -162;
      const glow = scene.add.circle(lx, ly, 8, 0xffd166, 0.4);
      const bulb = scene.add.circle(lx, ly, 4, 0xffffff, 1);
      lights.push(glow, bulb);

      scene.tweens.add({
        targets: glow,
        alpha: 0.1,
        duration: 800 + i * 150,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const wheelA = scene.add.circle(-160, 52, 28, 0x1d1d24, 1);
    const wheelB = scene.add.circle(160, 52, 28, 0x1d1d24, 1);

    this.add([
      pillarL, pillarR, awning, stripeG, stripeY,
      counter, trim, sign, signText,
      menuBoard, menuTitle, menuLine1, menuLine2, menuLine3,
      crateA, crateB,
      ...lights,
      wheelA, wheelB
    ]);
  }

  private buildStage5(scene: Phaser.Scene): void {
    // Stage 5: Full Kingston Booth
    const counter = scene.add.rectangle(0, -42, 470, 206, COLORS.stallWood, 1).setStrokeStyle(6, 0x4f2f23);
    const trim = scene.add.rectangle(0, -138, 480, 26, COLORS.stallTrim, 1);

    const brickL = scene.add.rectangle(-170, 60, 80, 50, 0x9e5246, 1).setStrokeStyle(3, 0x3d1d19);
    const brickR = scene.add.rectangle(170, 60, 80, 50, 0x9e5246, 1).setStrokeStyle(3, 0x3d1d19);
    const lineL1 = scene.add.line(-170, 60, -40, -10, 40, -10, 0x3d1d19);
    const lineL2 = scene.add.line(-170, 60, -40, 10, 40, 10, 0x3d1d19);
    const lineR1 = scene.add.line(170, 60, -40, -10, 40, -10, 0x3d1d19);
    const lineR2 = scene.add.line(170, 60, -40, 10, 40, 10, 0x3d1d19);

    const pillarL = scene.add.rectangle(-210, -120, 14, 160, 0x472f23, 1).setStrokeStyle(2, 0x1d130e);
    const pillarR = scene.add.rectangle(210, -120, 14, 160, 0x472f23, 1).setStrokeStyle(2, 0x1d130e);

    const roof = scene.add.rectangle(0, -210, 510, 76, 0x221d28, 1).setStrokeStyle(4, COLORS.stallTrim);
    
    const sign = scene.add.rectangle(0, -82, 330, 70, 0x11131e, 1).setStrokeStyle(4, COLORS.stallTrim);
    const signText = scene.add.text(0, -82, 'KINGSTON RUSH', {
      color: '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const signGlow = scene.add.text(0, -82, 'KINGSTON RUSH', {
      color: '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0.3).setScale(1.05);
    scene.tweens.add({
      targets: signGlow,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    const menuBoard = scene.add.rectangle(-256, -34, 94, 130, 0x222431, 1).setStrokeStyle(3, 0x6d3f28);
    const flagBack = scene.add.rectangle(-256, -82, 70, 20, 0x3ab85d, 1);
    const flagLine1 = scene.add.line(-256, -82, -35, -10, 35, 10, 0xffd166, 2);
    const flagLine2 = scene.add.line(-256, -82, -35, 10, 35, -10, 0xffd166, 2);
    const flagBlack1 = scene.add.triangle(-280, -82, 0, 0, -10, -5, -10, 5, 0x11131e, 1);
    const flagBlack2 = scene.add.triangle(-232, -82, 0, 0, 10, -5, 10, 5, 0x11131e, 1);
    const menuTitle = scene.add.text(-256, -60, 'MENU', { color: '#ffd166', fontSize: '13px', fontStyle: 'bold' }).setOrigin(0.5);
    const menuLine1 = scene.add.text(-256, -42, '- Jerk Chk', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);
    const menuLine2 = scene.add.text(-256, -26, '- Festival', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);
    const menuLine3 = scene.add.text(-256, -10, '- Rst Corn', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);
    const menuLine4 = scene.add.text(-256, 6, '- Shrimp', { color: '#fff7df', fontSize: '10px' }).setOrigin(0.5);

    const basket = scene.add.rectangle(250, 14, 66, 56, 0xb07d50, 1).setStrokeStyle(2, 0x4f2f23);
    const crop1 = scene.add.circle(234, 10, 10, 0xbd3a3a, 1);
    const crop2 = scene.add.circle(250, 14, 10, 0x3ab85d, 1);
    const crop3 = scene.add.circle(266, 8, 10, 0xffd166, 1);

    const lights: Phaser.GameObjects.Arc[] = [];
    for (let i = 0; i < 7; i++) {
      const lx = -180 + i * 60;
      const ly = -160;
      const glow = scene.add.circle(lx, ly, 10, 0xffd166, 0.4);
      const bulb = scene.add.circle(lx, ly, 5, 0xffffff, 1);
      lights.push(glow, bulb);

      scene.tweens.add({
        targets: glow,
        scale: 1.5,
        alpha: 0.1,
        duration: 900 + i * 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const lanL = scene.add.rectangle(-230, -130, 14, 24, 0xbd3a3a, 1).setStrokeStyle(2, 0x11131e);
    const lanLGlow = scene.add.circle(-230, -118, 8, 0xffd166, 0.8);
    const lanR = scene.add.rectangle(230, -130, 14, 24, 0xbd3a3a, 1).setStrokeStyle(2, 0x11131e);
    const lanRGlow = scene.add.circle(230, -118, 8, 0xffd166, 0.8);

    scene.tweens.add({
      targets: [lanLGlow, lanRGlow],
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add([
      brickL, brickR, lineL1, lineL2, lineR1, lineR2,
      pillarL, pillarR, roof,
      counter, trim, sign, signGlow, signText,
      menuBoard, flagBack, flagLine1, flagLine2, flagBlack1, flagBlack2, menuTitle, menuLine1, menuLine2, menuLine3, menuLine4,
      basket, crop1, crop2, crop3,
      lanL, lanLGlow, lanR, lanRGlow,
      ...lights
    ]);
  }
}

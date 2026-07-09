import Phaser from 'phaser';
import { COLORS } from '../config/constants';
import type { CustomerDefinition, CustomerOrder } from '../types/gameTypes';

const PATIENCE_BAR_WIDTH = 224;

export class Customer extends Phaser.GameObjects.Container {
  private readonly readyText: Phaser.GameObjects.Text;
  private readonly patienceText: Phaser.GameObjects.Text;
  private readonly patienceBar: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    customer: CustomerDefinition,
    order: CustomerOrder,
    patienceMs: number,
    onSelected: () => void,
  ) {
    super(scene, x, y);

    const personality = Phaser.Utils.Array.GetRandom([...customer.personalityLines]) ?? 'Make it tasty.';
    const shadow = scene.add.ellipse(0, 136, 148, 30, 0x000000, 0.24);
    const hitZone = scene.add.zone(0, 0, 344, 420).setInteractive({ useHandCursor: true });

    // Base body parts
    const body = scene.add.circle(0, 72, 58, 0xd4a373); // default skin shade
    const head = scene.add.circle(0, 0, 44, 0xffcfa3);
    const shirt = scene.add.rectangle(0, 112, 128, 90, COLORS.customerAccent, 1);
    const collar = scene.add.triangle(0, 74, -26, 0, 26, 0, 0, 28, 0xfff7df, 1);

    // Let's customize based on Customer Type (id)
    const customVisuals: Phaser.GameObjects.GameObject[] = [];

    if (customer.id === 'hungry_student') {
      // Teal shirt, cool green hair, headband, and gray backpack strap
      shirt.setFillStyle(0x14b8a6, 1); // turquoise
      
      const greenHair = scene.add.arc(0, -13, 46, 200, 340, false, 0x10b981, 1);
      const headband = scene.add.rectangle(0, -22, 68, 8, 0xfacc15, 1); // yellow headband
      
      // Diagonal backpack strap
      const strap = scene.add.rectangle(0, 112, 16, 92, 0x475569, 1);
      strap.setAngle(-35);

      customVisuals.push(greenHair, headband, strap);
    } else if (customer.id === 'night_shift_worker') {
      // Dark shirt, neon safety vest overlay, hardhat
      shirt.setFillStyle(0x1e293b, 1); // dark slate

      // Neon yellow vest
      const vestL = scene.add.rectangle(-24, 112, 20, 90, 0xd4fc34, 1);
      const vestR = scene.add.rectangle(24, 112, 20, 90, 0xd4fc34, 1);
      const vestC = scene.add.rectangle(0, 126, 68, 16, 0xd4fc34, 1);
      
      // Reflective white stripes
      const stripeL = scene.add.rectangle(-24, 112, 8, 90, 0xffffff, 0.85);
      const stripeR = scene.add.rectangle(24, 112, 8, 90, 0xffffff, 0.85);
      const stripeC = scene.add.rectangle(0, 126, 68, 6, 0xffffff, 0.85);

      // Hardhat
      const hardhat = scene.add.arc(0, -10, 48, 180, 360, false, 0xf5be44, 1);
      const hardhatRim = scene.add.rectangle(0, -10, 106, 8, 0xf5be44, 1);
      const hardhatRidge = scene.add.rectangle(0, -32, 12, 28, 0xd9a224, 1);

      customVisuals.push(vestL, vestR, vestC, stripeL, stripeR, stripeC, hardhat, hardhatRim, hardhatRidge);
    } else if (customer.id === 'market_tourist') {
      // Coral floral Hawaiian shirt, sunglasses, camera strap
      shirt.setFillStyle(0xf43f5e, 1); // coral red

      // Small flower patterns on shirt
      const f1 = scene.add.circle(-34, 94, 6, 0xffffff, 0.8);
      const f2 = scene.add.circle(30, 118, 6, 0xffffff, 0.8);
      const f3 = scene.add.circle(-10, 134, 6, 0xffffff, 0.8);
      const f4 = scene.add.circle(20, 88, 6, 0xffffff, 0.8);

      const touristHair = scene.add.arc(0, -13, 46, 200, 340, false, 0xca8a04, 1); // golden brown hair

      // Sunglasses
      const glassL = scene.add.circle(-18, -4, 9, 0x11131a, 1).setStrokeStyle(1.5, 0xffffff);
      const glassR = scene.add.circle(18, -4, 9, 0x11131a, 1).setStrokeStyle(1.5, 0xffffff);
      const glassBridge = scene.add.line(0, -4, -10, 0, 10, 0, 0xffffff, 2);

      // Camera strap
      const cameraStrap = scene.add.ellipse(0, 84, 64, 28, 0x11131a, 0).setStrokeStyle(3, 0x334155);

      customVisuals.push(f1, f2, f3, f4, touristHair, glassL, glassR, glassBridge, cameraStrap);
    } else {
      // local_regular (default blue shirt, baseball cap)
      shirt.setFillStyle(0x3b82f6, 1); // blue
      const regularHair = scene.add.arc(0, -13, 46, 200, 340, false, 0x1e293b, 1);

      // Baseball cap
      const cap = scene.add.rectangle(0, -32, 54, 16, 0xef4444, 1);
      const capBrim = scene.add.rectangle(24, -28, 22, 6, 0xef4444, 1);
      capBrim.setAngle(12);

      customVisuals.push(regularHair, cap, capBrim);
    }

    // Chat Bubble & pointer
    const bubble = scene.add.rectangle(0, -126, 322, 136, 0xfff7df, 1).setStrokeStyle(4, 0x352c2f);
    const bubblePointer = scene.add.triangle(0, -52, -10, -6, 10, -6, 0, 8, 0xfff7df, 1);
    const bubblePointerStrokeL = scene.add.line(-5, -53, -5, -4, 5, 6, 0x352c2f, 4);
    const bubblePointerStrokeR = scene.add.line(5, -53, 5, -4, -5, 6, 0x352c2f, 4);

    const orderText = scene.add
      .text(0, -158, order.label, {
        align: 'center',
        color: '#352c2f',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
        wordWrap: { width: 284 },
      })
      .setOrigin(0.5);

    const personalityText = scene.add
      .text(0, -118, personality, {
        align: 'center',
        color: '#6b5b46',
        fontFamily: 'Arial, sans-serif',
        fontSize: '15px',
        wordWrap: { width: 282 },
      })
      .setOrigin(0.5);

    this.readyText = scene.add
      .text(0, -84, 'Waiting', {
        color: '#6b5b46',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const patienceTrack = scene.add.rectangle(0, -58, PATIENCE_BAR_WIDTH, 14, 0x352c2f, 1);
    this.patienceBar = scene.add
      .rectangle(-PATIENCE_BAR_WIDTH / 2, -58, PATIENCE_BAR_WIDTH, 14, COLORS.success, 1)
      .setOrigin(0, 0.5);

    this.patienceText = scene.add
      .text(0, -38, `${Math.ceil(patienceMs / 1000)}s patience`, {
        color: '#6b5b46',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);

    const nameText = scene.add
      .text(0, -210, customer.displayName, {
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    nameText.setStroke('#11131e', 4);

    hitZone.on(Phaser.Input.Events.POINTER_DOWN, onSelected);

    this.add([
      shadow,
      hitZone,
      shirt,
      body,
      collar,
      head,
      ...customVisuals,
      bubble,
      bubblePointer,
      bubblePointerStrokeL,
      bubblePointerStrokeR,
      orderText,
      personalityText,
      this.readyText,
      patienceTrack,
      this.patienceBar,
      this.patienceText,
      nameText,
    ]);

    scene.add.existing(this);
  }

  setReadyToServeState(state: 'waiting' | 'ready' | 'mismatch'): void {
    if (state === 'ready') {
      this.readyText.setText('Ready to Serve!');
      this.readyText.setColor('#3ab85d');
    } else if (state === 'mismatch') {
      this.readyText.setText('Order Mismatch');
      this.readyText.setColor('#ef4444');
    } else {
      this.readyText.setText('Waiting');
      this.readyText.setColor('#6b5b46');
    }
  }

  updatePatience(remainingMs: number, totalMs: number): void {
    const ratio = Phaser.Math.Clamp(totalMs > 0 ? remainingMs / totalMs : 0, 0, 1);
    this.patienceBar.width = Math.max(0, PATIENCE_BAR_WIDTH * ratio);
    this.patienceBar.setFillStyle(ratio < 0.25 ? COLORS.danger : ratio < 0.55 ? COLORS.warning : COLORS.success, 1);
    this.patienceText.setText(`${Math.ceil(remainingMs / 1000)}s patience`);
  }

  playServedAndDestroy(): void {
    this.disableInput();
    this.scene.tweens.add({
      targets: this,
      y: this.y - 48,
      alpha: 0,
      duration: 260,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  playLeftAndDestroy(): void {
    this.disableInput();
    this.scene.tweens.add({
      targets: this,
      x: this.x + 80,
      alpha: 0,
      duration: 300,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  private disableInput(): void {
    this.list.forEach((child) => {
      if (child instanceof Phaser.GameObjects.Zone) {
        child.disableInteractive();
      }
    });
  }
}

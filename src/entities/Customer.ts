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
    const body = scene.add.circle(0, 72, 58, COLORS.customer);
    const head = scene.add.circle(0, 0, 44, 0xffcfa3);
    const hair = scene.add.arc(0, -13, 46, 200, 340, false, 0x22202a, 1);
    const shirt = scene.add.rectangle(0, 112, 128, 90, COLORS.customerAccent, 1);
    const collar = scene.add.triangle(0, 74, -26, 0, 26, 0, 0, 28, 0xfff7df, 1);
    const bubble = scene.add.rectangle(0, -126, 322, 136, 0xfff7df, 1).setStrokeStyle(4, 0x352c2f);
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
        fontSize: '16px',
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
        fontSize: '15px',
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
      hair,
      bubble,
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

  setReadyToServe(isReady: boolean): void {
    this.readyText.setText(isReady ? 'Ready selected' : 'Waiting');
    this.readyText.setColor(isReady ? '#1f7a3c' : '#6b5b46');
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

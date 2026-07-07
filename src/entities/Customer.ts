import Phaser from 'phaser';
import { COLORS } from '../config/constants';
import type { CustomerDefinition, CustomerOrder } from '../types/gameTypes';

export class Customer extends Phaser.GameObjects.Container {
  private readonly readyText: Phaser.GameObjects.Text;

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

    const shadow = scene.add.ellipse(0, 136, 148, 30, 0x000000, 0.24);
    const hitZone = scene.add.zone(0, 0, 320, 388).setInteractive({ useHandCursor: true });
    const body = scene.add.circle(0, 72, 58, COLORS.customer);
    const head = scene.add.circle(0, 0, 44, 0xffcfa3);
    const hair = scene.add.arc(0, -13, 46, 200, 340, false, 0x22202a, 1);
    const shirt = scene.add.rectangle(0, 112, 128, 90, COLORS.customerAccent, 1);
    const collar = scene.add.triangle(0, 74, -26, 0, 26, 0, 0, 28, 0xfff7df, 1);
    const bubble = scene.add.rectangle(0, -116, 294, 112, 0xfff7df, 1).setStrokeStyle(4, 0x352c2f);
    const orderText = scene.add
      .text(0, -132, order.label, {
        color: '#352c2f',
        fontFamily: 'Arial, sans-serif',
        fontSize: '27px',
        fontStyle: 'bold',
        wordWrap: { width: 260 },
      })
      .setOrigin(0.5);

    this.readyText = scene.add
      .text(0, -96, 'Waiting', {
        color: '#6b5b46',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const patienceText = scene.add
      .text(0, -72, `${Math.round(patienceMs / 1000)}s patience`, {
        color: '#6b5b46',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
      })
      .setOrigin(0.5);

    const nameText = scene.add
      .text(0, -184, customer.displayName, {
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
      this.readyText,
      patienceText,
      nameText,
    ]);

    scene.add.existing(this);
  }

  setReadyToServe(isReady: boolean): void {
    this.readyText.setText(isReady ? 'Ready to serve' : 'Waiting');
    this.readyText.setColor(isReady ? '#1f7a3c' : '#6b5b46');
  }

  playServedAndDestroy(): void {
    this.list.forEach((child) => {
      if (child instanceof Phaser.GameObjects.Zone) {
        child.disableInteractive();
      }
    });
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
}

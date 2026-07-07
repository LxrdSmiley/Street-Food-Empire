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

    const shadow = scene.add.ellipse(0, 132, 132, 28, 0x000000, 0.22);
    const hitZone = scene.add.zone(0, 0, 280, 360).setInteractive({ useHandCursor: true });
    const body = scene.add.circle(0, 70, 54, COLORS.customer);
    const head = scene.add.circle(0, 0, 42, 0xffcfa3);
    const hair = scene.add.arc(0, -13, 44, 200, 340, false, 0x22202a, 1);
    const shirt = scene.add.rectangle(0, 108, 118, 86, COLORS.customerAccent, 1);
    const bubble = scene.add.rectangle(0, -106, 270, 94, 0xfff7df, 1).setStrokeStyle(4, 0x352c2f);
    const orderText = scene.add
      .text(0, -118, order.label, {
        color: '#352c2f',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.readyText = scene.add
      .text(0, -86, 'Waiting', {
        color: '#6b5b46',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    const patienceText = scene.add
      .text(0, -63, `${Math.round(patienceMs / 1000)}s patience`, {
        color: '#6b5b46',
        fontFamily: 'Arial, sans-serif',
        fontSize: '15px',
      })
      .setOrigin(0.5);

    const nameText = scene.add
      .text(0, 174, customer.displayName, {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5);

    hitZone.on(Phaser.Input.Events.POINTER_DOWN, onSelected);

    this.add([shadow, hitZone, shirt, body, head, hair, bubble, orderText, this.readyText, patienceText, nameText]);

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

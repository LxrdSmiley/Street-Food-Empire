import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config/constants';
import { UPGRADES } from '../data/upgrades';
import { SaveSystem } from '../systems/SaveSystem';
import { formatCoins } from '../utils/format';

export class TitleScene extends Phaser.Scene {
  private saveSystem!: SaveSystem;
  private statusText?: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.TITLE);
  }

  create(): void {
    this.saveSystem = new SaveSystem(UPGRADES);
    const loadedSave = this.saveSystem.load();

    this.createBackdrop();

    this.add
      .text(GAME_WIDTH / 2, 194, 'Street Food Empire:\nKingston Rush', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '52px',
        fontStyle: 'bold',
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        326,
        'A tiny night-market cart. Fast orders. Bigger upgrades. One clean prototype loop.',
        {
          align: 'center',
          color: '#ffd166',
          fontFamily: 'Arial, sans-serif',
          fontSize: '25px',
          lineSpacing: 8,
          wordWrap: { width: GAME_WIDTH - 120 },
        },
      )
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 432, 'Tap grill -> Tap customer -> Buy upgrades', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        522,
        `Coins: ${formatCoins(loadedSave.snapshot.coins)} | Stall ${loadedSave.snapshot.stallLevel}`,
        {
          align: 'center',
          color: '#fff7df',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
        },
      )
      .setOrigin(0.5);

    this.createButton(GAME_WIDTH / 2, 666, 354, 78, 'Start / Continue', COLORS.success, () => {
      this.scene.start(SCENE_KEYS.MAIN);
    });

    this.createButton(GAME_WIDTH / 2, 768, 280, 68, 'Reset Save', 0x3b3f4d, () => {
      this.saveSystem.reset();
      this.statusText?.setText('Save reset. Start when ready.');
    });

    this.statusText = this.add
      .text(GAME_WIDTH / 2, 856, this.getSaveStatusMessage(loadedSave.status), {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '21px',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);
  }

  private createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    fillColor: number,
    onSelect: () => void,
  ): void {
    const button = this.add.rectangle(x, y, width, height, fillColor, 1);
    button.setStrokeStyle(3, COLORS.hudStroke, 0.9);

    this.add
      .text(x, y, label, {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .zone(x, y, width + 28, height + 24)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        onSelect();
      });
  }

  private getSaveStatusMessage(status: string): string {
    if (status === 'repaired') {
      return 'Local save repaired for this demo.';
    }

    if (status === 'reset') {
      return 'Local save reset for this demo.';
    }

    return 'Placeholder MVP demo build.';
  }

  private createBackdrop(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.skyTop);
    this.add.rectangle(GAME_WIDTH / 2, 820, GAME_WIDTH, 920, COLORS.skyBottom);
    this.add.rectangle(GAME_WIDTH / 2, 520, GAME_WIDTH, 170, 0x2f2743, 0.6);
    this.add.rectangle(GAME_WIDTH / 2, 1110, GAME_WIDTH, 360, COLORS.street);

    for (let index = 0; index < 9; index += 1) {
      const x = 38 + index * 82;
      const y = 122 + (index % 2) * 26;
      this.add.circle(x, y, 7, COLORS.warning, 0.9);
      this.add.line(x, y, 0, 0, 52, 34, 0xfff0a8, 0.32).setOrigin(0, 0);
    }

    this.add.rectangle(GAME_WIDTH / 2, 1010, 440, 198, COLORS.stallWood, 1).setStrokeStyle(5, COLORS.stallTrim);
    this.add.rectangle(GAME_WIDTH / 2, 910, 490, 48, COLORS.stallTrim, 1);
    this.add.rectangle(GAME_WIDTH / 2, 1060, 230, 88, COLORS.grill, 1);
    this.add.ellipse(GAME_WIDTH / 2 - 88, 1052, 62, 34, 0xfff7df, 1).setStrokeStyle(2, 0x11131e);
    this.add.ellipse(GAME_WIDTH / 2 - 94, 1048, 30, 18, 0xb85f2e, 1);
    this.add.ellipse(GAME_WIDTH / 2 - 70, 1058, 26, 16, 0xe0953f, 1);
  }
}

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
      .text(GAME_WIDTH / 2, 214, 'Street Food Empire:\nKingston Rush', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '54px',
        fontStyle: 'bold',
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        350,
        'Serve Kingston Night Market customers, build your stall, and trigger Rush Hour for bonus coins.',
        {
          align: 'center',
          color: '#ffd166',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          lineSpacing: 8,
          wordWrap: { width: GAME_WIDTH - 120 },
        },
      )
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        472,
        `Coins: ${formatCoins(loadedSave.snapshot.coins)} | Stall ${loadedSave.snapshot.stallLevel}`,
        {
          align: 'center',
          color: '#fff7df',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
        },
      )
      .setOrigin(0.5);

    this.createButton(GAME_WIDTH / 2, 648, 330, 72, 'Start / Continue', COLORS.success, () => {
      this.scene.start(SCENE_KEYS.MAIN);
    });

    this.createButton(GAME_WIDTH / 2, 744, 260, 62, 'Reset Save', 0x3b3f4d, () => {
      this.saveSystem.reset();
      this.statusText?.setText('Save reset. Start when ready.');
    });

    this.statusText = this.add
      .text(GAME_WIDTH / 2, 826, this.getSaveStatusMessage(loadedSave.status), {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
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
    this.add.rectangle(GAME_WIDTH / 2, 1110, GAME_WIDTH, 360, COLORS.street);

    for (let index = 0; index < 8; index += 1) {
      const x = 54 + index * 88;
      const y = 122 + (index % 2) * 26;
      this.add.circle(x, y, 7, COLORS.warning, 0.9);
      this.add.line(x, y, 0, 0, 52, 34, 0xfff0a8, 0.32).setOrigin(0, 0);
    }

    this.add.rectangle(GAME_WIDTH / 2, 1010, 420, 190, COLORS.stallWood, 1).setStrokeStyle(5, COLORS.stallTrim);
    this.add.rectangle(GAME_WIDTH / 2, 910, 470, 42, COLORS.stallTrim, 1);
    this.add.rectangle(GAME_WIDTH / 2, 1060, 220, 84, COLORS.grill, 1);
  }
}

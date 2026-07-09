import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config/constants';
import { UPGRADES } from '../data/upgrades';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { formatCoins } from '../utils/format';
import { MarketBackdrop } from '../entities/MarketBackdrop';
import { Stall } from '../entities/Stall';
import type { GameSnapshot } from '../types/gameTypes';

export class TitleScene extends Phaser.Scene {
  private saveSystem!: SaveSystem;
  private audioSystem!: AudioSystem;
  private currentSnapshot!: GameSnapshot;
  private statusText?: Phaser.GameObjects.Text;
  private soundButtonText?: Phaser.GameObjects.Text;
  private infoText?: Phaser.GameObjects.Text;
  private stall!: Stall;

  constructor() {
    super(SCENE_KEYS.TITLE);
  }

  create(): void {
    this.saveSystem = new SaveSystem(UPGRADES);
    const loadedSave = this.saveSystem.load();
    this.currentSnapshot = loadedSave.snapshot;
    this.audioSystem = new AudioSystem(loadedSave.snapshot.settings.soundEnabled);

    // Reusable Backdrop
    new MarketBackdrop(this);

    // Dynamic Stall matching player's current level
    this.stall = new Stall(this, GAME_WIDTH / 2, 1010, this.currentSnapshot.stallLevel);

    // Title Title Panel Background to increase contrast
    const titlePanel = this.add.graphics();
    titlePanel.fillStyle(0x0e1017, 0.76);
    titlePanel.fillRoundedRect(44, 110, GAME_WIDTH - 88, 510, 16);
    titlePanel.strokeRoundedRect(44, 110, GAME_WIDTH - 88, 510, 16);
    titlePanel.lineStyle(2, COLORS.hudStroke, 0.6);

    this.add
      .text(GAME_WIDTH / 2, 185, 'Street Food Empire:\nKingston Rush', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '48px',
        fontStyle: 'bold',
        lineSpacing: 10,
      })
      .setOrigin(0.5)
      .setStroke('#11131a', 5);

    this.add
      .text(
        GAME_WIDTH / 2,
        306,
        'Run a short night-market shift. Read orders, cook the right items, and serve before patience runs out.',
        {
          align: 'center',
          color: '#ffd166',
          fontFamily: 'Arial, sans-serif',
          fontSize: '23px',
          lineSpacing: 8,
          wordWrap: { width: GAME_WIDTH - 120 },
        },
      )
      .setOrigin(0.5)
      .setStroke('#11131a', 3);

    this.add
      .text(GAME_WIDTH / 2, 404, 'Start Day -> Cook order -> Select ready food -> Serve customer', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '23px',
        fontStyle: 'bold',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5)
      .setStroke('#11131a', 3);

    this.infoText = this.add
      .text(
        GAME_WIDTH / 2,
        485,
        `Coins: ${formatCoins(loadedSave.snapshot.coins)} | Stall Stage: ${this.currentSnapshot.stallLevel}`,
        {
          align: 'center',
          color: '#ffd166',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          fontStyle: 'bold',
        },
      )
      .setOrigin(0.5);
    this.infoText.setStroke('#11131a', 4);

    this.createButton(GAME_WIDTH / 2, 666, 354, 78, 'Start / Continue', COLORS.success, () => {
      this.audioSystem.unlock();
      this.audioSystem.play('button_tap');
      this.scene.start(SCENE_KEYS.MAIN);
    });

    this.createButton(GAME_WIDTH / 2, 768, 280, 68, 'Reset Save', 0x3b3f4d, () => {
      this.audioSystem.unlock();
      this.audioSystem.play('button_tap');
      const resetSave = this.saveSystem.reset();
      this.currentSnapshot = {
        coins: resetSave.coins,
        upgrades: resetSave.upgrades,
        stallLevel: resetSave.stallLevel,
        stallXp: resetSave.stallXp,
        settings: resetSave.settings,
      };
      this.audioSystem.setEnabled(resetSave.settings.soundEnabled);
      this.soundButtonText?.setText(this.getSoundLabel());
      this.statusText?.setText('Save reset. Start when ready.');
      this.infoText?.setText(`Coins: ${formatCoins(resetSave.coins)} | Stall Stage: ${resetSave.stallLevel}`);
      this.stall.setLevel(resetSave.stallLevel); // visual cart immediately resets to Stage 1!
    });

    this.soundButtonText = this.createButton(GAME_WIDTH / 2, 852, 250, 58, this.getSoundLabel(), 0x3b3f4d, () => {
      this.handleSoundToggle();
    });

    this.statusText = this.add
      .text(GAME_WIDTH / 2, 570, this.getSaveStatusMessage(loadedSave.status), {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);
    this.statusText.setStroke('#11131a', 3);
  }

  private createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    fillColor: number,
    onSelect: () => void,
  ): Phaser.GameObjects.Text {
    const graphics = this.add.graphics();
    graphics.fillStyle(fillColor, 1);
    graphics.lineStyle(2.5, COLORS.hudStroke, 0.9);
    graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, 12);
    graphics.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 12);

    const buttonText = this.add
      .text(x, y, label, {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    buttonText.setStroke('#11131a', 3);

    this.add
      .zone(x, y, width + 28, height + 24)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        onSelect();
      });

    return buttonText;
  }

  private handleSoundToggle(): void {
    this.audioSystem.unlock();
    const nextEnabled = !this.audioSystem.isEnabled();
    this.audioSystem.setEnabled(nextEnabled);
    this.currentSnapshot = {
      ...this.currentSnapshot,
      settings: {
        soundEnabled: nextEnabled,
      },
    };
    this.saveSystem.save(this.currentSnapshot);
    this.soundButtonText?.setText(this.getSoundLabel());
    this.statusText?.setText(nextEnabled ? 'Sound enabled.' : 'Sound muted.');
    this.audioSystem.play('button_tap');
  }

  private getSoundLabel(): string {
    return this.audioSystem.isEnabled() ? 'Sound: On' : 'Sound: Off';
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
}

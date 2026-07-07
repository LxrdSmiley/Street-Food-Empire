import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../config/constants';
import { formatCoins } from '../utils/format';
import type { UpgradeState } from '../types/gameTypes';

export class UpgradePanel extends Phaser.GameObjects.Container {
  private readonly rows: Phaser.GameObjects.GameObject[] = [];
  private readonly onBuyUpgrade: (upgradeId: string) => void;

  constructor(scene: Phaser.Scene, onBuyUpgrade: (upgradeId: string) => void) {
    super(scene, GAME_WIDTH / 2, 1112);
    this.onBuyUpgrade = onBuyUpgrade;

    const panel = scene.add.rectangle(0, 0, GAME_WIDTH - 40, 214, COLORS.hudPanel, 0.96);
    panel.setStrokeStyle(3, COLORS.hudStroke);

    const title = scene.add
      .text(-318, -90, 'Upgrades', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    this.add([panel, title]);
    scene.add.existing(this);
  }

  render(upgradeStates: readonly UpgradeState[]): void {
    this.rows.forEach((rowObject) => rowObject.destroy());
    this.rows.length = 0;

    upgradeStates.forEach((upgradeState, index) => {
      const y = -50 + index * 44;
      const rowObjects = this.createRow(upgradeState, y);
      this.rows.push(...rowObjects);
      this.add(rowObjects);
    });
  }

  private createRow(upgradeState: UpgradeState, y: number): Phaser.GameObjects.GameObject[] {
    const scene = this.scene;
    const label = scene.add
      .text(-310, y, upgradeState.definition.name, {
        color: upgradeState.isUnlocked ? '#fff7df' : '#8f96a3',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    const level = scene.add
      .text(-116, y, `Lv ${upgradeState.level}/${upgradeState.definition.maxLevel}`, {
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0, 0.5);

    const status = this.getStatusText(upgradeState);
    const statusText = scene.add
      .text(-22, y, status, {
        color: upgradeState.canAfford ? '#7bd88f' : '#d8d0bd',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
      })
      .setOrigin(0, 0.5);

    const canBuy = upgradeState.canAfford && !upgradeState.isMaxed && upgradeState.isUnlocked;
    const button = scene.add.rectangle(235, y, 154, 36, canBuy ? COLORS.success : 0x3b3f4d, 1);
    button.setStrokeStyle(2, 0xffffff, 0.45);
    const hitZone = scene.add.zone(235, y, 172, 52).setInteractive({ useHandCursor: canBuy });

    hitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (canBuy) {
        this.onBuyUpgrade(upgradeState.definition.id);
      }
    });

    const buttonText = scene.add
      .text(235, y, this.getButtonText(upgradeState), {
        align: 'center',
        color: canBuy ? '#112015' : '#d8d0bd',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    return [label, level, statusText, button, hitZone, buttonText];
  }

  private getStatusText(upgradeState: UpgradeState): string {
    if (!upgradeState.isUnlocked) {
      return `Unlocks at stall ${upgradeState.unlockStallLevel}`;
    }

    if (upgradeState.isMaxed || upgradeState.cost === null) {
      return 'Maxed';
    }

    return `${formatCoins(upgradeState.cost)} coins`;
  }

  private getButtonText(upgradeState: UpgradeState): string {
    if (!upgradeState.isUnlocked) {
      return 'Locked';
    }

    if (upgradeState.isMaxed) {
      return 'Max';
    }

    return upgradeState.canAfford ? 'Buy' : 'Need coins';
  }
}

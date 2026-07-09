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

    // Draw Panel Base
    const panel = scene.add.graphics();
    panel.fillStyle(COLORS.hudPanel, 0.96);
    panel.lineStyle(3.5, COLORS.hudStroke, 1);
    panel.fillRoundedRect(-(GAME_WIDTH - 40) / 2, -107, GAME_WIDTH - 40, 214, 14);
    panel.strokeRoundedRect(-(GAME_WIDTH - 40) / 2, -107, GAME_WIDTH - 40, 214, 14);

    const title = scene.add
      .text(-318, -88, 'Grill & Stall Upgrades', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);
    title.setStroke('#11131e', 3);

    this.add([title]);
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

    // Row Background Card
    const rowBg = scene.add.rectangle(0, y, GAME_WIDTH - 72, 38, 0x1d1e26, 0.75).setStrokeStyle(1.5, 0x2e303d);

    const label = scene.add
      .text(-310, y, upgradeState.definition.name, {
        color: upgradeState.isUnlocked ? '#fff7df' : '#64748b',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    const level = scene.add
      .text(-116, y, `Lv ${upgradeState.level}/${upgradeState.definition.maxLevel}`, {
        color: upgradeState.isMaxed ? '#7bd88f' : '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold'
      })
      .setOrigin(0, 0.5);

    const status = this.getStatusText(upgradeState);
    const costColor = upgradeState.isMaxed
      ? '#7bd88f'
      : !upgradeState.isUnlocked
      ? '#64748b'
      : upgradeState.canAfford
      ? '#7bd88f'
      : '#e85d5d';
    
    const statusText = scene.add
      .text(-22, y, status, {
        color: costColor,
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold'
      })
      .setOrigin(0, 0.5);

    const canBuy = upgradeState.canAfford && !upgradeState.isMaxed && upgradeState.isUnlocked;
    
    // Styled Button with border
    const button = scene.add.rectangle(235, y, 154, 30, canBuy ? COLORS.success : 0x2a2c3a, 1);
    button.setStrokeStyle(1.5, canBuy ? 0xffffff : 0x475569);
    
    const hitZone = scene.add.zone(235, y, 172, 46).setInteractive({ useHandCursor: canBuy });
    hitZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (canBuy) {
        this.onBuyUpgrade(upgradeState.definition.id);
      }
    });

    const buttonText = scene.add
      .text(235, y, this.getButtonText(upgradeState), {
        align: 'center',
        color: canBuy ? '#112015' : '#94a3b8',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    return [rowBg, label, level, statusText, button, hitZone, buttonText];
  }

  private getStatusText(upgradeState: UpgradeState): string {
    if (!upgradeState.isUnlocked) {
      return `Unlocks at Stall ${upgradeState.unlockStallLevel}`;
    }

    if (upgradeState.isMaxed || upgradeState.cost === null) {
      return '⭐ Maxed';
    }

    return `${formatCoins(upgradeState.cost)} coins`;
  }

  private getButtonText(upgradeState: UpgradeState): string {
    if (!upgradeState.isUnlocked) {
      return 'Locked';
    }

    if (upgradeState.isMaxed) {
      return 'Max Level';
    }

    return upgradeState.canAfford ? 'Buy' : 'Need coins';
  }
}

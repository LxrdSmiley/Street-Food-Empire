import { MIN_PREP_TIME_MS } from '../config/constants';
import type { EconomySystem } from './EconomySystem';
import type {
  FoodDefinition,
  PurchaseUpgradeResult,
  UpgradeDefinition,
  UpgradeLevels,
  UpgradeState,
} from '../types/gameTypes';

export class UpgradeSystem {
  private readonly upgrades: readonly UpgradeDefinition[];
  private readonly levels = new Map<string, number>();

  constructor(upgrades: readonly UpgradeDefinition[], savedLevels: UpgradeLevels = {}) {
    this.upgrades = upgrades;

    upgrades.forEach((upgrade) => {
      const savedLevel = savedLevels[upgrade.id] ?? 0;
      this.levels.set(upgrade.id, Math.min(Math.max(savedLevel, 0), upgrade.maxLevel));
    });
  }

  getUpgradeStates(coins: number, stallLevel: number): UpgradeState[] {
    return this.upgrades.map((upgrade) => {
      const level = this.getLevel(upgrade.id);
      const isMaxed = level >= upgrade.maxLevel;
      const isUnlocked = stallLevel >= upgrade.unlockStallLevel;
      const cost = isMaxed ? null : this.getUpgradeCost(upgrade.id);

      return {
        definition: upgrade,
        level,
        cost,
        canAfford: isUnlocked && cost !== null && coins >= cost,
        isMaxed,
        isUnlocked,
        unlockStallLevel: upgrade.unlockStallLevel,
      };
    });
  }

  getLevel(upgradeId: string): number {
    return this.levels.get(upgradeId) ?? 0;
  }

  getUpgradeLevels(): UpgradeLevels {
    return Object.fromEntries(this.upgrades.map((upgrade) => [upgrade.id, this.getLevel(upgrade.id)]));
  }

  getAdjustedPrepTime(food: FoodDefinition): number {
    const reduction = this.upgrades.reduce((totalReduction, upgrade) => {
      if (
        upgrade.effectType !== 'prep_time_reduction_ms' ||
        (upgrade.targetFoodId && upgrade.targetFoodId !== food.id)
      ) {
        return totalReduction;
      }

      return totalReduction + this.getLevel(upgrade.id) * upgrade.effectValue;
    }, 0);

    return Math.max(MIN_PREP_TIME_MS, food.basePrepTimeMs - reduction);
  }

  getRewardBonus(): number {
    return this.getTotalEffectValue('food_reward_bonus');
  }

  getPatienceBonusMs(): number {
    return this.getTotalEffectValue('customer_patience_bonus_ms');
  }

  getSpawnDelayReductionMs(): number {
    return this.getTotalEffectValue('spawn_interval_reduction_ms');
  }

  purchaseUpgrade(upgradeId: string, economySystem: EconomySystem, stallLevel: number): PurchaseUpgradeResult {
    const upgrade = this.findUpgrade(upgradeId);

    if (!upgrade) {
      return { success: false, reason: 'unknown_upgrade' };
    }

    if (stallLevel < upgrade.unlockStallLevel) {
      return { success: false, reason: 'locked' };
    }

    const currentLevel = this.getLevel(upgradeId);

    if (currentLevel >= upgrade.maxLevel) {
      return { success: false, reason: 'max_level' };
    }

    const cost = this.getUpgradeCost(upgradeId);

    if (!economySystem.spendCoins(cost)) {
      return { success: false, reason: 'not_enough_coins' };
    }

    const nextLevel = currentLevel + 1;
    this.levels.set(upgradeId, nextLevel);

    return {
      success: true,
      upgradeId,
      level: nextLevel,
      cost,
    };
  }

  private getUpgradeCost(upgradeId: string): number {
    const upgrade = this.findUpgrade(upgradeId);

    if (!upgrade) {
      return 0;
    }

    const level = this.getLevel(upgradeId);
    return Math.round(upgrade.baseCost * (level + 1));
  }

  private findUpgrade(upgradeId: string): UpgradeDefinition | undefined {
    return this.upgrades.find((upgrade) => upgrade.id === upgradeId);
  }

  private getTotalEffectValue(effectType: UpgradeDefinition['effectType']): number {
    return this.upgrades.reduce((total, upgrade) => {
      if (upgrade.effectType !== effectType) {
        return total;
      }

      return total + this.getLevel(upgrade.id) * upgrade.effectValue;
    }, 0);
  }
}

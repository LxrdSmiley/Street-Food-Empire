import type Phaser from 'phaser';
import type { Customer } from '../entities/Customer';

export interface FoodDefinition {
  id: string;
  name: string;
  description: string;
  basePrepTimeMs: number;
  baseReward: number;
  unlockStallLevel: number;
}

export interface CustomerDefinition {
  id: string;
  displayName: string;
  patienceMs: number;
  tipMultiplier: number;
  availableFromStallLevel: number;
}

export interface CustomerOrder {
  foodId: string;
  label: string;
}

export interface CustomerState {
  id: string;
  customerTypeId: string;
  order: CustomerOrder;
  view: Customer;
  isReadyToServe: boolean;
}

export interface CustomerSpawnConfig {
  scene: Phaser.Scene;
  customers: readonly CustomerDefinition[];
  foods: readonly FoodDefinition[];
  spawnPoint: {
    x: number;
    y: number;
  };
  getStallLevel: () => number;
  getPatienceBonusMs: () => number;
  onCustomerSelected: () => void;
}

export type ServeResult =
  | {
      success: true;
      customerTypeId: string;
      foodId: string;
    }
  | {
      success: false;
    };

export type UpgradeEffectType =
  | 'prep_time_reduction_ms'
  | 'food_reward_bonus'
  | 'customer_patience_bonus_ms'
  | 'spawn_interval_reduction_ms';

export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  maxLevel: number;
  effectType: UpgradeEffectType;
  effectValue: number;
  unlockStallLevel: number;
  targetFoodId?: string;
}

export interface UpgradeState {
  definition: UpgradeDefinition;
  level: number;
  cost: number | null;
  canAfford: boolean;
  isMaxed: boolean;
  isUnlocked: boolean;
  unlockStallLevel: number;
}

export type UpgradeLevels = Record<string, number>;

export type PurchaseUpgradeResult =
  | {
      success: true;
      upgradeId: string;
      level: number;
      cost: number;
    }
  | {
      success: false;
      reason: 'unknown_upgrade' | 'locked' | 'max_level' | 'not_enough_coins';
    };

export interface SaveGameData {
  schemaVersion: number;
  coins: number;
  upgrades: UpgradeLevels;
  stallLevel: number;
  stallXp: number;
  lastSavedAt: number;
  checksum: string;
}

export interface GameSnapshot {
  coins: number;
  upgrades: UpgradeLevels;
  stallLevel: number;
  stallXp: number;
}

export interface LoadedSave {
  snapshot: GameSnapshot;
  lastSavedAt: number;
  status: 'default' | 'loaded' | 'repaired' | 'reset';
  reason?: string;
  canGrantOfflineEarnings: boolean;
}

export interface RushHourConfig {
  durationSeconds: number;
  rewardMultiplier: number;
  spawnIntervalMultiplier: number;
}

export interface RushHourState {
  isActive: boolean;
  remainingSeconds: number;
  rewardMultiplier: number;
  spawnIntervalMultiplier: number;
}

export interface ProgressionState {
  stallLevel: number;
  stallXp: number;
  nextLevelXp: number | null;
  progressToNextLevel: number;
  isMaxLevel: boolean;
}

export interface ProgressionResult {
  xpEarned: number;
  didLevelUp: boolean;
  previousLevel: number;
  currentLevel: number;
}

export interface OfflineEarningsConfig {
  maxOfflineMinutes: number;
  minimumOfflineMinutesToReward: number;
  maxCoinsPerMinute: number;
}

export interface OfflineEarningsInput {
  lastSavedAt: number;
  now: number;
  stallLevel: number;
  unlockedFoodCount: number;
  foodValueUpgradeLevel: number;
}

export interface OfflineEarningsResult {
  shouldReward: boolean;
  coinsEarned: number;
  minutesAway: number;
  cappedMinutes: number;
  coinsPerMinute: number;
  wasCapped: boolean;
  reason?: string;
}

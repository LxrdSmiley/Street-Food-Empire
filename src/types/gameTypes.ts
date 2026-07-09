import type Phaser from 'phaser';
import type { Customer } from '../entities/Customer';

export interface FoodDefinition {
  id: string;
  name: string;
  description: string;
  basePrepTimeMs: number;
  readyWindowMs: number;
  baseReward: number;
  unlockStallLevel: number;
}

export interface CustomerDefinition {
  id: string;
  displayName: string;
  patienceMs: number;
  tipMultiplier: number;
  orderDifficultyBias: number;
  personalityLines: readonly string[];
  availableFromStallLevel: number;
}

export interface OrderItem {
  foodId: string;
  label: string;
}

export interface CustomerOrder {
  items: OrderItem[];
  label: string;
}

export interface CustomerState {
  id: string;
  customerTypeId: string;
  customer: CustomerDefinition;
  order: CustomerOrder;
  view: Customer;
  isReadyToServe: boolean;
  patienceMs: number;
  remainingPatienceMs: number;
}

export interface CustomerSpawnConfig {
  scene: Phaser.Scene;
  customers: readonly CustomerDefinition[];
  spawnPoint: {
    x: number;
    y: number;
  };
  getStallLevel: () => number;
  getPatienceBonusMs: () => number;
  createOrder: (customer: CustomerDefinition) => CustomerOrder;
  onCustomerSelected: () => void;
  onCustomerExpired: (customerState: CustomerState) => void;
}

export type FoodSlotState = 'empty' | 'cooking' | 'ready' | 'burnt';

export interface FoodSlotSnapshot {
  index: number;
  state: FoodSlotState;
  foodId?: string;
}

export interface OrderCheckResult {
  isCorrect: boolean;
  expectedFoodIds: string[];
  servedFoodIds: string[];
}

export interface DayState {
  isActive: boolean;
  targetCustomers: number;
  customersServed: number;
  customersMissed: number;
  coinsEarned: number;
  tipsEarned: number;
  satisfaction: number;
  bestStreak: number;
}

export interface DaySummary {
  customersServed: number;
  customersMissed: number;
  coinsEarned: number;
  tipsEarned: number;
  satisfaction: number;
  bestStreak: number;
  resultText: 'Great Day' | 'Good Day' | 'Rough Day';
}

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

export type AudioEventName =
  | 'button_tap'
  | 'food_prep_start'
  | 'food_ready'
  | 'serve_success'
  | 'coin_gain'
  | 'upgrade_bought'
  | 'level_up'
  | 'rush_start'
  | 'rush_end';

export interface GameSettings {
  soundEnabled: boolean;
  tutorialCompleted: boolean;
}

export type TutorialStep =
  | 'welcome'
  | 'start_day'
  | 'read_order'
  | 'tap_food_slot'
  | 'wait_for_ready'
  | 'select_ready_food'
  | 'serve_customer'
  | 'open_goals'
  | 'finish_day'
  | 'open_upgrades'
  | 'completed';

export type TutorialAction =
  | 'next'
  | 'start_day_clicked'
  | 'customer_spawned'
  | 'food_slot_tapped'
  | 'food_ready'
  | 'food_selected'
  | 'customer_served'
  | 'goals_opened'
  | 'day_completed'
  | 'upgrades_opened';


export interface SaveGameData {
  schemaVersion: number;
  coins: number;
  upgrades: UpgradeLevels;
  stallLevel: number;
  stallXp: number;
  settings: GameSettings;
  lastSavedAt: number;
  checksum: string;
}

export interface GameSnapshot {
  coins: number;
  upgrades: UpgradeLevels;
  stallLevel: number;
  stallXp: number;
  settings: GameSettings;
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

export type SessionGoalType =
  | 'serve_correct'
  | 'earn_coins'
  | 'reach_streak'
  | 'end_satisfaction'
  | 'avoid_wrong_orders'
  | 'serve_two_item_orders';

export interface SessionGoal {
  id: string;
  type: SessionGoalType;
  label: string;
  target: number;
  progress: number;
  completed: boolean;
  rewardCoins: number;
  rewardXp: number;
}

export interface SessionGoalRewards {
  totalCoins: number;
  totalXp: number;
  completedCount: number;
  goals: readonly SessionGoal[];
}


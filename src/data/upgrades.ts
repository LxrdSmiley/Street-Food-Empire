import type { UpgradeDefinition } from '../types/gameTypes';

export const UPGRADES: readonly UpgradeDefinition[] = [
  {
    id: 'grill_speed',
    name: 'Hotter Grill',
    description: 'Reduces food prep time.',
    baseCost: 25,
    maxLevel: 5,
    effectType: 'prep_time_reduction_ms',
    effectValue: 180,
    unlockStallLevel: 1,
  },
  {
    id: 'food_value',
    name: 'Better Portions',
    description: 'Adds coins to every order.',
    baseCost: 50,
    maxLevel: 5,
    effectType: 'food_reward_bonus',
    effectValue: 3,
    unlockStallLevel: 2,
  },
  {
    id: 'customer_patience',
    name: 'Friendly Service',
    description: 'Improves customer patience.',
    baseCost: 80,
    maxLevel: 4,
    effectType: 'customer_patience_bonus_ms',
    effectValue: 1000,
    unlockStallLevel: 3,
  },
  {
    id: 'stall_capacity',
    name: 'Serving Space',
    description: 'Customers return sooner after service.',
    baseCost: 120,
    maxLevel: 4,
    effectType: 'spawn_interval_reduction_ms',
    effectValue: 80,
    unlockStallLevel: 4,
  },
];

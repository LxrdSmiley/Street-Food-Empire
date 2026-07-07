import type { FoodDefinition } from '../types/gameTypes';

export const FOODS: readonly FoodDefinition[] = [
  {
    id: 'jerk_chicken',
    name: 'Jerk Chicken',
    description: 'Smoky grilled starter plate.',
    basePrepTimeMs: 2000,
    baseReward: 10,
    unlockStallLevel: 1,
  },
  {
    id: 'festival',
    name: 'Festival',
    description: 'Sweet fried side for quick orders.',
    basePrepTimeMs: 1800,
    baseReward: 14,
    unlockStallLevel: 2,
  },
  {
    id: 'roast_corn',
    name: 'Roast Corn',
    description: 'Charred market corn with a steady payout.',
    basePrepTimeMs: 2400,
    baseReward: 22,
    unlockStallLevel: 3,
  },
  {
    id: 'pepper_shrimp',
    name: 'Pepper Shrimp',
    description: 'Spicy premium snack for later rushes.',
    basePrepTimeMs: 3000,
    baseReward: 34,
    unlockStallLevel: 4,
  },
];

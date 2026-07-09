import type { CustomerDefinition } from '../types/gameTypes';

export const CUSTOMERS: readonly CustomerDefinition[] = [
  {
    id: 'local_regular',
    displayName: 'Local Regular',
    patienceMs: 14000,
    tipMultiplier: 1,
    orderDifficultyBias: 0,
    personalityLines: ['Same tasty thing as usual.', 'Quick plate for the walk home.'],
    availableFromStallLevel: 1,
  },
  {
    id: 'hungry_student',
    displayName: 'Hungry Student',
    patienceMs: 10000,
    tipMultiplier: 1.1,
    orderDifficultyBias: 0.12,
    personalityLines: ['I have class soon.', 'Something quick, please.'],
    availableFromStallLevel: 2,
  },
  {
    id: 'night_shift_worker',
    displayName: 'Night Shift Worker',
    patienceMs: 9000,
    tipMultiplier: 1.25,
    orderDifficultyBias: 0.2,
    personalityLines: ['Short break. Make it fast.', 'Need fuel for the shift.'],
    availableFromStallLevel: 3,
  },
  {
    id: 'market_tourist',
    displayName: 'Market Tourist',
    patienceMs: 15000,
    tipMultiplier: 1.5,
    orderDifficultyBias: 0.28,
    personalityLines: ['What do locals recommend?', 'I want the market favorite.'],
    availableFromStallLevel: 4,
  },
];

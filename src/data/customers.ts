import type { CustomerDefinition } from '../types/gameTypes';

export const CUSTOMERS: readonly CustomerDefinition[] = [
  {
    id: 'local_regular',
    displayName: 'Local Regular',
    patienceMs: 12000,
    tipMultiplier: 1,
    availableFromStallLevel: 1,
  },
  {
    id: 'hungry_student',
    displayName: 'Hungry Student',
    patienceMs: 10000,
    tipMultiplier: 1.1,
    availableFromStallLevel: 2,
  },
  {
    id: 'night_shift_worker',
    displayName: 'Night Shift Worker',
    patienceMs: 9000,
    tipMultiplier: 1.25,
    availableFromStallLevel: 3,
  },
  {
    id: 'market_tourist',
    displayName: 'Market Tourist',
    patienceMs: 15000,
    tipMultiplier: 1.5,
    availableFromStallLevel: 4,
  },
];

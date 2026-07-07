export const GAME_WIDTH = 720;
export const GAME_HEIGHT = 1280;

export const SCENE_KEYS = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  TITLE: 'TitleScene',
  MAIN: 'MainScene',
} as const;

export const STARTING_COINS = 0;
export const MAX_SAFE_COINS = 999_999_999;
export const CUSTOMER_RESPAWN_DELAY_MS = 900;
export const MIN_PREP_TIME_MS = 800;
export const SAVE_KEY = 'street_food_empire_save_v1';
export const SAVE_SCHEMA_VERSION = 2;
export const SAVE_FUTURE_TOLERANCE_MS = 5 * 60 * 1000;
export const STARTING_STALL_LEVEL = 1;
export const MAX_STALL_LEVEL = 4;
export const STARTING_STALL_XP = 0;
export const STALL_LEVEL_XP_REQUIREMENTS: Record<number, number> = {
  1: 36,
  2: 90,
  3: 160,
};

export const RUSH_HOUR_DEFAULTS = {
  durationSeconds: 30,
  rewardMultiplier: 2,
  spawnIntervalMultiplier: 0.5,
} as const;

export const OFFLINE_EARNINGS_DEFAULTS = {
  maxOfflineMinutes: 240,
  minimumOfflineMinutesToReward: 2,
  maxCoinsPerMinute: 120,
} as const;

export const COLORS = {
  skyTop: 0x12192d,
  skyBottom: 0x25213a,
  street: 0x2a2630,
  stallWood: 0x8f5330,
  stallTrim: 0xf5be44,
  grill: 0x30333d,
  customer: 0x4fb4ff,
  customerAccent: 0xffd166,
  hudPanel: 0x171923,
  hudStroke: 0xf5be44,
  success: 0x7bd88f,
  warning: 0xffd166,
  danger: 0xe85d5d,
} as const;

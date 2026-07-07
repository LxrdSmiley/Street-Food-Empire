import { RUSH_HOUR_DEFAULTS } from '../config/constants';
import type { RushHourConfig, RushHourState } from '../types/gameTypes';

export class RushHourSystem {
  private readonly config: RushHourConfig;
  private active = false;
  private remainingMs = 0;

  constructor(config: RushHourConfig = RUSH_HOUR_DEFAULTS) {
    this.config = config;
  }

  startRushHour(): boolean {
    if (this.active) {
      return false;
    }

    this.active = true;
    this.remainingMs = this.config.durationSeconds * 1000;
    return true;
  }

  update(deltaMs: number): boolean {
    if (!this.active) {
      return false;
    }

    this.remainingMs = Math.max(0, this.remainingMs - deltaMs);

    if (this.remainingMs > 0) {
      return false;
    }

    this.endRushHour();
    return true;
  }

  endRushHour(): void {
    this.active = false;
    this.remainingMs = 0;
  }

  isActive(): boolean {
    return this.active;
  }

  getRewardMultiplier(): number {
    return this.active ? this.config.rewardMultiplier : 1;
  }

  getSpawnIntervalMultiplier(): number {
    return this.active ? this.config.spawnIntervalMultiplier : 1;
  }

  getState(): RushHourState {
    return {
      isActive: this.active,
      remainingSeconds: Math.ceil(this.remainingMs / 1000),
      rewardMultiplier: this.getRewardMultiplier(),
      spawnIntervalMultiplier: this.getSpawnIntervalMultiplier(),
    };
  }
}

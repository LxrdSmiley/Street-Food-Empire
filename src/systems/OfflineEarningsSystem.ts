import { OFFLINE_EARNINGS_DEFAULTS } from '../config/constants';
import { clamp } from '../utils/math';
import type {
  OfflineEarningsConfig,
  OfflineEarningsInput,
  OfflineEarningsResult,
} from '../types/gameTypes';

const MS_PER_MINUTE = 60_000;

export class OfflineEarningsSystem {
  private readonly config: OfflineEarningsConfig;

  constructor(config: OfflineEarningsConfig = OFFLINE_EARNINGS_DEFAULTS) {
    this.config = config;
  }

  calculate(input: OfflineEarningsInput): OfflineEarningsResult {
    if (!this.hasValidTimestamps(input.lastSavedAt, input.now)) {
      return this.createNoRewardResult('Invalid timestamp.');
    }

    const rawMinutesAway = Math.floor((input.now - input.lastSavedAt) / MS_PER_MINUTE);

    if (rawMinutesAway < this.config.minimumOfflineMinutesToReward) {
      return {
        ...this.createNoRewardResult('Away time below reward threshold.'),
        minutesAway: Math.max(0, rawMinutesAway),
      };
    }

    const cappedMinutes = Math.min(rawMinutesAway, this.config.maxOfflineMinutes);
    const coinsPerMinute = this.getCoinsPerMinute(input);
    const coinsEarned = Math.round(cappedMinutes * coinsPerMinute);

    if (!Number.isFinite(coinsEarned) || coinsEarned <= 0) {
      return this.createNoRewardResult('No offline earnings available.');
    }

    const maxPossibleCoins = this.config.maxOfflineMinutes * this.config.maxCoinsPerMinute;
    const safeCoinsEarned = Math.round(clamp(coinsEarned, 0, maxPossibleCoins));

    return {
      shouldReward: safeCoinsEarned > 0,
      coinsEarned: safeCoinsEarned,
      minutesAway: rawMinutesAway,
      cappedMinutes,
      coinsPerMinute,
      wasCapped: rawMinutesAway > this.config.maxOfflineMinutes,
    };
  }

  private getCoinsPerMinute(input: OfflineEarningsInput): number {
    const stallBase = Math.max(1, input.stallLevel) * 3;
    const unlockedFoodBonus = Math.max(1, input.unlockedFoodCount) * 1.5;
    const foodValueBonus = Math.max(0, input.foodValueUpgradeLevel) * 1.25;
    const coinsPerMinute = stallBase + unlockedFoodBonus + foodValueBonus;

    return clamp(coinsPerMinute, 0, this.config.maxCoinsPerMinute);
  }

  private hasValidTimestamps(lastSavedAt: number, now: number): boolean {
    return Number.isFinite(lastSavedAt) && Number.isFinite(now) && lastSavedAt >= 0 && now >= lastSavedAt;
  }

  private createNoRewardResult(reason: string): OfflineEarningsResult {
    return {
      shouldReward: false,
      coinsEarned: 0,
      minutesAway: 0,
      cappedMinutes: 0,
      coinsPerMinute: 0,
      wasCapped: false,
      reason,
    };
  }
}

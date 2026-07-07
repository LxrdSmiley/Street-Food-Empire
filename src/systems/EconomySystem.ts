import { MAX_SAFE_COINS, STARTING_COINS } from '../config/constants';
import type { CustomerDefinition, FoodDefinition } from '../types/gameTypes';

export class EconomySystem {
  private coins: number;

  constructor(startingCoins = STARTING_COINS) {
    this.coins = this.normalizeCoins(startingCoins);
  }

  getCoins(): number {
    return this.coins;
  }

  awardCustomerOrder(
    food: FoodDefinition,
    customer: CustomerDefinition,
    rewardMultiplier = 1,
    rewardBonus = 0,
  ): number {
    const safeMultiplier = Number.isFinite(rewardMultiplier) && rewardMultiplier > 0 ? rewardMultiplier : 1;
    const safeBonus = Number.isFinite(rewardBonus) ? Math.max(0, rewardBonus) : 0;
    const coinsEarned = Math.max(0, Math.round((food.baseReward + safeBonus) * customer.tipMultiplier * safeMultiplier));
    this.coins = this.normalizeCoins(this.coins + coinsEarned);
    return coinsEarned;
  }

  canAfford(cost: number): boolean {
    return Number.isFinite(cost) && cost >= 0 && this.coins >= cost;
  }

  spendCoins(cost: number): boolean {
    const normalizedCost = Math.round(cost);

    if (!this.canAfford(normalizedCost)) {
      return false;
    }

    this.coins = this.normalizeCoins(this.coins - normalizedCost);
    return true;
  }

  awardCoins(amount: number): number {
    const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
    this.coins = this.normalizeCoins(this.coins + safeAmount);
    return safeAmount;
  }

  private normalizeCoins(coins: number): number {
    if (!Number.isFinite(coins)) {
      return STARTING_COINS;
    }

    return Math.min(Math.max(Math.round(coins), STARTING_COINS), MAX_SAFE_COINS);
  }
}

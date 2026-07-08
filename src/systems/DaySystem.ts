import type { DayState, DaySummary } from '../types/gameTypes';

const DAY_TARGET_CUSTOMERS = 6;

export class DaySystem {
  private state: DayState = this.createInactiveState();

  startDay(): DayState {
    this.state = {
      isActive: true,
      targetCustomers: DAY_TARGET_CUSTOMERS,
      customersServed: 0,
      customersMissed: 0,
      coinsEarned: 0,
      tipsEarned: 0,
      satisfaction: 100,
      bestStreak: 0,
    };

    return this.getState();
  }

  recordServed(coinsEarned: number, tipsEarned: number, satisfaction: number, bestStreak: number): DaySummary | null {
    if (!this.state.isActive) {
      return null;
    }

    this.state.customersServed += 1;
    this.state.coinsEarned += Math.max(0, Math.round(coinsEarned));
    this.state.tipsEarned += Math.max(0, Math.round(tipsEarned));
    this.state.satisfaction = Math.round(satisfaction);
    this.state.bestStreak = Math.max(this.state.bestStreak, bestStreak);
    return this.finishIfComplete();
  }

  recordMissed(satisfaction: number, bestStreak: number): DaySummary | null {
    if (!this.state.isActive) {
      return null;
    }

    this.state.customersMissed += 1;
    this.state.satisfaction = Math.round(satisfaction);
    this.state.bestStreak = Math.max(this.state.bestStreak, bestStreak);
    return this.finishIfComplete();
  }

  getState(): DayState {
    return { ...this.state };
  }

  private finishIfComplete(): DaySummary | null {
    const handledCustomers = this.state.customersServed + this.state.customersMissed;

    if (handledCustomers < this.state.targetCustomers) {
      return null;
    }

    this.state.isActive = false;
    return this.createSummary();
  }

  private createSummary(): DaySummary {
    const satisfaction = Math.round(this.state.satisfaction);
    const resultText = satisfaction >= 85 ? 'Great Day' : satisfaction >= 65 ? 'Good Day' : 'Rough Day';

    return {
      customersServed: this.state.customersServed,
      customersMissed: this.state.customersMissed,
      coinsEarned: this.state.coinsEarned,
      tipsEarned: this.state.tipsEarned,
      satisfaction,
      bestStreak: this.state.bestStreak,
      resultText,
    };
  }

  private createInactiveState(): DayState {
    return {
      isActive: false,
      targetCustomers: DAY_TARGET_CUSTOMERS,
      customersServed: 0,
      customersMissed: 0,
      coinsEarned: 0,
      tipsEarned: 0,
      satisfaction: 100,
      bestStreak: 0,
    };
  }
}

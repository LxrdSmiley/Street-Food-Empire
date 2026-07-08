export class StreakSystem {
  private currentStreak = 0;
  private bestStreak = 0;

  startDay(): void {
    this.currentStreak = 0;
    this.bestStreak = 0;
  }

  recordCorrectOrder(): number {
    this.currentStreak += 1;
    this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
    return this.currentStreak;
  }

  reset(): void {
    this.currentStreak = 0;
  }

  getCurrentStreak(): number {
    return this.currentStreak;
  }

  getBestStreak(): number {
    return this.bestStreak;
  }

  getTipMultiplier(): number {
    return 1 + Math.min(this.currentStreak, 5) * 0.08;
  }
}

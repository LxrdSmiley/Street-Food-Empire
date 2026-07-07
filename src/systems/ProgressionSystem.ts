import {
  MAX_STALL_LEVEL,
  STALL_LEVEL_XP_REQUIREMENTS,
  STARTING_STALL_LEVEL,
  STARTING_STALL_XP,
} from '../config/constants';
import { clamp } from '../utils/math';
import type { ProgressionResult, ProgressionState } from '../types/gameTypes';

export class ProgressionSystem {
  private stallLevel: number;
  private stallXp: number;

  constructor(stallLevel = STARTING_STALL_LEVEL, stallXp = STARTING_STALL_XP) {
    this.stallLevel = Math.round(clamp(stallLevel, STARTING_STALL_LEVEL, MAX_STALL_LEVEL));
    this.stallXp = this.normalizeXp(stallXp);
    this.applyEarnedLevels();
  }

  awardServiceProgress(baseXp: number): ProgressionResult {
    const previousLevel = this.stallLevel;
    const xpEarned = Math.max(1, Math.round(baseXp));
    this.stallXp = this.normalizeXp(this.stallXp + xpEarned);
    this.applyEarnedLevels();

    return {
      xpEarned,
      didLevelUp: this.stallLevel > previousLevel,
      previousLevel,
      currentLevel: this.stallLevel,
    };
  }

  getStallLevel(): number {
    return this.stallLevel;
  }

  getStallXp(): number {
    return this.stallXp;
  }

  getState(): ProgressionState {
    const nextLevelXp = this.getNextLevelRequirement();

    return {
      stallLevel: this.stallLevel,
      stallXp: this.stallXp,
      nextLevelXp,
      progressToNextLevel: nextLevelXp === null ? 1 : clamp(this.stallXp / nextLevelXp, 0, 1),
      isMaxLevel: nextLevelXp === null,
    };
  }

  private applyEarnedLevels(): void {
    let nextLevelXp = this.getNextLevelRequirement();

    while (nextLevelXp !== null && this.stallXp >= nextLevelXp) {
      this.stallXp -= nextLevelXp;
      this.stallLevel += 1;
      nextLevelXp = this.getNextLevelRequirement();
    }

    if (this.getNextLevelRequirement() === null) {
      this.stallXp = 0;
    }
  }

  private getNextLevelRequirement(): number | null {
    return STALL_LEVEL_XP_REQUIREMENTS[this.stallLevel] ?? null;
  }

  private normalizeXp(stallXp: number): number {
    return Number.isFinite(stallXp) ? Math.max(STARTING_STALL_XP, Math.round(stallXp)) : STARTING_STALL_XP;
  }
}

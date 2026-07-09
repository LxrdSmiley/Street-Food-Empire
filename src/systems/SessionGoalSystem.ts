import type { SessionGoal, SessionGoalRewards, SessionGoalType, UpgradeState } from '../types/gameTypes';

interface GoalTemplate {
  type: SessionGoalType;
  label: (target: number) => string;
  getTarget: (stallLevel: number) => number;
  rewardCoins: number;
  rewardXp: number;
  minStallLevel: number;
}

const GOAL_TEMPLATES: readonly GoalTemplate[] = [
  {
    type: 'serve_correct',
    label: (t) => `Serve ${t} correct orders`,
    getTarget: (sl) => (sl >= 3 ? 5 : 3),
    rewardCoins: 10,
    rewardXp: 3,
    minStallLevel: 1,
  },
  {
    type: 'earn_coins',
    label: (t) => `Earn ${t} coins today`,
    getTarget: (sl) => (sl >= 3 ? 45 : 25),
    rewardCoins: 15,
    rewardXp: 5,
    minStallLevel: 1,
  },
  {
    type: 'reach_streak',
    label: (t) => `Reach a streak of ${t}`,
    getTarget: (sl) => (sl >= 3 ? 3 : 2),
    rewardCoins: 12,
    rewardXp: 4,
    minStallLevel: 1,
  },
  {
    type: 'end_satisfaction',
    label: (t) => `Finish with ${t}+ satisfaction`,
    getTarget: (sl) => (sl >= 3 ? 70 : 60),
    rewardCoins: 12,
    rewardXp: 4,
    minStallLevel: 1,
  },
  {
    type: 'avoid_wrong_orders',
    label: (t) => (t === 0 ? 'Complete day with no wrong orders' : `No more than ${t} wrong orders`),
    getTarget: (sl) => (sl >= 3 ? 0 : 1),
    rewardCoins: 20,
    rewardXp: 6,
    minStallLevel: 1,
  },
  {
    type: 'serve_two_item_orders',
    label: (t) => `Serve ${t} two-item order${t > 1 ? 's' : ''}`,
    getTarget: (sl) => (sl >= 4 ? 2 : 1),
    rewardCoins: 15,
    rewardXp: 5,
    minStallLevel: 2,
  },
];

export class SessionGoalSystem {
  private goals: SessionGoal[] = [];
  private wrongOrders = 0;
  private claimed = false;

  generateGoals(stallLevel: number): readonly SessionGoal[] {
    this.claimed = false;
    this.wrongOrders = 0;

    const available = GOAL_TEMPLATES.filter((t) => stallLevel >= t.minStallLevel);
    const selected = this.pickDistinct(available, 3);

    this.goals = selected.map((template, index) => {
      const target = template.getTarget(stallLevel);
      return {
        id: `goal_${index}_${template.type}`,
        type: template.type,
        label: template.label(target),
        target,
        progress: template.type === 'avoid_wrong_orders' ? target : 0,
        completed: false,
        rewardCoins: template.rewardCoins,
        rewardXp: template.rewardXp,
      };
    });

    return this.getGoals();
  }

  getGoals(): readonly SessionGoal[] {
    return [...this.goals];
  }

  hasGoals(): boolean {
    return this.goals.length > 0;
  }

  /** Called when the player correctly serves a customer. */
  onCorrectServe(isTwoItem: boolean): SessionGoalType | null {
    let newlyCompleted: SessionGoalType | null = null;

    for (const goal of this.goals) {
      if (goal.completed) continue;

      if (goal.type === 'serve_correct') {
        goal.progress = Math.min(goal.progress + 1, goal.target);
        if (goal.progress >= goal.target && !goal.completed) {
          goal.completed = true;
          newlyCompleted = goal.type;
        }
      }

      if (goal.type === 'serve_two_item_orders' && isTwoItem) {
        goal.progress = Math.min(goal.progress + 1, goal.target);
        if (goal.progress >= goal.target && !goal.completed) {
          goal.completed = true;
          newlyCompleted = goal.type;
        }
      }
    }

    return newlyCompleted;
  }

  /** Called when the player serves the wrong order (not burnt cleanup, not customer leaving). */
  onWrongOrder(): SessionGoalType | null {
    this.wrongOrders += 1;
    let newlyFailed: SessionGoalType | null = null;

    for (const goal of this.goals) {
      if (goal.type === 'avoid_wrong_orders' && !goal.completed) {
        goal.progress = Math.max(goal.target - this.wrongOrders, 0);
        if (this.wrongOrders > goal.target) {
          // Goal is now impossible — mark progress as failed visually
          newlyFailed = goal.type;
        }
      }
    }

    return newlyFailed;
  }

  /** Called when active-day coins are earned (base coins + tips from correct serves). */
  onCoinsEarned(amount: number): SessionGoalType | null {
    let newlyCompleted: SessionGoalType | null = null;

    for (const goal of this.goals) {
      if (goal.completed) continue;

      if (goal.type === 'earn_coins') {
        goal.progress = Math.min(goal.progress + amount, goal.target);
        if (goal.progress >= goal.target) {
          goal.completed = true;
          newlyCompleted = goal.type;
        }
      }
    }

    return newlyCompleted;
  }

  /** Called when streak changes. */
  onStreakChange(streak: number): SessionGoalType | null {
    let newlyCompleted: SessionGoalType | null = null;

    for (const goal of this.goals) {
      if (goal.completed) continue;

      if (goal.type === 'reach_streak') {
        goal.progress = Math.max(goal.progress, streak);
        if (goal.progress >= goal.target) {
          goal.completed = true;
          newlyCompleted = goal.type;
        }
      }
    }

    return newlyCompleted;
  }

  /** Called at day end to evaluate satisfaction-based goals. */
  onDayEnd(satisfaction: number): void {
    for (const goal of this.goals) {
      if (goal.completed) continue;

      if (goal.type === 'end_satisfaction') {
        goal.progress = Math.round(satisfaction);
        if (goal.progress >= goal.target) {
          goal.completed = true;
        }
      }

      if (goal.type === 'avoid_wrong_orders' && this.wrongOrders <= goal.target) {
        goal.completed = true;
      }
    }
  }

  /** Claims rewards exactly once. Returns total bonus coins and XP. */
  claimRewards(): SessionGoalRewards {
    if (this.claimed) {
      return { totalCoins: 0, totalXp: 0, completedCount: 0, goals: this.getGoals() };
    }

    this.claimed = true;
    let totalCoins = 0;
    let totalXp = 0;
    let completedCount = 0;

    for (const goal of this.goals) {
      if (goal.completed) {
        totalCoins += goal.rewardCoins;
        totalXp += goal.rewardXp;
        completedCount += 1;
      }
    }

    return { totalCoins, totalXp, completedCount, goals: this.getGoals() };
  }

  /** Returns a motivational next target string based on current game state. */
  getNextTarget(
    stallLevel: number,
    currentCoins: number,
    nextLevelXp: number | null,
    stallXp: number,
    upgradeStates: readonly UpgradeState[],
  ): string {
    // Check if there is an affordable upgrade coming soon
    const cheapestAffordable = upgradeStates
      .filter((u) => u.isUnlocked && !u.isMaxed && u.cost !== null)
      .sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0))[0];

    if (cheapestAffordable && cheapestAffordable.cost !== null && cheapestAffordable.cost > currentCoins) {
      const needed = cheapestAffordable.cost - currentCoins;
      return `Earn ${needed} more coins for ${cheapestAffordable.definition.name}`;
    }

    // Check XP progress toward next stall level
    if (nextLevelXp !== null) {
      const remaining = nextLevelXp - stallXp;
      const stageNames = ['Tiny Cart', 'Better Setup', 'Menu Sign', 'Fairy Lights', 'Kingston Booth'];
      const nextStageName = stageNames[Math.min(stallLevel, 4)];
      return `Earn ${remaining} XP to reach Stage ${stallLevel + 1}: ${nextStageName}`;
    }

    // Max level — encourage perfect play
    return 'Complete all 3 goals in a single day';
  }

  private pickDistinct(templates: readonly GoalTemplate[], count: number): GoalTemplate[] {
    const shuffled = [...templates];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
}

import type { TutorialAction, TutorialStep } from '../types/gameTypes';

const STEP_MESSAGES: Record<TutorialStep, string> = {
  welcome: 'Welcome to Kingston Night Market! Serve customers fast to earn coins. Tap Next to continue.',
  start_day: 'Tap Start Day to begin your shift.',
  read_order: "Read the customer's order bubble to see what they want. Tap Next to continue.",
  tap_food_slot: 'Tap an empty grill slot to start cooking Jerk Chicken.',
  wait_for_ready: 'Wait until the food turns ready (it will steam).',
  select_ready_food: 'Tap the ready food to select it.',
  serve_customer: 'Tap the customer to serve the order.',
  open_goals: 'Tap Goals to see bonus rewards for today.',
  finish_day: 'Keep serving customers until the day ends! Tap Next to continue.',
  open_upgrades: 'After the shift, tap Upgrades to open the upgrades window.',
  understand_upgrades: 'Here you can upgrade your equipment. Tap Close Upgrades to complete the tutorial.',
  completed: '',
};

export class TutorialSystem {
  private currentStep: TutorialStep = 'welcome';
  private active = false;

  constructor(tutorialCompleted: boolean) {
    this.active = !tutorialCompleted;
    this.currentStep = tutorialCompleted ? 'completed' : 'welcome';
  }

  isActive(): boolean {
    return this.active;
  }

  getCurrentStep(): TutorialStep {
    return this.currentStep;
  }

  getCurrentMessage(): string {
    return STEP_MESSAGES[this.currentStep] ?? '';
  }

  advance(action: TutorialAction): boolean {
    if (!this.active) {
      return false;
    }

    const previousStep = this.currentStep;

    switch (this.currentStep) {
      case 'welcome':
        if (action === 'next') {
          this.currentStep = 'start_day';
        }
        break;
      case 'start_day':
        if (action === 'start_day_clicked') {
          this.currentStep = 'read_order';
        }
        break;
      case 'read_order':
        if (action === 'next') {
          this.currentStep = 'tap_food_slot';
        }
        break;
      case 'tap_food_slot':
        if (action === 'food_slot_tapped') {
          this.currentStep = 'wait_for_ready';
        }
        break;
      case 'wait_for_ready':
        if (action === 'food_ready') {
          this.currentStep = 'select_ready_food';
        }
        break;
      case 'select_ready_food':
        if (action === 'food_selected') {
          this.currentStep = 'serve_customer';
        }
        break;
      case 'serve_customer':
        if (action === 'customer_served') {
          this.currentStep = 'open_goals';
        }
        break;
      case 'open_goals':
        if (action === 'goals_opened') {
          this.currentStep = 'finish_day';
        }
        break;
      case 'finish_day':
        if (action === 'next') {
          // Play the rest of the day normally
          this.currentStep = 'open_upgrades';
        }
        break;
      case 'open_upgrades':
        if (action === 'upgrades_opened') {
          this.currentStep = 'understand_upgrades';
        }
        break;
      case 'understand_upgrades':
        if (action === 'next') {
          this.complete();
        }
        break;
    }

    return this.currentStep !== previousStep;
  }

  skip(): void {
    this.complete();
  }

  complete(): void {
    this.currentStep = 'completed';
    this.active = false;
  }

  isCompleted(): boolean {
    return this.currentStep === 'completed';
  }
}

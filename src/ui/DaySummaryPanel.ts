import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';
import { FeedbackEffects } from './FeedbackEffects';
import { formatCoins } from '../utils/format';
import type { DaySummary, SessionGoal } from '../types/gameTypes';

export class DaySummaryPanel extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    summary: DaySummary,
    stallLevel: number,
    goals: readonly SessionGoal[],
    bonusCoins: number,
    bonusXp: number,
    nextTarget: string,
    onClose: () => void,
  ) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2);

    const dim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65);
    dim.setInteractive();

    // Taller panel to fit goals
    const panelH = 620 + goals.length * 34;
    const panelG = scene.add.graphics();
    panelG.fillStyle(COLORS.hudPanel, 0.98);
    panelG.lineStyle(4.5, COLORS.hudStroke, 1);
    panelG.fillRoundedRect(-280, -panelH / 2, 560, panelH, 16);
    panelG.strokeRoundedRect(-280, -panelH / 2, 560, panelH, 16);

    const topY = -panelH / 2 + 44;

    const title = scene.add
      .text(0, topY, summary.resultText, {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '38px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    title.setStroke('#11131a', 4);

    const shiftMessage = scene.add
      .text(0, topY + 38, this.getShiftMessage(summary.satisfaction, goals.filter((g) => g.completed).length, goals.length), {
        align: 'center',
        color: '#7bd88f',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        wordWrap: { width: 480 },
      })
      .setOrigin(0.5);
    shiftMessage.setStroke('#11131a', 3);

    // Grade badge
    const grade = this.calculateGrade(summary.satisfaction);
    const gradeColor = this.getGradeColor(grade);
    const badge = scene.add.container(190, topY);
    const badgeBg = scene.add.circle(0, 0, 32, gradeColor, 1).setStrokeStyle(3, 0xffffff);
    const badgeText = scene.add.text(0, 0, grade, {
      color: '#11131a',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    badge.add([badgeBg, badgeText]);

    // Stats
    const stageNames = [
      'Tiny Push Cart (Stage 1)',
      'Better Grill Setup (Stage 2)',
      'Menu Board & Sign (Stage 3)',
      'Fairy Lights & Counter (Stage 4)',
      'Full Kingston Booth (Stage 5)',
    ];
    const stageName = stageNames[Phaser.Math.Clamp(stallLevel - 1, 0, 4)];

    const rows = [
      `Served: ${summary.customersServed}  |  Missed: ${summary.customersMissed}`,
      `Coins: ${formatCoins(summary.coinsEarned)}  |  Tips: ${formatCoins(summary.tipsEarned)}`,
      `Total Earned: ${formatCoins(summary.coinsEarned + bonusCoins)} coins  |  ${bonusXp} XP bonus`,
      `Satisfaction: ${Math.round(summary.satisfaction)}%  |  Streak: ${summary.bestStreak}`,
    ];

    const bodyText = scene.add
      .text(0, topY + 76, rows.join('\n'), {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        lineSpacing: 10,
      })
      .setOrigin(0.5, 0);

    // Goals Section
    const goalsHeaderY = topY + 194;
    const completedCount = goals.filter((g) => g.completed).length;
    const goalsHeader = scene.add.text(0, goalsHeaderY, `Goals Completed: ${completedCount}/${goals.length}`, {
      color: completedCount === goals.length ? '#7bd88f' : '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    goalsHeader.setStroke('#11131a', 3);

    this.add([dim, title, shiftMessage, badge, bodyText, goalsHeader]);
    this.addAt(panelG, 1);

    // Goal rows
    goals.forEach((goal, index) => {
      const gy = goalsHeaderY + 40 + index * 34;
      const icon = goal.completed ? '✓' : '○';
      const color = goal.completed ? '#7bd88f' : '#94a3b8';
      const rewardText = goal.completed ? `  +${goal.rewardCoins}c +${goal.rewardXp}xp` : '';

      const row = scene.add.text(0, gy, `${icon} ${goal.label}${rewardText}`, {
        color,
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontStyle: goal.completed ? 'bold' : 'normal',
      }).setOrigin(0.5);
      this.add(row);
    });

    // Bonus total
    const bonusY = goalsHeaderY + 40 + goals.length * 34 + 10;
    if (bonusCoins > 0 || bonusXp > 0) {
      const bonusText = scene.add.text(0, bonusY, `Goal Bonus: +${bonusCoins} coins  +${bonusXp} XP`, {
        color: '#7bd88f',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      bonusText.setStroke('#11131a', 3);
      this.add(bonusText);
      FeedbackEffects.pulse(scene, bonusText, 1.08, 180);
    }

    // Stall stage
    const stageY = bonusY + 34;
    const stageLabel = scene.add.text(0, stageY, `Current Stall: ${stageName}`, {
      color: '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    stageLabel.setStroke('#11131a', 3);
    this.add(stageLabel);

    // Next Target
    const nextY = stageY + 30;
    if (nextTarget) {
      const nextLabel = scene.add.text(0, nextY, `Next Target: ${nextTarget}`, {
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        wordWrap: { width: 480 },
        align: 'center',
      }).setOrigin(0.5);
      nextLabel.setStroke('#11131a', 3);
      this.add(nextLabel);
      FeedbackEffects.pulse(scene, nextLabel, 1.05, 180);
    }

    // Continue button
    const buttonY = nextY + 46;
    const buttonG = scene.add.graphics();
    buttonG.fillStyle(COLORS.success, 1);
    buttonG.lineStyle(3, 0xffffff, 0.7);
    buttonG.fillRoundedRect(-140, buttonY - 26, 280, 52, 12);
    buttonG.strokeRoundedRect(-140, buttonY - 26, 280, 52, 12);

    const buttonText = scene.add
      .text(0, buttonY, 'Continue', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const hitZone = scene.add.zone(0, buttonY, 300, 64).setInteractive({ useHandCursor: true });
    hitZone.on(Phaser.Input.Events.POINTER_DOWN, onClose);

    this.add([buttonG, buttonText, hitZone]);

    this.setDepth(2000);
    scene.add.existing(this);
    FeedbackEffects.pulse(scene, [title, badge], 1.08, 180);
  }

  private calculateGrade(satisfaction: number): string {
    if (satisfaction >= 95) return 'A+';
    if (satisfaction >= 85) return 'A';
    if (satisfaction >= 70) return 'B';
    if (satisfaction >= 50) return 'C';
    return 'F';
  }

  private getGradeColor(grade: string): number {
    if (grade.startsWith('A')) return 0x7bd88f;
    if (grade === 'B') return 0xffd166;
    if (grade === 'C') return 0xf39c12;
    return 0xe85d5d;
  }

  private getShiftMessage(satisfaction: number, completedGoals: number, totalGoals: number): string {
    if (satisfaction >= 90 && completedGoals === totalGoals) {
      return 'Great Shift! Clean serves and goals handled.';
    }

    if (satisfaction >= 75) {
      return completedGoals > 0 ? 'Good Shift! Bonus rewards are ready.' : 'Good Shift! Keep chasing those goals.';
    }

    return 'Rough Shift. Tighten timing and protect satisfaction.';
  }
}

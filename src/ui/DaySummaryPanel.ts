import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants';
import { formatCoins } from '../utils/format';
import type { DaySummary } from '../types/gameTypes';

export class DaySummaryPanel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, summary: DaySummary, stallLevel: number, onClose: () => void) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2);

    const dim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65);
    dim.setInteractive();

    // Panel frame using Graphics rounded rect
    const panelG = scene.add.graphics();
    panelG.fillStyle(COLORS.hudPanel, 0.98);
    panelG.lineStyle(4.5, COLORS.hudStroke, 1);
    panelG.fillRoundedRect(-270, -270, 540, 540, 16);
    panelG.strokeRoundedRect(-270, -270, 540, 540, 16);

    const title = scene.add
      .text(0, -220, summary.resultText, {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '40px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    title.setStroke('#11131a', 4);

    const subtitle = scene.add
      .text(0, -170, 'Shift Summary', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    // Letter Grade Badge based on satisfaction
    const grade = this.calculateGrade(summary.satisfaction);
    const gradeColor = this.getGradeColor(grade);
    
    // Grade Badge Container
    const badge = scene.add.container(180, -165);
    const badgeBg = scene.add.circle(0, 0, 36, gradeColor, 1).setStrokeStyle(3, 0xffffff);
    const badgeText = scene.add.text(0, 0, grade, {
      color: '#11131a',
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    badge.add([badgeBg, badgeText]);

    const stageNames = [
      'Tiny Push Cart (Stage 1)',
      'Better Grill Setup (Stage 2)',
      'Menu Board & Sign (Stage 3)',
      'Fairy Lights & Counter (Stage 4)',
      'Full Kingston Booth (Stage 5)'
    ];
    const stageName = stageNames[Phaser.Math.Clamp(stallLevel - 1, 0, 4)];

    const rows = [
      `Served: ${summary.customersServed}`,
      `Missed: ${summary.customersMissed}`,
      `Coins: ${formatCoins(summary.coinsEarned)}`,
      `Tips: ${formatCoins(summary.tipsEarned)}`,
      `Satisfaction: ${Math.round(summary.satisfaction)}%`,
      `Best Streak: ${summary.bestStreak}`,
    ];

    const bodyText = scene.add
      .text(-180, -96, rows.join('\n'), {
        align: 'left',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        lineSpacing: 12,
      })
      .setOrigin(0, 0);

    const stageLabel = scene.add.text(0, 142, `Current Stall: ${stageName}`, {
      color: '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    stageLabel.setStroke('#11131a', 3);

    // Rounded Continue Button
    const buttonG = scene.add.graphics();
    buttonG.fillStyle(COLORS.success, 1);
    buttonG.lineStyle(3, 0xffffff, 0.7);
    buttonG.fillRoundedRect(-150, 180, 300, 56, 12);
    buttonG.strokeRoundedRect(-150, 180, 300, 56, 12);

    const buttonText = scene.add
      .text(0, 208, 'Continue', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    
    const hitZone = scene.add.zone(0, 208, 300, 64).setInteractive({ useHandCursor: true });
    hitZone.on(Phaser.Input.Events.POINTER_DOWN, onClose);

    this.add([dim, title, subtitle, badge, bodyText, stageLabel, buttonText, hitZone]);
    // Ensure graphics elements are at the back of the children but above dim
    this.sendToBack(title);
    this.addAt(panelG, 1);
    this.addAt(buttonG, 2);

    this.setDepth(2000);
    scene.add.existing(this);
  }

  private calculateGrade(satisfaction: number): string {
    if (satisfaction >= 95) return 'A+';
    if (satisfaction >= 85) return 'A';
    if (satisfaction >= 70) return 'B';
    if (satisfaction >= 50) return 'C';
    return 'F';
  }

  private getGradeColor(grade: string): number {
    if (grade.startsWith('A')) return 0x7bd88f; // success green
    if (grade === 'B') return 0xffd166;         // yellow/warning
    if (grade === 'C') return 0xf39c12;         // orange
    return 0xe85d5d;                            // danger red
  }
}

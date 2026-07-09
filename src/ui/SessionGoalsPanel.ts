import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../config/constants';
import type { SessionGoal } from '../types/gameTypes';

export class SessionGoalsPanel extends Phaser.GameObjects.Container {
  private readonly panelElements: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, goals: readonly SessionGoal[], onClose: () => void) {
    super(scene, 0, 0);

    // Scrim
    const scrim = scene.add.rectangle(GAME_WIDTH / 2, 640, GAME_WIDTH, 1280, 0x000000, 0.5);
    scrim.setInteractive();
    scrim.on(Phaser.Input.Events.POINTER_DOWN, onClose);

    // Panel background
    const panelG = scene.add.graphics();
    panelG.fillStyle(COLORS.hudPanel, 0.97);
    panelG.lineStyle(3.5, COLORS.hudStroke, 1);
    panelG.fillRoundedRect(30, 290, GAME_WIDTH - 60, 320, 14);
    panelG.strokeRoundedRect(30, 290, GAME_WIDTH - 60, 320, 14);

    // Title
    const title = scene.add.text(GAME_WIDTH / 2, 326, "Today's Goals", {
      align: 'center',
      color: '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    title.setStroke('#11131e', 4);

    this.add([scrim, panelG, title]);

    // Goal rows
    goals.forEach((goal, index) => {
      const rowY = 380 + index * 66;
      const rowObjects = this.createGoalRow(scene, goal, rowY);
      this.add(rowObjects);
      this.panelElements.push(...rowObjects);
    });

    // Close button
    const closeG = scene.add.graphics();
    closeG.fillStyle(0x2d313e, 1);
    closeG.lineStyle(2, COLORS.hudStroke, 0.8);
    closeG.fillRoundedRect(GAME_WIDTH / 2 - 80, 570, 160, 44, 10);
    closeG.strokeRoundedRect(GAME_WIDTH / 2 - 80, 570, 160, 44, 10);

    const closeText = scene.add.text(GAME_WIDTH / 2, 592, 'Close', {
      align: 'center',
      color: '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const closeZone = scene.add.zone(GAME_WIDTH / 2, 592, 180, 60).setInteractive({ useHandCursor: true });
    closeZone.on(Phaser.Input.Events.POINTER_DOWN, onClose);

    this.add([closeG, closeText, closeZone]);
    this.setDepth(1500);
    scene.add.existing(this);
  }

  updateGoals(goals: readonly SessionGoal[]): void {
    // Remove old row elements
    this.panelElements.forEach((el) => el.destroy());
    this.panelElements.length = 0;

    goals.forEach((goal, index) => {
      const rowY = 380 + index * 66;
      const rowObjects = this.createGoalRow(this.scene, goal, rowY);
      this.add(rowObjects);
      this.panelElements.push(...rowObjects);
    });
  }

  private createGoalRow(scene: Phaser.Scene, goal: SessionGoal, y: number): Phaser.GameObjects.GameObject[] {
    const objects: Phaser.GameObjects.GameObject[] = [];

    // Row background
    const rowBg = scene.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 90, 52, 0x1d1e26, 0.8);
    rowBg.setStrokeStyle(1.5, 0x2e303d);
    objects.push(rowBg);

    // Status icon
    const iconColor = goal.completed ? 0x7bd88f : 0x475569;
    const iconText = goal.completed ? '✓' : `${goal.progress}/${goal.target}`;
    const icon = scene.add.text(68, y, iconText, {
      color: goal.completed ? '#7bd88f' : '#ffd166',
      fontFamily: 'Arial, sans-serif',
      fontSize: goal.completed ? '24px' : '18px',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    objects.push(icon);

    // Label
    const label = scene.add.text(140, y - 8, goal.label, {
      color: goal.completed ? '#7bd88f' : '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    objects.push(label);

    // Reward text
    const rewardStr = `+${goal.rewardCoins}c  +${goal.rewardXp}xp`;
    const reward = scene.add.text(140, y + 14, rewardStr, {
      color: goal.completed ? '#5daa6e' : '#94a3b8',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    }).setOrigin(0, 0.5);
    objects.push(reward);

    // Completion badge
    if (goal.completed) {
      const badge = scene.add.circle(GAME_WIDTH - 80, y, 14, 0x7bd88f, 1);
      badge.setStrokeStyle(2, 0xffffff);
      const check = scene.add.text(GAME_WIDTH - 80, y, '✓', {
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      objects.push(badge, check);
    }

    return objects;
  }
}

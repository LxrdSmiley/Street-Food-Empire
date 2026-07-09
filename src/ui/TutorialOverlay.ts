import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../config/constants';
import type { TutorialStep } from '../types/gameTypes';

interface CalloutTarget {
  x: number;
  y: number;
  arrowDir: 'up' | 'down' | 'none';
}

const TARGETS: Record<TutorialStep, CalloutTarget> = {
  welcome: { x: GAME_WIDTH / 2, y: 560, arrowDir: 'none' },
  start_day: { x: 584, y: 96, arrowDir: 'up' },
  read_order: { x: GAME_WIDTH / 2, y: 430, arrowDir: 'up' },
  tap_food_slot: { x: 250, y: 903, arrowDir: 'down' },
  wait_for_ready: { x: 250, y: 903, arrowDir: 'down' },
  select_ready_food: { x: 250, y: 903, arrowDir: 'down' },
  serve_customer: { x: GAME_WIDTH / 2, y: 520, arrowDir: 'up' },
  open_goals: { x: 556, y: 214, arrowDir: 'up' },
  finish_day: { x: GAME_WIDTH / 2, y: 560, arrowDir: 'none' },
  open_upgrades: { x: 180, y: 214, arrowDir: 'up' },
  understand_upgrades: { x: 360, y: 800, arrowDir: 'down' },
  completed: { x: GAME_WIDTH / 2, y: 560, arrowDir: 'none' },
};

export class TutorialOverlay extends Phaser.GameObjects.Container {
  private readonly calloutBg: Phaser.GameObjects.Graphics;
  private readonly calloutText: Phaser.GameObjects.Text;
  private readonly arrowG: Phaser.GameObjects.Graphics;
  private readonly nextButton: Phaser.GameObjects.Graphics;
  private readonly nextText: Phaser.GameObjects.Text;
  private readonly nextZone: Phaser.GameObjects.Zone;
  private readonly skipButton: Phaser.GameObjects.Graphics;
  private readonly skipText: Phaser.GameObjects.Text;
  private readonly skipZone: Phaser.GameObjects.Zone;

  constructor(
    scene: Phaser.Scene,
    step: TutorialStep,
    message: string,
    onNext: () => void,
    onSkip: () => void,
  ) {
    super(scene, 0, 0);

    // Callout text and panel background
    this.calloutBg = scene.add.graphics();
    this.calloutText = scene.add.text(0, 0, '', {
      align: 'center',
      color: '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      wordWrap: { width: 500 },
    }).setOrigin(0.5);
    this.calloutText.setStroke('#11131a', 4);

    // Arrow graphics
    this.arrowG = scene.add.graphics();

    // Next button
    this.nextButton = scene.add.graphics();
    this.nextText = scene.add.text(0, 0, 'Next', {
      color: '#112015',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.nextZone = scene.add.zone(0, 0, 110, 48).setInteractive({ useHandCursor: true });
    this.nextZone.on(Phaser.Input.Events.POINTER_DOWN, onNext);

    // Skip button
    this.skipButton = scene.add.graphics();
    this.skipText = scene.add.text(0, 0, 'Skip Tutorial', {
      color: '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.skipText.setStroke('#11131a', 3);
    this.skipZone = scene.add.zone(0, 0, 130, 40).setInteractive({ useHandCursor: true });
    this.skipZone.on(Phaser.Input.Events.POINTER_DOWN, onSkip);

    this.add([
      this.calloutBg,
      this.calloutText,
      this.arrowG,
      this.nextButton,
      this.nextText,
      this.nextZone,
      this.skipButton,
      this.skipText,
      this.skipZone,
    ]);

    this.setDepth(3000); // Higher than standard UI elements
    scene.add.existing(this);

    this.showStep(step, message);
  }

  showStep(step: TutorialStep, message: string): void {
    if (step === 'completed') {
      this.setVisible(false);
      return;
    }

    this.setVisible(true);
    const target = TARGETS[step];
    
    // Choose appropriate callout panel position to not block the target area
    let panelY = 680;
    if (target.arrowDir === 'up') {
      // Target is in top half (HUD or customer), place panel lower down
      panelY = 360;
      if (step === 'start_day' || step === 'open_goals') {
        panelY = 350;
      }
    } else if (target.arrowDir === 'down') {
      // Target is in bottom half (grill or upgrades), place panel higher up
      panelY = 660;
    } else {
      // No arrow (welcome, day complete), place centered
      panelY = 560;
    }

    // Update message text
    this.calloutText.setText(message);
    this.calloutText.setPosition(GAME_WIDTH / 2, panelY);

    // Check if step requires "Next" button click to advance
    const showNext = step === 'welcome' || step === 'read_order' || step === 'understand_upgrades';
    
    // Draw callout panel background
    const textHeight = this.calloutText.height;
    const panelWidth = 540;
    const panelHeight = textHeight + (showNext ? 90 : 44);
    
    this.calloutBg.clear();
    this.calloutBg.fillStyle(COLORS.hudPanel, 0.96);
    this.calloutBg.lineStyle(3, COLORS.hudStroke, 1);
    this.calloutBg.fillRoundedRect(GAME_WIDTH / 2 - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 14);
    this.calloutBg.strokeRoundedRect(GAME_WIDTH / 2 - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 14);

    // Draw Skip Tutorial button (top-right of screen)
    const skipX = GAME_WIDTH - 90;
    const skipY = 300;
    this.skipButton.clear();
    this.skipButton.fillStyle(0xe85d5d, 0.9);
    this.skipButton.lineStyle(2, 0xffffff, 0.7);
    this.skipButton.fillRoundedRect(skipX - 60, skipY - 18, 120, 36, 8);
    this.skipButton.strokeRoundedRect(skipX - 60, skipY - 18, 120, 36, 8);
    this.skipText.setPosition(skipX, skipY);
    this.skipZone.setPosition(skipX, skipY);

    // Draw Next button inside the panel if required
    if (showNext) {
      const nextX = GAME_WIDTH / 2;
      const nextY = panelY + panelHeight / 2 - 32;

      this.nextButton.clear();
      this.nextButton.fillStyle(COLORS.success, 1);
      this.nextButton.lineStyle(2, 0xffffff, 0.8);
      this.nextButton.fillRoundedRect(nextX - 48, nextY - 18, 96, 36, 8);
      this.nextButton.strokeRoundedRect(nextX - 48, nextY - 18, 96, 36, 8);

      this.nextText.setPosition(nextX, nextY);
      this.nextText.setVisible(true);
      this.nextZone.setPosition(nextX, nextY);
      this.nextZone.setInteractive();
    } else {
      this.nextButton.clear();
      this.nextText.setVisible(false);
      this.nextZone.disableInteractive();
    }

    // Draw arrow pointing at target
    this.arrowG.clear();
    if (target.arrowDir === 'up') {
      const startY = panelY - panelHeight / 2 - 10;
      const endY = target.y + 24;

      this.arrowG.lineStyle(4, COLORS.warning, 1);
      this.arrowG.fillStyle(COLORS.warning, 1);

      // Line
      this.arrowG.lineBetween(target.x, startY, target.x, endY);
      // Arrow head pointing UP
      this.arrowG.fillTriangle(
        target.x, endY,
        target.x - 10, endY + 12,
        target.x + 10, endY + 12
      );
    } else if (target.arrowDir === 'down') {
      const startY = panelY + panelHeight / 2 + 10;
      const endY = target.y - 24;

      this.arrowG.lineStyle(4, COLORS.warning, 1);
      this.arrowG.fillStyle(COLORS.warning, 1);

      // Line
      this.arrowG.lineBetween(target.x, startY, target.x, endY);
      // Arrow head pointing DOWN
      this.arrowG.fillTriangle(
        target.x, endY,
        target.x - 10, endY - 12,
        target.x + 10, endY - 12
      );
    }
  }

  destroy(): void {
    this.nextZone.destroy();
    this.skipZone.destroy();
    super.destroy();
  }
}

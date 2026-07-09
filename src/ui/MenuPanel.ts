import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants';

export class MenuPanel extends Phaser.GameObjects.Container {
  private readonly backdrop: Phaser.GameObjects.Rectangle;
  private readonly panelBg: Phaser.GameObjects.Graphics;
  private readonly titleText: Phaser.GameObjects.Text;
  private readonly closeXText: Phaser.GameObjects.Text;
  private readonly helpBoxBg: Phaser.GameObjects.Graphics;
  private readonly helpTitleText: Phaser.GameObjects.Text;
  private readonly helpBodyText: Phaser.GameObjects.Text;
  private readonly soundButton: Phaser.GameObjects.Graphics;
  private readonly soundButtonText: Phaser.GameObjects.Text;
  private readonly resetButton: Phaser.GameObjects.Graphics;
  private readonly resetButtonText: Phaser.GameObjects.Text;
  private readonly closeButton: Phaser.GameObjects.Graphics;
  private readonly closeButtonText: Phaser.GameObjects.Text;

  private isResetConfirming = false;
  private soundEnabled = true;

  private readonly onSoundToggle: () => void;
  private readonly onResetSave: () => void;
  private readonly onClose: () => void;

  constructor(
    scene: Phaser.Scene,
    soundEnabled: boolean,
    onSoundToggle: () => void,
    onResetSave: () => void,
    onClose: () => void
  ) {
    super(scene, 0, 0);

    this.soundEnabled = soundEnabled;
    this.onSoundToggle = onSoundToggle;
    this.onResetSave = onResetSave;
    this.onClose = onClose;

    // Full-screen backdrop overlay
    this.backdrop = scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.7
    );
    this.backdrop.setInteractive();

    // Modal Card Graphic Bounds
    // Center at (GAME_WIDTH / 2, GAME_HEIGHT / 2) -> (360, 640)
    // Card size: width = 620, height = 720
    const cardW = 620;
    const cardH = 720;
    const cardX = GAME_WIDTH / 2 - cardW / 2; // 360 - 310 = 50
    const cardY = GAME_HEIGHT / 2 - cardH / 2; // 640 - 360 = 280

    this.panelBg = scene.add.graphics();
    this.panelBg.fillStyle(COLORS.hudPanel, 0.97);
    this.panelBg.lineStyle(3.5, COLORS.hudStroke, 1);
    this.panelBg.fillRoundedRect(cardX, cardY, cardW, cardH, 14);
    this.panelBg.strokeRoundedRect(cardX, cardY, cardW, cardH, 14);

    // Title
    this.titleText = scene.add
      .text(GAME_WIDTH / 2, cardY + 40, 'Settings & Help', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.titleText.setStroke('#11131e', 4);

    // Close "X" Button (Top-Right)
    const closeX = cardX + cardW - 40;
    const closeY = cardY + 40;
    this.closeXText = scene.add
      .text(closeX, closeY, '✕', {
        color: '#94a3b8',
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Help Instructions Box
    const helpBoxX = cardX + 30; // 50 + 30 = 80
    const helpBoxY = cardY + 95; // 280 + 95 = 375
    const helpBoxW = cardW - 60; // 560
    const helpBoxH = 280;

    this.helpBoxBg = scene.add.graphics();
    this.helpBoxBg.fillStyle(0x1d1e26, 0.85);
    this.helpBoxBg.lineStyle(2, 0x2e303d, 1);
    this.helpBoxBg.fillRoundedRect(helpBoxX, helpBoxY, helpBoxW, helpBoxH, 10);
    this.helpBoxBg.strokeRoundedRect(helpBoxX, helpBoxY, helpBoxW, helpBoxH, 10);

    this.helpTitleText = scene.add
      .text(GAME_WIDTH / 2, helpBoxY + 30, 'HOW TO PLAY', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const instructions = [
      '1. Tap "Start Day" to begin customer orders.',
      '2. Read the order bubble above customer heads.',
      '3. Tap an empty grill slot to start cooking.',
      '4. Wait until Jerk Chicken is ready (steams).',
      '5. Tap ready food to select it, then tap customer.',
      '6. Complete Daily Goals for bonus coins & XP!',
      '7. Buy upgrades after shifts to boost your cart.',
    ].join('\n\n');

    this.helpBodyText = scene.add
      .text(GAME_WIDTH / 2, helpBoxY + 155, instructions, {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        wordWrap: { width: helpBoxW - 40 },
      })
      .setOrigin(0.5);

    // Sound Button
    const btnY1 = cardY + 420; // 280 + 420 = 700
    this.soundButton = scene.add.graphics();
    this.soundButtonText = scene.add
      .text(GAME_WIDTH / 2, btnY1, '', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.drawRoundedButton(this.soundButton, GAME_WIDTH / 2, btnY1, 240, 48, 0x2d313e, COLORS.hudStroke);
    this.updateSoundDisplay();

    // Reset Button
    const btnY2 = cardY + 490; // 280 + 490 = 770
    this.resetButton = scene.add.graphics();
    this.resetButtonText = scene.add
      .text(GAME_WIDTH / 2, btnY2, 'Reset Save', {
        align: 'center',
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.drawRoundedButton(this.resetButton, GAME_WIDTH / 2, btnY2, 240, 48, 0x2d313e, COLORS.hudStroke);

    // Close Button (Bottom)
    const btnY3 = cardY + 580; // 280 + 580 = 860
    this.closeButton = scene.add.graphics();
    this.closeButtonText = scene.add
      .text(GAME_WIDTH / 2, btnY3, 'Close Menu', {
        align: 'center',
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.drawRoundedButton(this.closeButton, GAME_WIDTH / 2, btnY3, 240, 48, COLORS.success, 0xffffff);

    this.add([
      this.backdrop,
      this.panelBg,
      this.titleText,
      this.closeXText,
      this.helpBoxBg,
      this.helpTitleText,
      this.helpBodyText,
      this.soundButton,
      this.soundButtonText,
      this.resetButton,
      this.resetButtonText,
      this.closeButton,
      this.closeButtonText,
    ]);

    this.setDepth(1800);
    scene.add.existing(this);

    // Hook pointer events
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    const x = pointer.x;
    const y = pointer.y;

    const cardW = 620;
    const cardH = 720;
    const cardX1 = GAME_WIDTH / 2 - cardW / 2; // 50
    const cardX2 = GAME_WIDTH / 2 + cardW / 2; // 670
    const cardY1 = GAME_HEIGHT / 2 - cardH / 2; // 280
    const cardY2 = GAME_HEIGHT / 2 + cardH / 2; // 1000

    // 1. Close on backdrop tap (outside card bounds)
    const isOutsideCard = x < cardX1 || x > cardX2 || y < cardY1 || y > cardY2;
    if (isOutsideCard) {
      this.closeMenu();
      return;
    }

    // 2. Close on X button tap (640, 320)
    const isInsideCloseX =
      x >= cardX2 - 50 &&
      x <= cardX2 - 10 &&
      y >= cardY1 + 20 &&
      y <= cardY1 + 60;

    if (isInsideCloseX) {
      this.closeMenu();
      return;
    }

    // 3. Sound Button tap (GAME_WIDTH / 2, cardY1 + 420, w = 240, h = 48)
    const btnY1 = cardY1 + 420;
    const isInsideSound =
      x >= GAME_WIDTH / 2 - 120 &&
      x <= GAME_WIDTH / 2 + 120 &&
      y >= btnY1 - 24 &&
      y <= btnY1 + 24;

    if (isInsideSound) {
      this.soundEnabled = !this.soundEnabled;
      this.onSoundToggle();
      this.updateSoundDisplay();
      return;
    }

    // 4. Reset Button tap (GAME_WIDTH / 2, cardY1 + 490, w = 240, h = 48)
    const btnY2 = cardY1 + 490;
    const isInsideReset =
      x >= GAME_WIDTH / 2 - 120 &&
      x <= GAME_WIDTH / 2 + 120 &&
      y >= btnY2 - 24 &&
      y <= btnY2 + 24;

    if (isInsideReset) {
      if (!this.isResetConfirming) {
        this.isResetConfirming = true;
        this.resetButtonText.setText('Confirm Reset?');
        this.resetButtonText.setColor('#ff9f9f');
        this.drawRoundedButton(this.resetButton, GAME_WIDTH / 2, btnY2, 240, 48, COLORS.danger, 0xffffff);
      } else {
        this.onResetSave();
        this.closeMenu();
      }
      return;
    }

    // 5. Close Button tap (GAME_WIDTH / 2, cardY1 + 580, w = 240, h = 48)
    const btnY3 = cardY1 + 580;
    const isInsideClose =
      x >= GAME_WIDTH / 2 - 120 &&
      x <= GAME_WIDTH / 2 + 120 &&
      y >= btnY3 - 24 &&
      y <= btnY3 + 24;

    if (isInsideClose) {
      this.closeMenu();
      return;
    }
  }

  private updateSoundDisplay(): void {
    this.soundButtonText.setText(this.soundEnabled ? 'Sound: On' : 'Sound: Off');
    const btnY1 = GAME_HEIGHT / 2 - 720 / 2 + 420;
    this.drawRoundedButton(
      this.soundButton,
      GAME_WIDTH / 2,
      btnY1,
      240,
      48,
      this.soundEnabled ? 0x2d313e : 0x1e2230,
      COLORS.hudStroke
    );
  }

  private closeMenu(): void {
    // Cancel confirmation if active
    this.isResetConfirming = false;
    this.onClose();
  }

  private drawRoundedButton(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    fillColor: number,
    strokeColor: number
  ): void {
    graphics.clear();
    graphics.fillStyle(fillColor, 1);
    graphics.lineStyle(2.5, strokeColor, 0.85);
    graphics.fillRoundedRect(x - w / 2, y - h / 2, w, h, 10);
    graphics.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 10);
  }
}

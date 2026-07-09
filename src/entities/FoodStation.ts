import Phaser from 'phaser';
import { COLORS } from '../config/constants';
import type { FoodDefinition, FoodSlotSnapshot, FoodSlotState } from '../types/gameTypes';

interface FoodSlotView {
  state: FoodSlotState;
  foodId?: string;
  foodName?: string;
  timer?: Phaser.Time.TimerEvent;
  burnTimer?: Phaser.Time.TimerEvent;
  tween?: Phaser.Tweens.Tween;
  base: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  foodText: Phaser.GameObjects.Text;
  progressBar: Phaser.GameObjects.Rectangle;
  selected: boolean;
  visualsList: Phaser.GameObjects.GameObject[];
  selectedBadge?: Phaser.GameObjects.Container;
}

const SLOT_WIDTH = 154;
const SLOT_HEIGHT = 154;
const PROGRESS_WIDTH = 104;

export class FoodStation extends Phaser.GameObjects.Container {
  private readonly slots: FoodSlotView[] = [];
  private trashBase!: Phaser.GameObjects.Rectangle;
  private trashIcon!: Phaser.GameObjects.Text;
  private trashLabel!: Phaser.GameObjects.Text;
  private trashZone!: Phaser.GameObjects.Zone;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    onSlotSelected: (slotIndex: number) => void,
    onDiscard: (foodIds: string[]) => void
  ) {
    super(scene, x, y);

    const hitZone = scene.add.zone(0, 0, 440, 284).setInteractive({ useHandCursor: false });
    
    // A more modern grill base with grill marks
    const base = scene.add.rectangle(0, 0, 390, 222, 0x22242e, 1).setStrokeStyle(5, 0xffd166);
    
    // Draw simple grill lines
    const grillLines: Phaser.GameObjects.Rectangle[] = [];
    for (let i = -180; i <= 180; i += 30) {
      if (Math.abs(i) > 40) { // Keep center clear for Trash button
        const line = scene.add.rectangle(i, 0, 3, 210, 0x11131a, 0.45);
        grillLines.push(line);
      }
    }

    const label = scene.add
      .text(0, -86, 'Two-Slot Grill', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    label.setStroke('#11131a', 4);

    const hint = scene.add
      .text(0, 92, 'Tap empty slot to cook. Tap ready/cooking slot to select.', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        wordWrap: { width: 340 },
      })
      .setOrigin(0.5);
    hint.setStroke('#11131a', 4);

    this.add([hitZone, base, ...grillLines, label, hint]);

    // Trash/Discard Button in the center
    this.trashBase = scene.add.rectangle(0, -2, 58, 76, 0xe85d5d, 1).setStrokeStyle(3, 0xffb3b3);
    this.trashIcon = scene.add.text(0, -14, '🗑️', { fontSize: '24px' }).setOrigin(0.5);
    this.trashLabel = scene.add.text(0, 18, 'DISCARD', {
      color: '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.trashZone = scene.add.zone(0, -2, 64, 84);

    this.trashZone.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.trashBase.setFillStyle(0xff7373, 1);
    });
    this.trashZone.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.trashBase.setFillStyle(0xe85d5d, 1);
    });
    this.trashZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      const discarded = this.discardSelectedSlots();
      if (discarded.length > 0) {
        onDiscard(discarded);
      }
    });

    this.add([this.trashBase, this.trashIcon, this.trashLabel, this.trashZone]);

    [-110, 110].forEach((slotX, index) => {
      const slotZone = scene.add.zone(slotX, -2, SLOT_WIDTH + 28, SLOT_HEIGHT + 28).setInteractive({ useHandCursor: true });
      const slotBase = scene.add.rectangle(slotX, -2, SLOT_WIDTH, SLOT_HEIGHT, 0x181a21, 1).setStrokeStyle(4, 0x6f7785);
      const plate = scene.add.ellipse(slotX, -14, 96, 48, 0xfff7df, 1).setStrokeStyle(2, 0x11131e);
      
      const slotLabel = scene.add
        .text(slotX, 34, 'Empty', {
          align: 'center',
          color: '#fff7df',
          fontFamily: 'Arial, sans-serif',
          fontSize: '19px',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      slotLabel.setStroke('#11131e', 3);

      const foodText = scene.add
        .text(slotX, 58, '', {
          align: 'center',
          color: '#ffd166',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          wordWrap: { width: SLOT_WIDTH - 18 },
        })
        .setOrigin(0.5);
      foodText.setStroke('#11131e', 3);

      const progressTrack = scene.add.rectangle(slotX, 78, PROGRESS_WIDTH, 10, 0x0e1018, 1);
      const progressBar = scene.add.rectangle(slotX - PROGRESS_WIDTH / 2, 78, 0, 10, COLORS.success, 1).setOrigin(0, 0.5);

      slotZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
        onSlotSelected(index);
      });

      this.add([slotZone, slotBase, plate, slotLabel, foodText, progressTrack, progressBar]);
      this.slots[index] = {
        state: 'empty',
        base: slotBase,
        label: slotLabel,
        foodText,
        progressBar,
        selected: false,
        visualsList: []
      };
    });

    scene.add.existing(this);
    this.renderAllSlots();
  }

  startCooking(
    slotIndex: number,
    food: FoodDefinition,
    prepTimeMs: number,
    readyWindowMs: number,
    onReady: (slotIndex: number, food: FoodDefinition) => void,
    onBurnt: (slotIndex: number, food: FoodDefinition) => void,
  ): boolean {
    const slot = this.slots[slotIndex];

    if (!slot || slot.state !== 'empty') {
      return false;
    }

    slot.state = 'cooking';
    slot.foodId = food.id;
    slot.foodName = food.name;
    slot.selected = false;
    slot.progressBar.width = 0;
    slot.tween?.stop();
    slot.tween = this.scene.tweens.add({
      targets: slot.progressBar,
      width: PROGRESS_WIDTH,
      duration: prepTimeMs,
      ease: 'Linear',
    });
    slot.timer = this.scene.time.delayedCall(prepTimeMs, () => {
      if (slot.state !== 'cooking') {
        return;
      }

      slot.state = 'ready';
      slot.progressBar.width = PROGRESS_WIDTH;
      this.renderSlot(slotIndex);
      this.updateTrashButtonVisuals();
      onReady(slotIndex, food);
      slot.burnTimer = this.scene.time.delayedCall(readyWindowMs, () => {
        if (slot.state !== 'ready') {
          return;
        }

        slot.state = 'burnt';
        slot.selected = false;
        this.renderSlot(slotIndex);
        this.updateTrashButtonVisuals();
        onBurnt(slotIndex, food);
      });
    });

    this.renderSlot(slotIndex);
    this.updateTrashButtonVisuals();
    return true;
  }

  selectReadySlot(slotIndex: number): string | undefined {
    const slot = this.slots[slotIndex];

    if (!slot || (slot.state !== 'ready' && slot.state !== 'cooking') || !slot.foodId) {
      return undefined;
    }

    slot.selected = !slot.selected;
    this.renderSlot(slotIndex);
    this.updateTrashButtonVisuals();
    return slot.foodId;
  }

  clearSlot(slotIndex: number): void {
    const slot = this.slots[slotIndex];

    if (!slot) {
      return;
    }

    slot.timer?.remove(false);
    slot.burnTimer?.remove(false);
    slot.tween?.stop();
    slot.state = 'empty';
    slot.foodId = undefined;
    slot.foodName = undefined;
    slot.selected = false;
    slot.progressBar.width = 0;
    this.renderSlot(slotIndex);
    this.updateTrashButtonVisuals();
  }

  clearAll(): void {
    this.slots.forEach((_slot, index) => {
      this.clearSlot(index);
    });
  }

  consumeSelectedReadyFoodIds(): string[] {
    const consumedFoodIds = this.getSelectedReadyFoodIds();
    this.slots.forEach((slot, index) => {
      if (slot.selected && slot.state === 'ready') {
        this.clearSlot(index);
      }
    });
    return consumedFoodIds;
  }

  getSelectedReadyFoodIds(): string[] {
    return this.slots
      .filter((slot) => slot.state === 'ready' && slot.selected && slot.foodId)
      .map((slot) => slot.foodId as string);
  }

  getSelectedReadyFoodNames(): string[] {
    return this.slots
      .filter((slot) => slot.state === 'ready' && slot.selected && slot.foodName)
      .map((slot) => slot.foodName as string);
  }

  getSelectedCookingFoodNames(): string[] {
    return this.slots
      .filter((slot) => slot.state === 'cooking' && slot.selected && slot.foodName)
      .map((slot) => slot.foodName as string);
  }

  hasSelectedSlot(): boolean {
    return this.slots.some((slot) => slot.selected && (slot.state === 'ready' || slot.state === 'cooking'));
  }

  private updateTrashButtonVisuals(): void {
    const hasSelected = this.hasSelectedSlot();
    const alpha = hasSelected ? 1.0 : 0.35;
    this.trashBase.setAlpha(alpha);
    this.trashIcon.setAlpha(alpha);
    this.trashLabel.setAlpha(alpha);
    if (hasSelected) {
      this.trashZone.setInteractive({ useHandCursor: true });
    } else {
      this.trashZone.disableInteractive();
    }
  }

  discardSelectedSlots(): string[] {
    const discardedFoodIds: string[] = [];
    this.slots.forEach((slot, index) => {
      if (slot.selected && (slot.state === 'ready' || slot.state === 'cooking')) {
        if (slot.foodId) {
          discardedFoodIds.push(slot.foodId);
        }
        this.clearSlot(index);
      }
    });
    return discardedFoodIds;
  }

  getSlotSnapshots(): FoodSlotSnapshot[] {
    return this.slots.map((slot, index) => ({
      index,
      state: slot.state,
      foodId: slot.foodId,
    }));
  }

  hasEmptySlot(): boolean {
    return this.slots.some((slot) => slot.state === 'empty');
  }

  private renderAllSlots(): void {
    this.slots.forEach((_slot, index) => {
      this.renderSlot(index);
    });
    this.updateTrashButtonVisuals();
  }

  private renderSlot(slotIndex: number): void {
    const slot = this.slots[slotIndex];

    if (!slot) {
      return;
    }

    const slotX = slotIndex === 0 ? -110 : 110;
    const scene = this.scene;

    // Clear old visual structures
    if (slot.visualsList) {
      slot.visualsList.forEach((v) => v.destroy());
    }
    slot.visualsList = [];

    if (slot.selectedBadge) {
      slot.selectedBadge.destroy();
      slot.selectedBadge = undefined;
    }

    const strokeColor = slot.selected ? COLORS.success : this.getSlotStrokeColor(slot.state);
    slot.base.setStrokeStyle(slot.selected ? 6 : 4, strokeColor);
    slot.base.setFillStyle(this.getSlotFillColor(slot.state), 1);
    slot.label.setText(this.getSlotLabel(slot.state));
    slot.label.setColor(slot.state === 'burnt' ? '#ffb3b3' : '#fff7df');
    slot.foodText.setText(slot.foodName ?? '');
    slot.progressBar.setFillStyle(this.getProgressColor(slot.state), 1);

    if (slot.state === 'empty') {
      slot.progressBar.width = 0;
    } else if (slot.foodId) {
      // Dynamic rendering of food items
      this.drawFoodVisuals(slot, slotX, slot.foodId, slot.state);
    }

    // Selected Badge Indicator
    if (slot.selected && slot.state !== 'empty') {
      const badge = scene.add.container(slotX, -82);
      const bg = scene.add.rectangle(0, 0, 94, 24, COLORS.success, 1).setStrokeStyle(1.5, 0xffffff);
      const txt = scene.add.text(0, 0, 'SELECTED', {
        color: '#112015',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      badge.add([bg, txt]);
      this.add(badge);
      slot.selectedBadge = badge;
    }
  }

  private drawFoodVisuals(slot: FoodSlotView, slotX: number, foodId: string, state: FoodSlotState): void {
    const scene = this.scene;
    const isBurnt = state === 'burnt';
    const isCooking = state === 'cooking';

    // Base colors
    let mainColor = 0xffffff;
    let detailColor = 0xffffff;

    if (foodId === 'jerk_chicken') {
      mainColor = isBurnt ? 0x222222 : isCooking ? 0xab7d6d : 0x7c3f30;
      detailColor = isBurnt ? 0x444444 : 0xffffff;

      // Drumstick body
      const body = scene.add.ellipse(slotX - 8, -16, 52, 28, mainColor, 1).setStrokeStyle(2.5, 0x11131a);
      // Bone
      const bone = scene.add.rectangle(slotX + 22, -12, 16, 6, detailColor, 1).setStrokeStyle(1.5, 0x11131a);
      bone.setAngle(15);
      const jointA = scene.add.circle(slotX + 30, -16, 5, detailColor, 1).setStrokeStyle(1.5, 0x11131a);
      const jointB = scene.add.circle(slotX + 32, -8, 5, detailColor, 1).setStrokeStyle(1.5, 0x11131a);
      
      slot.visualsList.push(body, bone, jointA, jointB);
    } else if (foodId === 'festival') {
      mainColor = isBurnt ? 0x222222 : isCooking ? 0xebe0be : 0xeaa835;
      
      // Two dumplings
      const dumpA = scene.add.ellipse(slotX - 18, -18, 48, 22, mainColor, 1).setStrokeStyle(2.5, 0x11131a);
      dumpA.setAngle(-12);
      const dumpB = scene.add.ellipse(slotX + 14, -8, 48, 22, mainColor, 1).setStrokeStyle(2.5, 0x11131a);
      dumpB.setAngle(6);
      
      slot.visualsList.push(dumpA, dumpB);
    } else if (foodId === 'roast_corn') {
      mainColor = isBurnt ? 0x222222 : isCooking ? 0xfef08a : 0xeab308;
      detailColor = isBurnt ? 0x111111 : 0x65a30d; // green husks

      // Green husks underneath
      const huskL = scene.add.ellipse(slotX - 26, -6, 32, 14, detailColor, 1).setStrokeStyle(2, 0x11131a);
      huskL.setAngle(-25);
      const huskR = scene.add.ellipse(slotX - 30, -18, 30, 12, detailColor, 1).setStrokeStyle(2, 0x11131a);
      huskR.setAngle(-40);

      // Corn body
      const cob = scene.add.ellipse(slotX + 6, -14, 68, 28, mainColor, 1).setStrokeStyle(2.5, 0x11131a);
      cob.setAngle(-5);

      // Add a couple of brown char lines if ready
      const details: Phaser.GameObjects.GameObject[] = [];
      if (!isCooking) {
        const charColor = isBurnt ? 0x000000 : 0x4f2f23;
        const line1 = scene.add.line(slotX + 4, -18, 0, 0, 4, 12, charColor, 2);
        const line2 = scene.add.line(slotX + 18, -14, 0, 0, 4, 12, charColor, 2);
        const line3 = scene.add.line(slotX - 10, -12, 0, 0, 4, 12, charColor, 2);
        details.push(line1, line2, line3);
      }
      
      slot.visualsList.push(huskL, huskR, cob, ...details);
    } else if (foodId === 'pepper_shrimp') {
      mainColor = isBurnt ? 0x222222 : isCooking ? 0xfecaca : 0xe24a18;
      detailColor = isBurnt ? 0x333333 : 0xffa580;

      // Three curved shrimp shapes
      const shA = scene.add.ellipse(slotX - 20, -18, 32, 18, mainColor, 1).setStrokeStyle(2, 0x11131a);
      shA.setAngle(-30);
      const tailA = scene.add.triangle(slotX - 34, -20, 0, -4, -6, 2, 0, 6, detailColor, 1);
      tailA.setAngle(-30);

      const shB = scene.add.ellipse(slotX + 18, -8, 28, 16, mainColor, 1).setStrokeStyle(2, 0x11131a);
      shB.setAngle(15);
      const tailB = scene.add.triangle(slotX + 30, -6, 0, -4, 6, 2, 0, 6, detailColor, 1);
      tailB.setAngle(15);

      const shC = scene.add.ellipse(slotX - 2, -6, 30, 17, mainColor, 1).setStrokeStyle(2, 0x11131a);
      shC.setAngle(-5);
      const tailC = scene.add.triangle(slotX - 14, -6, 0, -4, -6, 2, 0, 6, detailColor, 1);
      tailC.setAngle(-5);

      slot.visualsList.push(shA, tailA, shB, tailB, shC, tailC);
    }

    // Add them to container
    slot.visualsList.forEach((vis) => this.add(vis));

    // Special State Effects
    if (isCooking) {
      // Pulse animation to represent heat / cooking progress
      slot.visualsList.forEach((vis) => {
        if (vis instanceof Phaser.GameObjects.Shape) {
          vis.setAlpha(0.65);
        }
      });
      slot.tween?.stop();
      slot.tween = scene.tweens.add({
        targets: slot.visualsList.filter(v => v instanceof Phaser.GameObjects.Shape),
        alpha: 0.95,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else if (state === 'ready') {
      // Draw steam particles rising upwards
      const particleCount = 3;
      for (let i = 0; i < particleCount; i++) {
        const px = slotX - 30 + i * 26 + Phaser.Math.Between(-6, 6);
        const py = -24 + Phaser.Math.Between(-8, 2);
        
        // Steam line
        const steam = scene.add.text(px, py, '~', {
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.5);
        steam.setAngle(-90);
        
        this.add(steam);
        slot.visualsList.push(steam);

        scene.tweens.add({
          targets: steam,
          y: py - 46,
          x: px + Phaser.Math.Between(-10, 10),
          alpha: 0,
          duration: 1200 + i * 200,
          repeat: -1,
          ease: 'Sine.easeOut'
        });
      }
    } else if (isBurnt) {
      // Draw rising dark gray smoke lines
      const particleCount = 2;
      for (let i = 0; i < particleCount; i++) {
        const px = slotX - 18 + i * 36 + Phaser.Math.Between(-5, 5);
        const py = -26;
        const smoke = scene.add.text(px, py, 'S', {
          color: '#555555',
          fontFamily: 'Georgia, serif',
          fontSize: '15px',
          fontStyle: 'italic'
        }).setOrigin(0.5).setAlpha(0.6);
        smoke.setAngle(Phaser.Math.Between(-15, 15));
        
        this.add(smoke);
        slot.visualsList.push(smoke);

        scene.tweens.add({
          targets: smoke,
          y: py - 52,
          scale: 1.5,
          alpha: 0,
          duration: 1000 + i * 300,
          repeat: -1,
          ease: 'Sine.easeOut'
        });
      }
    }
  }

  private getSlotLabel(state: FoodSlotState): string {
    if (state === 'cooking') {
      return 'Cooking';
    }

    if (state === 'ready') {
      return 'Ready';
    }

    if (state === 'burnt') {
      return 'Burnt';
    }

    return 'Empty';
  }

  private getSlotFillColor(state: FoodSlotState): number {
    if (state === 'ready') {
      return 0x1f3627;
    }

    if (state === 'burnt') {
      return 0x331c1c;
    }

    if (state === 'cooking') {
      return 0x221c26;
    }

    return 0x14151b;
  }

  private getSlotStrokeColor(state: FoodSlotState): number {
    if (state === 'ready') {
      return COLORS.success;
    }

    if (state === 'burnt') {
      return COLORS.danger;
    }

    if (state === 'cooking') {
      return COLORS.warning;
    }

    return 0x5a5f6b;
  }

  private getProgressColor(state: FoodSlotState): number {
    if (state === 'burnt') {
      return COLORS.danger;
    }

    if (state === 'ready') {
      return COLORS.success;
    }

    return COLORS.warning;
  }
}

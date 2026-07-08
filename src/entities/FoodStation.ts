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
    const base = scene.add.rectangle(0, 0, 390, 222, COLORS.grill, 1).setStrokeStyle(5, 0xffd166);
    const label = scene.add
      .text(0, -86, 'Two-Slot Grill', {
        color: '#fff7df',
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const hint = scene.add
      .text(0, 92, 'Tap empty slot to cook. Tap ready/cooking slot to select.', {
        align: 'center',
        color: '#ffd166',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        wordWrap: { width: 340 },
      })
      .setOrigin(0.5);

    this.add([hitZone, base, label, hint]);

    // Trash/Discard Button in the center (between slots shifted to -110 / 110)
    this.trashBase = scene.add.rectangle(0, -2, 54, 72, 0xe85d5d, 1).setStrokeStyle(3, 0xffb3b3);
    this.trashIcon = scene.add.text(0, -14, '🗑️', { fontSize: '24px' }).setOrigin(0.5);
    this.trashLabel = scene.add.text(0, 16, 'DISCARD', {
      color: '#fff7df',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.trashZone = scene.add.zone(0, -2, 60, 80);

    // Interactive hover behavior for Trash Button
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
      const foodA = scene.add.ellipse(slotX - 20, -18, 42, 24, 0xb85f2e, 0.55);
      const foodB = scene.add.ellipse(slotX + 18, -8, 38, 20, 0xe0953f, 0.55);
      const slotLabel = scene.add
        .text(slotX, 34, 'Empty', {
          align: 'center',
          color: '#fff7df',
          fontFamily: 'Arial, sans-serif',
          fontSize: '20px',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      const foodText = scene.add
        .text(slotX, 58, '', {
          align: 'center',
          color: '#ffd166',
          fontFamily: 'Arial, sans-serif',
          fontSize: '15px',
          wordWrap: { width: SLOT_WIDTH - 18 },
        })
        .setOrigin(0.5);
      const progressTrack = scene.add.rectangle(slotX, 78, PROGRESS_WIDTH, 10, 0x0e1018, 1);
      const progressBar = scene.add.rectangle(slotX - PROGRESS_WIDTH / 2, 78, 0, 10, COLORS.success, 1).setOrigin(0, 0.5);

      slotZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
        onSlotSelected(index);
      });

      this.add([slotZone, slotBase, plate, foodA, foodB, slotLabel, foodText, progressTrack, progressBar]);
      this.slots[index] = {
        state: 'empty',
        base: slotBase,
        label: slotLabel,
        foodText,
        progressBar,
        selected: false,
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
    const alpha = hasSelected ? 1.0 : 0.4;
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

    const strokeColor = slot.selected ? COLORS.success : this.getSlotStrokeColor(slot.state);
    slot.base.setStrokeStyle(slot.selected ? 6 : 4, strokeColor);
    slot.base.setFillStyle(this.getSlotFillColor(slot.state), 1);
    slot.label.setText(this.getSlotLabel(slot.state));
    slot.label.setColor(slot.state === 'burnt' ? '#ffb3b3' : '#fff7df');
    slot.foodText.setText(slot.foodName ?? '');
    slot.progressBar.setFillStyle(this.getProgressColor(slot.state), 1);

    if (slot.state === 'empty') {
      slot.progressBar.width = 0;
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
      return 0x233d2d;
    }

    if (state === 'burnt') {
      return 0x3d2323;
    }

    if (state === 'cooking') {
      return 0x2f2930;
    }

    return 0x181a21;
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

    return 0x6f7785;
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

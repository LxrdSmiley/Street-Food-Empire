import Phaser from 'phaser';
import { CUSTOMER_RESPAWN_DELAY_MS } from '../config/constants';
import { Customer } from '../entities/Customer';
import type {
  CustomerDefinition,
  CustomerOrder,
  CustomerSpawnConfig,
  CustomerState,
  FoodDefinition,
  ServeResult,
} from '../types/gameTypes';

export class CustomerSystem {
  private readonly scene: Phaser.Scene;
  private readonly customers: readonly CustomerDefinition[];
  private readonly foods: readonly FoodDefinition[];
  private readonly spawnPoint: Phaser.Math.Vector2;
  private readonly getStallLevel: () => number;
  private readonly getPatienceBonusMs: () => number;
  private readonly onCustomerSelected: () => void;
  private activeCustomer?: CustomerState;
  private spawnTimer?: Phaser.Time.TimerEvent;

  constructor(config: CustomerSpawnConfig) {
    this.scene = config.scene;
    this.customers = config.customers;
    this.foods = config.foods;
    this.spawnPoint = new Phaser.Math.Vector2(config.spawnPoint.x, config.spawnPoint.y);
    this.getStallLevel = config.getStallLevel;
    this.getPatienceBonusMs = config.getPatienceBonusMs;
    this.onCustomerSelected = config.onCustomerSelected;
  }

  spawnNextCustomer(): void {
    if (this.activeCustomer) {
      return;
    }

    const stallLevel = this.getStallLevel();
    const availableCustomers = this.customers.filter(
      (customer) => customer.availableFromStallLevel <= stallLevel,
    );
    const availableFoods = this.foods.filter((food) => food.unlockStallLevel <= stallLevel);
    const customer = Phaser.Utils.Array.GetRandom(availableCustomers.length > 0 ? availableCustomers : [...this.customers]);
    const food = Phaser.Utils.Array.GetRandom(availableFoods.length > 0 ? availableFoods : [...this.foods]);
    const order: CustomerOrder = { foodId: food.id, label: food.name };
    const patienceMs = customer.patienceMs + this.getPatienceBonusMs();

    const view = new Customer(
      this.scene,
      this.spawnPoint.x,
      this.spawnPoint.y,
      customer,
      order,
      patienceMs,
      this.onCustomerSelected,
    );

    this.activeCustomer = {
      id: Phaser.Utils.String.UUID(),
      customerTypeId: customer.id,
      order,
      view,
      isReadyToServe: false,
    };
  }

  getActiveOrder(): CustomerOrder | undefined {
    return this.activeCustomer?.order;
  }

  setActiveCustomerReady(isReady: boolean): void {
    if (!this.activeCustomer) {
      return;
    }

    this.activeCustomer.isReadyToServe = isReady;
    this.activeCustomer.view.setReadyToServe(isReady);
  }

  tryServeActiveCustomer(foodId: string): ServeResult {
    if (!this.activeCustomer || this.activeCustomer.order.foodId !== foodId) {
      return { success: false };
    }

    const servedCustomer = this.activeCustomer;
    servedCustomer.view.playServedAndDestroy();
    this.activeCustomer = undefined;

    return {
      success: true,
      customerTypeId: servedCustomer.customerTypeId,
      foodId: servedCustomer.order.foodId,
    };
  }

  scheduleNextCustomer(spawnIntervalMultiplier = 1, spawnDelayReductionMs = 0): void {
    const safeMultiplier = Number.isFinite(spawnIntervalMultiplier) && spawnIntervalMultiplier > 0
      ? spawnIntervalMultiplier
      : 1;
    const safeReduction = Number.isFinite(spawnDelayReductionMs) ? Math.max(0, spawnDelayReductionMs) : 0;
    const delayMs = Math.max(100, Math.round(CUSTOMER_RESPAWN_DELAY_MS * safeMultiplier - safeReduction));

    this.spawnTimer?.remove(false);
    this.spawnTimer = this.scene.time.delayedCall(delayMs, () => {
      this.spawnNextCustomer();
    });
  }
}

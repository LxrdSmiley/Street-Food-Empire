import Phaser from 'phaser';
import { CUSTOMER_RESPAWN_DELAY_MS } from '../config/constants';
import { Customer } from '../entities/Customer';
import type {
  CustomerDefinition,
  CustomerOrder,
  CustomerSpawnConfig,
  CustomerState,
} from '../types/gameTypes';

export class CustomerSystem {
  private readonly scene: Phaser.Scene;
  private readonly customers: readonly CustomerDefinition[];
  private readonly spawnPoint: Phaser.Math.Vector2;
  private readonly getStallLevel: () => number;
  private readonly getPatienceBonusMs: () => number;
  private readonly createOrder: (customer: CustomerDefinition) => CustomerOrder;
  private readonly onCustomerSelected: () => void;
  private readonly onCustomerExpired: (customerState: CustomerState) => void;
  private activeCustomer?: CustomerState;
  private spawnTimer?: Phaser.Time.TimerEvent;

  constructor(config: CustomerSpawnConfig) {
    this.scene = config.scene;
    this.customers = config.customers;
    this.spawnPoint = new Phaser.Math.Vector2(config.spawnPoint.x, config.spawnPoint.y);
    this.getStallLevel = config.getStallLevel;
    this.getPatienceBonusMs = config.getPatienceBonusMs;
    this.createOrder = config.createOrder;
    this.onCustomerSelected = config.onCustomerSelected;
    this.onCustomerExpired = config.onCustomerExpired;
  }

  update(deltaMs: number): void {
    if (!this.activeCustomer) {
      return;
    }

    this.activeCustomer.remainingPatienceMs = Math.max(0, this.activeCustomer.remainingPatienceMs - deltaMs);
    this.activeCustomer.view.updatePatience(
      this.activeCustomer.remainingPatienceMs,
      this.activeCustomer.patienceMs,
    );

    if (this.activeCustomer.remainingPatienceMs > 0) {
      return;
    }

    const expiredCustomer = this.activeCustomer;
    this.activeCustomer = undefined;
    expiredCustomer.view.playLeftAndDestroy();
    this.onCustomerExpired(expiredCustomer);
  }

  spawnNextCustomer(): void {
    if (this.activeCustomer) {
      return;
    }

    const stallLevel = this.getStallLevel();
    const availableCustomers = this.customers.filter(
      (customer) => customer.availableFromStallLevel <= stallLevel,
    );
    const customer = Phaser.Utils.Array.GetRandom(availableCustomers.length > 0 ? availableCustomers : [...this.customers]);
    const order = this.createOrder(customer);
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
      customer,
      order,
      view,
      isReadyToServe: false,
      patienceMs,
      remainingPatienceMs: patienceMs,
    };
  }

  getActiveOrder(): CustomerOrder | undefined {
    return this.activeCustomer?.order;
  }

  getActiveCustomer(): CustomerState | undefined {
    return this.activeCustomer;
  }

  setActiveCustomerReadyState(state: 'waiting' | 'ready' | 'mismatch'): void {
    if (!this.activeCustomer) {
      return;
    }

    this.activeCustomer.isReadyToServe = state === 'ready';
    this.activeCustomer.view.setReadyToServeState(state);
  }

  removeActiveCustomerAsServed(): CustomerState | undefined {
    if (!this.activeCustomer) {
      return undefined;
    }

    const servedCustomer = this.activeCustomer;
    servedCustomer.view.playServedAndDestroy();
    this.activeCustomer = undefined;
    return servedCustomer;
  }

  removeActiveCustomerAsFailed(): CustomerState | undefined {
    if (!this.activeCustomer) {
      return undefined;
    }

    const failedCustomer = this.activeCustomer;
    failedCustomer.view.playLeftAndDestroy();
    this.activeCustomer = undefined;
    return failedCustomer;
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

  clear(): void {
    this.spawnTimer?.remove(false);
    this.spawnTimer = undefined;
    this.activeCustomer?.view.destroy();
    this.activeCustomer = undefined;
  }
}

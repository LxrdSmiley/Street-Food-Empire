import type { CustomerDefinition, CustomerOrder, FoodDefinition, OrderCheckResult } from '../types/gameTypes';

export class OrderSystem {
  private readonly foods: readonly FoodDefinition[];
  private readonly getStallLevel: () => number;

  constructor(foods: readonly FoodDefinition[], getStallLevel: () => number) {
    this.foods = foods;
    this.getStallLevel = getStallLevel;
  }

  createOrder(customer: CustomerDefinition): CustomerOrder {
    const availableFoods = this.getUnlockedFoods();
    const orderSize = this.getOrderSize(customer);
    const items = Array.from({ length: orderSize }, (_, index) => {
      const food = availableFoods[(index + Math.floor(Math.random() * availableFoods.length)) % availableFoods.length];
      return {
        foodId: food.id,
        label: food.name,
      };
    });

    return {
      items,
      label: items.map((item) => item.label).join(' + '),
    };
  }

  checkOrder(order: CustomerOrder, servedFoodIds: readonly string[]): OrderCheckResult {
    const expectedFoodIds = this.sortFoodIds(order.items.map((item) => item.foodId));
    const normalizedServedFoodIds = this.sortFoodIds([...servedFoodIds]);

    return {
      isCorrect: expectedFoodIds.join('|') === normalizedServedFoodIds.join('|'),
      expectedFoodIds,
      servedFoodIds: normalizedServedFoodIds,
    };
  }

  getUnlockedFoods(): FoodDefinition[] {
    const stallLevel = this.getStallLevel();
    const unlockedFoods = this.foods.filter((food) => food.unlockStallLevel <= stallLevel);
    return unlockedFoods.length > 0 ? unlockedFoods : [...this.foods].slice(0, 1);
  }

  private getOrderSize(customer: CustomerDefinition): number {
    const stallLevel = this.getStallLevel();
    const twoItemChance = Math.min(0.55, Math.max(0, (stallLevel - 1) * 0.12 + customer.orderDifficultyBias));
    return Math.random() < twoItemChance ? 2 : 1;
  }

  private sortFoodIds(foodIds: string[]): string[] {
    return foodIds.sort((firstFoodId, secondFoodId) => firstFoodId.localeCompare(secondFoodId));
  }
}

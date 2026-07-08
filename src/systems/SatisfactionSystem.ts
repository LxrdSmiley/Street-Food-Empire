import { clamp } from '../utils/math';

export class SatisfactionSystem {
  private satisfaction = 100;

  startDay(): void {
    this.satisfaction = 100;
  }

  recordCorrectServe(isFastServe: boolean): number {
    this.satisfaction = this.normalize(this.satisfaction + (isFastServe ? 2 : 0));
    return this.satisfaction;
  }

  recordWrongOrder(): number {
    this.satisfaction = this.normalize(this.satisfaction - 12);
    return this.satisfaction;
  }

  recordBurntFood(): number {
    this.satisfaction = this.normalize(this.satisfaction - 6);
    return this.satisfaction;
  }

  recordCustomerLeft(): number {
    this.satisfaction = this.normalize(this.satisfaction - 15);
    return this.satisfaction;
  }

  getSatisfaction(): number {
    return this.satisfaction;
  }

  private normalize(value: number): number {
    return Math.round(clamp(value, 0, 100));
  }
}

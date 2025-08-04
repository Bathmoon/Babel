import { Statistic } from "../statistic";

export class Health extends Statistic {
  constructor(maxHp: number) {
    super(maxHp);
  }

  takeDamage(amount: number) {
    this.currentValue = Math.max(this.currentValue - amount, 0);
  }

  heal(amount: number) {
    this.currentValue = Math.min(this.currentValue + amount, this.baseValue);
  }

  isAlive(): boolean {
    return this.currentValue > 0;
  }
}

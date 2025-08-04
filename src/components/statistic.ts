export abstract class Statistic {
  baseValue: number;
  currentValue: number;
  modifiedValue: number | null = null;
  modifiedDuration: number = 0;

  constructor(maxHp: number) {
    this.baseValue = maxHp;
    this.currentValue = maxHp;
  }

  buff(amount: number, duration: number) {
    if (this.modifiedValue) {
      this.modifiedValue += amount;
    } else {
      this.modifiedValue = amount;
    }

    this.modifiedDuration += duration;
  }

  debuff(amount: number, duration: number) {
    if (this.modifiedValue) {
      this.modifiedValue -= amount;
    }

    this.modifiedDuration += duration;
  }
}

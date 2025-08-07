import type { Entity } from "../entity/entity";

export abstract class Statistic {
  baseValue: number;
  currentValue: number;
  modifiedValue: number | null = null;
  modifiedDuration: number = 0;
  owningEntity: Entity;

  constructor(maxValue: number, owningEntity: Entity) {
    this.baseValue = maxValue;
    this.currentValue = maxValue;
    this.owningEntity = owningEntity;
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

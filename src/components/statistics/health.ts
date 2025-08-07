import { Statistic } from "../statistic";
import { Entity } from "../../entity/entity";

export class Health extends Statistic {
  constructor(maxHp: number, owningEntity: Entity) {
    super(maxHp, owningEntity);
  }

  takeDamage(amount: number) {
    this.currentValue = Math.max(this.currentValue - amount, 0);

    if (!this.isAlive()) {
      this.owningEntity.die();
    }
  }

  heal(amount: number) {
    this.currentValue = Math.min(this.currentValue + amount, this.baseValue);
  }

  isAlive(): boolean {
    return this.currentValue > 0;
  }
}

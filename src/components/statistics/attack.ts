import { Statistic } from "../statistic";
import { Entity } from "../../entity/entity";

export class Attack extends Statistic {
  constructor(baseAttack: number, owningEntity: Entity) {
    super(baseAttack, owningEntity);
  }
}

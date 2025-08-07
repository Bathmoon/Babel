import { Statistic } from "../statistic";
import { Entity } from "../../entity/entity";

export class Defense extends Statistic {
  constructor(baseDefense: number, owningEntity: Entity) {
    super(baseDefense, owningEntity);
  }
}

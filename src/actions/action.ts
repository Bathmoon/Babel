import { Entity } from "../entity/entity";

export abstract class Action {
  abstract perform: (entity: Entity) => void;
}

import { Entity } from "../entity/entity";

export interface Action {
  perform: (entity: Entity) => void;
}

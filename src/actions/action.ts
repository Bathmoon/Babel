import { Entity } from "../entity";

export interface Action {
  perform: (entity: Entity) => void;
}

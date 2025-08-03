import { Engine } from "../engine";
import { Entity } from "../entity";

export interface Action {
  perform: (engine: Engine, entity: Entity) => void;
}

import { EngineState } from "../engine";
import { Action } from "./action";
import { Entity } from "../entity/entity";

export interface LogMap {
  [key: string]: number;
}

export const LOG_KEYS: LogMap = {
  ArrowUp: -1,
  ArrowDown: 1,
  PageDown: 10,
  PageUp: -1,
};

export class LogAction implements Action {
  perform(_entity: Entity) {
    window.engine.state = EngineState.Log;
  }
}

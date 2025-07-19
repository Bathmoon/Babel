// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { Engine } from "./engine";
import { Entity } from "./entity";

export interface Action {
  perform: (engine: Engine, entity: Entity) => void;
}

export abstract class ActionWithDirection implements Action {
  dx: number;
  dy: number;

  constructor(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  perform(_engine: Engine, _entity: Entity) {}
}

export class MovementAction extends ActionWithDirection {
  perform(engine: Engine, entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (!engine.gameMap.isInBounds(destX, destY)) return;
    if (!engine.gameMap.tiles[destY][destX].isWalkable) return;
    if (engine.gameMap.getBlockingEntityAtLocation(destX, destY)) return;

    if (debug) {
      console.log(`moving to ${destX}, ${destY}`);
    }

    entity.move(this.dx, this.dy);
  }
}

export class MeleeAction extends ActionWithDirection {
  perform(engine: Engine, entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    const target = engine.gameMap.getBlockingEntityAtLocation(destX, destY);

    if (!target) return;

    console.log(`You kick the ${target.name}, much to its annoyance!`);
  }
}

export class BumpAction extends ActionWithDirection {
  perform(engine: Engine, entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (engine.gameMap.getBlockingEntityAtLocation(destX, destY)) {
      return new MeleeAction(this.dx, this.dy).perform(engine, entity);
    } else {
      return new MovementAction(this.dx, this.dy).perform(engine, entity);
    }
  }
}

interface MovementMap {
  [key: string]: Action;
}

const MOVE_KEYS: MovementMap = {
  // Arrow Keys
  ArrowUp: new BumpAction(0, -1),
  ArrowDown: new BumpAction(0, 1),
  ArrowLeft: new BumpAction(-1, 0),
  ArrowRight: new BumpAction(1, 0),

  // Num Pad
  Numpad9: new BumpAction(1, -1), // move diagonally up and to the right
  Numpad8: new BumpAction(0, -1), // move up
  Numpad7: new BumpAction(-1, -1), // move diagonally up and to the left
  Numpad4: new BumpAction(-1, 0), // move left
  Numpad1: new BumpAction(-1, 1), // move diagonally down and to the left
  Numpad2: new BumpAction(0, 1), // move down
  Numpad3: new BumpAction(1, 1), // move diagonally down and to the right
  Numpad6: new BumpAction(1, 0), // move right
  Numpad5: new BumpAction(0, 0), // wait
};

export function handleInput(event: KeyboardEvent): Action {
  return MOVE_KEYS[event.code];
}

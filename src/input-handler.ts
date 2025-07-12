import { Engine } from "./engine";
import { Entity } from "./entity";

export interface Action {
  perform: (engine: Engine, entity: Entity) => void;
}

interface MovementMap {
  [key: string]: Action;
}

export class MovementAction implements Action {
  dx: number;
  dy: number;

  constructor(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  perform(engine: Engine, entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (!engine.gameMap.isInBounds(destX, destY)) return;
    if (!engine.gameMap.tiles[destY][destX].isWalkable) return;

    entity.move(this.dx, this.dy);
  }
}

const MOVE_KEYS: MovementMap = {
  // Arrow Keys
  ArrowUp: new MovementAction(0, -1),
  ArrowDown: new MovementAction(0, 1),
  ArrowLeft: new MovementAction(-1, 0),
  ArrowRight: new MovementAction(1, 0),

  // Num Pad
  Numpad9: new MovementAction(1, -1), // move diagonally up and to the right
  Numpad8: new MovementAction(0, -1), // move up
  Numpad7: new MovementAction(-1, -1), // move diagonally up and to the left
  Numpad4: new MovementAction(-1, 0), // move left
  Numpad1: new MovementAction(-1, 1), // move diagonally down and to the left
  Numpad2: new MovementAction(0, 1), // move down
  Numpad3: new MovementAction(1, 1), // move diagonally down and to the right
  Numpad6: new MovementAction(1, 0), // move right
  Numpad5: new MovementAction(0, 0), // wait
};

export function handleInput(event: KeyboardEvent): Action {
  return MOVE_KEYS[event.code];
}

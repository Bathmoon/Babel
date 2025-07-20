// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { Actor, Entity } from "./entity";
import { Colors } from "./ui/colors";
import { EngineState } from "./engine";

export interface Action {
  perform: (entity: Entity) => void;
}

export abstract class ActionWithDirection implements Action {
  dx: number;
  dy: number;

  constructor(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  perform(_entity: Entity) {}
}

export class WaitAction implements Action {
  perform(_entity: Entity) {}
}

export class MovementAction extends ActionWithDirection {
  perform(entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (!window.engine.gameMap.isInBounds(destX, destY)) return;
    if (!window.engine.gameMap.tiles[destY][destX].isWalkable) return;
    if (window.engine.gameMap.getBlockingEntityAtLocation(destX, destY)) return;

    if (debug) {
      console.log(`moving to ${destX}, ${destY}`);
    }

    entity.move(this.dx, this.dy);
  }
}

export class MeleeAction extends ActionWithDirection {
  perform(actor: Actor) {
    const destX = actor.x + this.dx;
    const destY = actor.y + this.dy;
    const target = window.engine.gameMap.getActorAtLocation(destX, destY);
    const log = window.engine.messageLog;

    if (!target) return;

    const damage = actor.fighter.power - target.fighter.defense;
    const description = `${actor.name.toUpperCase()} attacks ${target.name}`;
    const messageColor =
      actor.name === "Player" ? Colors.PlayerAttack : Colors.EnemyAttack;

    if (damage > 0) {
      log.addMessage(`${description} for ${damage} hit points.`, messageColor);
      target.fighter.hp -= damage;
    } else {
      log.addMessage(`${description} but does no damage.`, messageColor);
    }
  }
}

export class BumpAction extends ActionWithDirection {
  perform(entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (window.engine.gameMap.getActorAtLocation(destX, destY)) {
      return new MeleeAction(this.dx, this.dy).perform(entity as Actor);
    } else {
      return new MovementAction(this.dx, this.dy).perform(entity as Actor);
    }
  }
}

export class LogAction implements Action {
  perform(_entity: Entity) {
    window.engine.state = EngineState.Log;
  }
}

interface MovementMap {
  [key: string]: Action;
}

interface LogMap {
  [key: string]: number;
}

const LOG_KEYS: LogMap = {
  ArrowUp: -1,
  ArrowDown: 1,
  PageDown: 10,
  PageUp: -1,
};

const MOVE_KEYS: MovementMap = {
  // Arrow Keys
  ArrowUp: new BumpAction(0, -1),
  ArrowDown: new BumpAction(0, 1),
  ArrowLeft: new BumpAction(-1, 0),
  ArrowRight: new BumpAction(1, 0),
  Period: new WaitAction(), // wait
  V: new LogAction(), // change to verbose logging

  // Num Pad
  Numpad9: new BumpAction(1, -1), // move diagonally up and to the right
  Numpad8: new BumpAction(0, -1), // move up
  Numpad7: new BumpAction(-1, -1), // move diagonally up and to the left
  Numpad4: new BumpAction(-1, 0), // move left
  Numpad1: new BumpAction(-1, 1), // move diagonally down and to the left
  Numpad2: new BumpAction(0, 1), // move down
  Numpad3: new BumpAction(1, 1), // move diagonally down and to the right
  Numpad6: new BumpAction(1, 0), // move right
  Numpad5: new LogAction(), // testing option
};

export function handleGameInput(event: KeyboardEvent): Action {
  return MOVE_KEYS[event.code];
}

export function handleLogInput(event: KeyboardEvent): number {
  if (event.key === "Home") {
    window.engine.logCursorPosition = 0;
    return 0;
  }
  if (event.key === "End") {
    window.engine.logCursorPosition =
      window.engine.messageLog.messages.length - 1;
    return 0;
  }

  const scrollAmount = LOG_KEYS[event.key];

  if (!scrollAmount) {
    window.engine.state = EngineState.Game;
    return 0;
  }

  return scrollAmount;
}

import { Entity } from "../entity/entity";
import { type Action } from "./action";

export interface MovementMap {
  [key: string]: Action;
}

export class WaitAction implements Action {
  perform(_entity: Entity) {}
}

export abstract class ActionWithDirection implements Action {
  public dx: number;
  public dy: number;

  constructor(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  perform(_entity: Entity) {}
}

export class MovementAction extends ActionWithDirection {
  perform(entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (!window.engine.gameMap.isInBounds(destX, destY)) return;
    if (!window.engine.gameMap.tiles[destY][destX].isWalkable) return;
    if (window.engine.gameMap.getBlockingEntityAtLocation(destX, destY)) return;

    entity.move(this.dx, this.dy);
  }
}

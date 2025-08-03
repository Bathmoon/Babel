import { Engine } from "../engine";
import { Entity } from "../entity";
import { type Action } from "./action";

export interface MovementMap {
  [key: string]: Action;
}

export abstract class ActionWithDirection implements Action {
  public dx: number;
  public dy: number;

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

    entity.move(this.dx, this.dy);
  }
}

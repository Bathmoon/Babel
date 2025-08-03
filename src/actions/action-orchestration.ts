import { ActionWithDirection } from "./movement";
import { Engine } from "../engine";
import { Entity } from "../entity";
import { MeleeAction } from "./combat";
import { MovementAction } from "./movement";

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

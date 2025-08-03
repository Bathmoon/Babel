import { ActionWithDirection } from "./movement";
import { Entity } from "../entity/entity";
import { MeleeAction } from "./combat";
import { MovementAction } from "./movement";

export class BumpAction extends ActionWithDirection {
  perform(entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (window.engine.gameMap.getBlockingEntityAtLocation(destX, destY)) {
      return new MeleeAction(this.dx, this.dy).perform(entity);
    } else {
      return new MovementAction(this.dx, this.dy).perform(entity);
    }
  }
}

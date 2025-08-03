import { ActionWithDirection } from "./movement";
import { Entity } from "../entity/entity";

export class MeleeAction extends ActionWithDirection {
  perform(entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;
    const target = window.engine.gameMap.getBlockingEntityAtLocation(
      destX,
      destY,
    );

    if (!target) return;

    console.log(`You kick the ${target.name}, much to its annoyance!`);
  }
}

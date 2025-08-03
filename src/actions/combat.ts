import { ActionWithDirection } from "./movement";
import { Entity } from "../entity";
import { Engine } from "../engine";

export class MeleeAction extends ActionWithDirection {
  perform(engine: Engine, entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;
    const target = engine.gameMap.getBlockingEntityAtLocation(destX, destY);

    if (!target) return;

    console.log(`You kick the ${target.name}, much to its annoyance!`);
  }
}

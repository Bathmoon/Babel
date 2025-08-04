import { BaseRoutine } from "../routine";
import { Entity } from "../../entity/entity";
import { MeleeAction } from "../../actions/combat";
import { MovementAction, WaitAction } from "../../actions/movement";

export class SimpleHostileRoutine extends BaseRoutine {
  constructor() {
    super();
  }

  perform(entity: Entity) {
    const target = window.player;
    const dx = target.x - entity.x;
    const dy = target.y - entity.y;
    const distance = Math.max(Math.abs(dx), Math.abs(dy));

    if (window.engine.gameMap.tiles[entity.y][entity.x].isVisible) {
      if (distance <= 1) {
        return new MeleeAction(dx, dy).perform(entity);
      }

      this.calculatePathTo(target.x, target.y, entity);
    }

    if (this.path.length > 0) {
      const [destX, destY] = this.path[0];

      this.path.shift();

      return new MovementAction(destX - entity.x, destY - entity.y).perform(
        entity,
      );
    }

    return new WaitAction().perform(entity);
  }
}

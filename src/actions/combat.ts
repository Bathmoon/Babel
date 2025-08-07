import { ActionWithDirection } from "./movement";
import { Entity } from "../entity/entity";
import type { Attack } from "../components/statistics/attack";
import type { Defense } from "../components/statistics/defense";
import { Health } from "../components/statistics/health";
import { Colors } from "../rendering/colors";

export class MeleeAction extends ActionWithDirection {
  perform(entity: Entity) {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;
    const target = window.engine.gameMap.getActorAtLocation(destX, destY);
    const foreGroundColor =
      entity.name === "Player" ? Colors.PlayerAttack : Colors.EnemyAttack;

    if (!target) return;

    const attack = entity.getComponent<Attack>("attack")?.currentValue ?? 0;
    const defense = target.getComponent<Defense>("defense")?.currentValue ?? 0;
    const damage = attack - defense;
    const attackDescription = `${entity.name.toUpperCase()} attacks ${
      target.name
    }`;

    if (damage > 0) {
      console.log(`${attackDescription} for ${damage} hit points.`);
      window.engine.messageLog.addMessage(
        `${attackDescription} for ${damage} hit points.`,
        foreGroundColor,
      );
      target.getComponent<Health>("health")?.takeDamage(damage);
    } else {
      window.engine.messageLog.addMessage(
        `${attackDescription} but does no damage.`,
        foreGroundColor,
      );
    }
  }
}

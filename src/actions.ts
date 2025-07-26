import { debug } from "./configuration";

import { Actor, Entity, Item } from "./entity";
import { ImpossibleException } from "./exceptions";
import { Colors } from "./ui/colors";

export abstract class Action {
  abstract perform(entity: Entity): void;
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

    if (!window.engine.gameMap.isInBounds(destX, destY)) {
      throw new ImpossibleException("That way is blocked.");
    }

    if (!window.engine.gameMap.tiles[destY][destX].isWalkable) {
      throw new ImpossibleException("That way is blocked.");
    }

    if (window.engine.gameMap.getBlockingEntityAtLocation(destX, destY)) {
      throw new ImpossibleException("That way is blocked.");
    }

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

    if (!target) {
      throw new ImpossibleException("Nothing to attack.");
    }

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

export class PickupAction implements Action {
  perform(entity: Entity) {
    const consumer = entity as Actor;

    if (!consumer) return;

    const { x, y, inventory } = consumer;

    for (const item of window.engine.gameMap.items) {
      if (x === item.x && y == item.y) {
        if (inventory.items.length >= inventory.capacity) {
          throw new ImpossibleException("Your inventory is full.");
        }

        window.engine.gameMap.removeEntity(item);
        item.parent = inventory;
        inventory.items.push(item);

        window.engine.messageLog.addMessage(`You picked up the ${item.name}!`);
        return;
      }
    }

    throw new ImpossibleException("There is nothing here to pick up.");
  }
}

export class ItemAction extends Action {
  item: Item | null;
  targetPosition: [number, number] | null;

  constructor(
    item: Item | null,
    targetPosition: [number, number] | null = null,
  ) {
    super();

    this.targetPosition = targetPosition;
    this.item = item;
  }

  public get targetActor(): Actor | undefined {
    if (!this.targetPosition) {
      return;
    }

    const [x, y] = this.targetPosition;
    return window.engine.gameMap.getActorAtLocation(x, y);
  }

  perform(entity: Entity) {
    this.item?.consumable.activate(this, entity);
  }
}

export class DropItem extends ItemAction {
  perform(entity: Entity) {
    const dropper = entity as Actor;

    if (!dropper || !this.item) return;

    dropper.inventory.drop(this.item);
  }
}

export class LogAction implements Action {
  moveLog: () => void;

  constructor(moveLog: () => void) {
    this.moveLog = moveLog;
  }

  perform(_entity: Entity) {
    this.moveLog();
  }
}

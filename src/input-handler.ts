// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { Actor, Entity, Item } from "./entity";
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

    if (!window.engine.gameMap.isInBounds(destX, destY)) {
      window.engine.messageLog.addMessage(
        "That way is blocked.",
        Colors.Impossible,
      );
      throw new Error("That way is blocked.");
    }

    if (!window.engine.gameMap.tiles[destY][destX].isWalkable) {
      window.engine.messageLog.addMessage(
        "That way is blocked.",
        Colors.Impossible,
      );
      throw new Error("That way is blocked.");
    }

    if (window.engine.gameMap.getBlockingEntityAtLocation(destX, destY)) {
      window.engine.messageLog.addMessage(
        "That way is blocked.",
        Colors.Impossible,
      );
      throw new Error("That way is blocked.");
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
      window.engine.messageLog.addMessage(
        "Nothing to attack",
        Colors.Impossible,
      );
      throw new Error("Nothing to attack.");
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
          window.engine.messageLog.addMessage(
            "Your inventory is full.",
            Colors.Impossible,
          );

          throw new Error("Your inventory is full.");
        }

        window.engine.gameMap.removeEntity(item);
        item.parent = inventory;
        inventory.items.push(item);

        window.engine.messageLog.addMessage(`You picked up the ${item.name}!`);
        return;
      }
    }

    window.engine.messageLog.addMessage(
      "There is nothing here to pick up.",
      Colors.Impossible,
    );

    throw new Error("There is nothing here to pick up.");
  }
}

export class InventoryAction implements Action {
  isUsing: boolean;

  constructor(isUsing: boolean) {
    this.isUsing = isUsing;
  }

  perform(_entity: Entity) {
    window.engine.state = this.isUsing
      ? EngineState.UseInventory
      : EngineState.DropInventory;
  }
}

export class ItemAction implements Action {
  item: Item;

  constructor(item: Item) {
    this.item = item;
  }

  perform(entity: Entity) {
    this.item.consumable.activate(entity);
  }
}

class DropItem extends ItemAction {
  perform(entity: Entity) {
    const dropper = entity as Actor;

    if (!dropper) return;

    dropper.inventory.drop(this.item);
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

  // UI keys
  KeyV: new LogAction(),
  KeyG: new PickupAction(),
  KeyI: new InventoryAction(true),
  KeyD: new InventoryAction(false),
};

export function handleInventoryInput(event: KeyboardEvent): Action | null {
  let action = null;

  if (event.key.length === 1) {
    const ordinal = event.key.charCodeAt(0);
    const index = ordinal - "a".charCodeAt(0);

    if (index >= 0 && index <= 26) {
      const item = window.engine.player.inventory.items[index];

      if (item) {
        if (window.engine.state === EngineState.UseInventory) {
          action = item.consumable.getAction();
        } else if (window.engine.state === EngineState.DropInventory) {
          action = new DropItem(item);
        }
      } else {
        window.engine.messageLog.addMessage("Invalid entry.", Colors.Invalid);
        return null;
      }
    }
  }

  window.engine.state = EngineState.Game;

  return action;
}

export function handleGameInput(event: KeyboardEvent): Action {
  console.log("event code is " + event.code);
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

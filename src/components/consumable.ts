import { Actor, Entity, Item } from "../entity";
import { type Action, ItemAction } from "../actions";
import { Colors } from "../ui/colors";
import { Inventory } from "./inventory";

export abstract class Consumable {
  parent: Item | null;

  protected constructor(parent: Item | null) {
    this.parent = parent;
  }

  abstract activate(entity: Entity): void;

  getAction(): Action | null {
    if (this.parent) {
      return new ItemAction(this.parent);
    }

    return null;
  }

  consume() {
    const item = this.parent;

    if (item) {
      const inventory = item.parent;

      if (inventory instanceof Inventory) {
        const index = inventory.items.indexOf(item);

        if (index >= 0) {
          inventory.items.splice(index, 1);
        }
      }
    }
  }
}

export class HealingConsumable extends Consumable {
  amount: number;

  constructor(amount: number, parent: Item | null = null) {
    super(parent);
    this.amount = amount;
  }

  getAction(): Action | null {
    if (this.parent) {
      return new ItemAction(this.parent);
    }

    return null;
  }

  activate(entity: Entity) {
    const consumer = entity as Actor;

    if (!consumer) return;

    const amountRecovered = consumer.fighter.heal(this.amount);

    if (amountRecovered > 0) {
      window.engine.messageLog.addMessage(
        `You consume the ${this.parent?.name}, and recover ${amountRecovered} HP!`,
        Colors.HealthRecovered,
      );

      this.consume();
    } else {
      window.engine.messageLog.addMessage(
        "Your health is already full.",
        Colors.Impossible,
      );

      throw new Error("Your health is already full.");
    }
  }

  consume() {
    const item = this.parent;

    if (item) {
      const inventory = item.parent;

      if (inventory instanceof Inventory) {
        const index = inventory.items.indexOf(item);

        if (index >= 0) {
          inventory.items.splice(index, 1);
        }
      }
    }
  }
}

export class LightningConsumable extends Consumable {
  damage: number;
  maxRange: number;

  constructor(damage: number, maxRange: number, parent: Item | null = null) {
    super(parent);

    this.damage = damage;
    this.maxRange = maxRange;
  }

  activate(entity: Entity) {
    let target: Actor | null = null;
    let closestDistance = this.maxRange + 1.0;

    for (const actor of window.engine.gameMap.actors) {
      if (
        !Object.is(actor, entity) &&
        window.engine.gameMap.tiles[actor.y][actor.x].isVisible
      ) {
        const distance = entity.getDistanceTo(actor.x, actor.y);

        if (distance < closestDistance) {
          target = actor;
          closestDistance = distance;
        }
      }
    }

    if (target) {
      window.engine.messageLog.addMessage(
        `A lightning bolt strikes the ${target.name} with a loud thunder, for ${this.damage} damage!`,
      );

      target.fighter.takeDamage(this.damage);
      this.consume();
    } else {
      window.engine.messageLog.addMessage(
        "No enemy is close enough to strike.",
      );

      throw new Error("No enemy is close enough to strike.");
    }
  }
}

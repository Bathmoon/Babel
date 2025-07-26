import { Actor, Entity, Item } from "../entity";
import { Action, ItemAction } from "../actions";
import { Colors } from "../ui/colors";
import { Inventory } from "./inventory";
import {
  AreaRangedAttackHandler,
  SingleRangedAttackHandler,
} from "../input-handler";
import { ConfusedEnemy } from "./ai/confused-ai";
import { ImpossibleException } from "../exceptions";
import { GameMap } from "../game-map";

export abstract class Consumable {
  parent: Item | null;

  protected constructor(parent: Item | null) {
    this.parent = parent;
  }

  abstract activate(action: ItemAction, entity: Entity, gameMap: GameMap): void;

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

  activate(_action: ItemAction, entity: Entity) {
    const consumer = entity as Actor;

    if (!consumer) return;

    const amountRecovered = consumer.fighter.heal(this.amount);

    if (amountRecovered > 0) {
      window.messageLog.addMessage(
        `You consume the ${this.parent?.name}, and recover ${amountRecovered} HP!`,
        Colors.HealthRecovered,
      );

      this.consume();
    } else {
      throw new ImpossibleException("Your health is already full.");
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

  activate(_action: ItemAction, entity: Entity, gameMap: GameMap) {
    let target: Actor | null = null;
    let closestDistance = this.maxRange + 1.0;

    for (const actor of gameMap.actors) {
      if (
        !Object.is(actor, entity) &&
        gameMap.tiles[actor.y][actor.x].isVisible
      ) {
        const distance = entity.getDistanceTo(actor.x, actor.y);

        if (distance < closestDistance) {
          target = actor;
          closestDistance = distance;
        }
      }
    }

    if (target) {
      window.messageLog.addMessage(
        `A lightning bolt strikes the ${target.name} with a loud thunder, for ${this.damage} damage!`,
      );

      target.fighter.takeDamage(this.damage);
      this.consume();
    } else {
      throw new ImpossibleException("No enemy is close enough to strike.");
    }
  }
}

export class ConfusionConsumable extends Consumable {
  numberOfTurns: number;
  parent: Item | null;

  constructor(numberOfTurns: number, parent: Item | null = null) {
    super(parent);

    this.parent = parent;
    this.numberOfTurns = numberOfTurns;
  }

  getAction(): Action | null {
    window.messageLog.addMessage(
      "Select a target location.",
      Colors.NeedsTarget,
    );

    window.engine.view.inputHandler = new SingleRangedAttackHandler((x, y) => {
      return new ItemAction(this.parent, [x, y]);
    });

    return null;
  }

  activate(action: ItemAction, entity: Entity, gameMap: GameMap) {
    const target = action.targetActor(gameMap);

    if (!target) {
      throw new ImpossibleException("You must select an enemy to target.");
    }

    if (!gameMap.tiles[target.y][target.x].isVisible) {
      throw new ImpossibleException(
        "You cannot target an area you cannot see.",
      );
    }

    if (Object.is(target, entity)) {
      throw new ImpossibleException("You cannot confuse yourself!");
    }

    window.messageLog.addMessage(
      `The eyes of the ${target.name} look vacant, as it starts to stumble around!`,
      Colors.StatusEffectApplied,
    );

    target.ai = new ConfusedEnemy(target.ai, this.numberOfTurns);
    this.consume();
  }
}

export class FireballDamageConsumable extends Consumable {
  damage: number;
  radius: number;

  constructor(damage: number, radius: number, parent: Item | null = null) {
    super(parent);

    this.damage = damage;
    this.radius = radius;
  }

  getAction(): Action | null {
    window.messageLog.addMessage(
      "Select a target location.",
      Colors.NeedsTarget,
    );

    window.engine.view.inputHandler = new AreaRangedAttackHandler(
      this.radius,
      (x, y) => {
        return new ItemAction(this.parent, [x, y]);
      },
    );

    return null;
  }

  activate(action: ItemAction, _entity: Entity, gameMap: GameMap) {
    const { targetPosition } = action;
    let targetsHit = false;

    if (!targetPosition) {
      throw new ImpossibleException("You must select an area to target.");
    }

    const [x, y] = targetPosition;

    if (!gameMap.tiles[y][x].isVisible) {
      throw new ImpossibleException(
        "You cannot target an area that you cannot see.",
      );
    }

    for (let actor of gameMap.actors) {
      if (actor.getDistanceTo(x, y) <= this.radius) {
        window.messageLog.addMessage(
          `The ${actor.name} is engulfed in a fiery explosion, taking ${this.damage} damage!`,
        );

        actor.fighter.takeDamage(this.damage);
        targetsHit = true;
      }

      if (!targetsHit) {
        throw new ImpossibleException("There are no targets in the radius.");
      }

      this.consume();
    }
  }
}

// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { BaseAI } from "./components/ai";
import { HostileEnemy } from "./components/hostile-ai";
import { Fighter } from "./components/fighter";
import { GameMap } from "./game-map";
import { type Consumable, HealingConsumable } from "./components/consumable";
import { Inventory } from "./components/inventory";
import { BaseComponent } from "./components/base-component";

export const RenderOrder = {
  Corpse: 0,
  Item: 1,
  Actor: 2,
};

export class Entity {
  x: number;
  y: number;
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;
  name: string;
  blocksMovement: boolean;
  renderOrder: number;
  parent: GameMap | BaseComponent | null;

  constructor(
    x: number,
    y: number,
    symbol: string,
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    blocksMovement: boolean = false,
    renderOrder: number = RenderOrder.Corpse,
    parent: GameMap | BaseComponent | null = null,
  ) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.foreGroundColor = foreGroundColor;
    this.backGroundColor = backGroundColor;
    this.name = name;
    this.blocksMovement = blocksMovement;
    this.renderOrder = renderOrder;
    this.parent = parent;

    if (this.parent && this.parent instanceof GameMap) {
      this.parent.entities.push(this);
    }
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  place(x: number, y: number, gameMap: GameMap | undefined) {
    this.x = x;
    this.y = y;

    if (gameMap) {
      if (this.parent) {
        if (this.parent === gameMap) {
          gameMap.removeEntity(this);
        }
      }

      this.parent = gameMap;
      gameMap.entities.push(this);
    }
  }
}

export class Actor extends Entity {
  x: number;
  y: number;
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;
  name: string;
  ai: BaseAI | null;
  fighter: Fighter;
  inventory: Inventory;
  parent: GameMap | null = null;

  constructor(
    x: number,
    y: number,
    symbol: string,
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    ai: BaseAI | null,
    fighter: Fighter,
    inventory: Inventory,
    parent: GameMap | null = null,
  ) {
    super(
      x,
      y,
      symbol,
      foreGroundColor,
      backGroundColor,
      name,
      true,
      RenderOrder.Actor,
      parent,
    );
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.foreGroundColor = foreGroundColor;
    this.backGroundColor = backGroundColor;
    this.name = name;
    this.ai = ai;
    this.fighter = fighter;
    this.parent = parent;
    this.inventory = inventory;
    this.fighter.parent = this;
    this.inventory.parent = this;
  }

  get canAct(): boolean {
    return !!this.ai || window.engine.player === this;
  }
}

export class Item extends Entity {
  x: number;
  y: number;
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;
  name: string;
  consumable: Consumable;
  parent: GameMap | BaseComponent | null;

  constructor(
    x: number = 0,
    y: number = 0,
    symbol: string = "?",
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    consumable: Consumable,
    parent: GameMap | BaseComponent | null,
  ) {
    super(
      x,
      y,
      symbol,
      foreGroundColor,
      backGroundColor,
      name,
      false,
      RenderOrder.Item,
      parent,
    );
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.foreGroundColor = foreGroundColor;
    this.backGroundColor = backGroundColor;
    this.name = name;
    this.consumable = consumable;
    this.parent = parent;
    this.consumable.parent = this;
  }
}

export function spawnPlayer(
  x: number,
  y: number,
  gameMap: GameMap | null = null,
): Actor {
  return new Actor(
    x,
    y,
    "@",
    "#fff",
    "#000",
    "Player",
    null,
    new Fighter(30, 2, 5),
    new Inventory(26),
    gameMap,
  );
}

export function spawnOrc(gameMap: GameMap, x: number, y: number): Actor {
  return new Actor(
    x,
    y,
    "o",
    "#3f7f3f",
    "#000",
    "Orc",
    new HostileEnemy(),
    new Fighter(10, 0, 3),
    new Inventory(0),
    gameMap,
  );
}

export function spawnTroll(gameMap: GameMap, x: number, y: number): Actor {
  return new Actor(
    x,
    y,
    "T",
    "#007f00",
    "#000",
    "Troll",
    new HostileEnemy(),
    new Fighter(16, 1, 4),
    new Inventory(0),
    gameMap,
  );
}

export function spawnHealthPotion(
  gameMap: GameMap,
  x: number,
  y: number,
): Entity {
  return new Item(
    x,
    y,
    "!",
    "#7F00FF",
    "#000",
    "Health Potion",
    new HealingConsumable(4),
    gameMap,
  );
}

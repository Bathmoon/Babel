import { BaseAI } from "./components/ai/ai";
import { HostileEnemy } from "./components/ai/hostile-ai";
import { Fighter } from "./components/fighter";
import { Level } from "./components/level";
import { GameMap } from "./game-map";
import {
  type Consumable,
  HealingConsumable,
  LightningConsumable,
  FireballDamageConsumable,
} from "./components/consumable";
import {
  Dagger,
  ChainMail,
  LeatherArmor,
  Sword,
} from "./components/equippable";
import { Inventory } from "./components/inventory";
import { BaseComponent } from "./components/base-component";
import { ConfusionConsumable } from "./components/consumable";
import type { Equippable } from "./components/equippable";
import { Equipment } from "./components/equipment";

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

  getDistanceTo(x: number, y: number) {
    return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
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
  equipment: Equipment;
  fighter: Fighter;
  inventory: Inventory;
  level: Level;
  parent: GameMap | null = null;

  constructor(
    x: number,
    y: number,
    symbol: string,
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    ai: BaseAI | null,
    equipment: Equipment,
    fighter: Fighter,
    inventory: Inventory,
    level: Level,
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
    this.equipment = equipment;
    this.fighter = fighter;
    this.parent = parent;
    this.inventory = inventory;
    this.fighter.parent = this;
    this.level = level;
    this.inventory.parent = this;
    this.equipment.parent = this;
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
  consumable: Consumable | null;
  equippable: Equippable | null;
  parent: GameMap | BaseComponent | null;

  constructor(
    x: number = 0,
    y: number = 0,
    symbol: string = "?",
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    consumable: Consumable | null,
    equippable: Equippable | null,
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
    this.equippable = equippable;
    this.parent = parent;

    if (this.consumable) {
      this.consumable.parent = this;
    }

    if (this.equippable) {
      this.equippable.parent = this;
    }
  }
}

// SPAWNING FUNCTIONS

export function spawnPlayer(
  x: number,
  y: number,
  gameMap: GameMap | null = null,
): Actor {
  const player = new Actor(
    x,
    y,
    "@",
    "#fff",
    "#000",
    "Player",
    null,
    new Equipment(),
    new Fighter(30, 2, 5),
    new Inventory(26),
    new Level(20),
    gameMap,
  );

  player.level.parent = player;
  return player;
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
    new Equipment(),
    new Fighter(10, 0, 3),
    new Inventory(0),
    new Level(0, 35),
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
    new Equipment(),
    new Fighter(16, 1, 4),
    new Inventory(0),
    new Level(0, 100),
    gameMap,
  );
}

export function spawnHealthPotion(
  gameMap: GameMap,
  x: number,
  y: number,
): Item {
  return new Item(
    x,
    y,
    "!",
    "#7F00FF",
    "#000",
    "Health Potion",
    new HealingConsumable(4),
    null,
    gameMap,
  );
}

export function spawnLightningScroll(
  gameMap: GameMap,
  x: number,
  y: number,
): Item {
  return new Item(
    x,
    y,
    "~",
    "#FFFF00",
    "#000",
    "Lightning Scroll",
    new LightningConsumable(20, 5),
    null,
    gameMap,
  );
}

export function spawnConfusionScroll(
  gameMap: GameMap,
  x: number,
  y: number,
): Item {
  return new Item(
    x,
    y,
    "~",
    "#cf3fff",
    "#000",
    "Confusion Scroll",
    new ConfusionConsumable(10),
    null,
    gameMap,
  );
}

export function spawnFireballScroll(
  gameMap: GameMap,
  x: number,
  y: number,
): Item {
  return new Item(
    x,
    y,
    "~",
    "#ff0000",
    "#000",
    "Fireball Scroll",
    new FireballDamageConsumable(12, 3),
    null,
    gameMap,
  );
}

export function spawnDagger(gameMap: GameMap, x: number, y: number): Item {
  return new Item(
    x,
    y,
    "/",
    "#00bfff",
    "#000",
    "Dagger",
    null,
    new Dagger(),
    gameMap,
  );
}

export function spawnSword(gameMap: GameMap, x: number, y: number): Item {
  return new Item(
    x,
    y,
    "/",
    "#00bfff",
    "#000",
    "Sword",
    null,
    new Sword(),
    gameMap,
  );
}

export function spawnLeatherArmor(
  gameMap: GameMap,
  x: number,
  y: number,
): Item {
  return new Item(
    x,
    y,
    "[",
    "#8b4513",
    "#000",
    "Leather Armor",
    null,
    new LeatherArmor(),
    gameMap,
  );
}

export function spawnChainMail(gameMap: GameMap, x: number, y: number): Item {
  return new Item(
    x,
    y,
    "[",
    "#8b4513",
    "#000",
    "Chain Mail",
    null,
    new ChainMail(),
    gameMap,
  );
}

type SPAWNMAP = {
  [key: string]: (gameMap: GameMap, x: number, y: number) => Entity;
};

export const spawnMap: SPAWNMAP = {
  spawnOrc,
  spawnTroll,
  spawnHealthPotion,
  spawnConfusionScroll,
  spawnLightningScroll,
  spawnFireballScroll,
  spawnDagger,
  spawnSword,
  spawnLeatherArmor,
  spawnChainMail,
};

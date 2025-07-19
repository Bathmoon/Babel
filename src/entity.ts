// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { BaseAI } from "./components/ai";
import { HostileEnemy } from "./components/hostile-ai";
import { Fighter } from "./components/fighter";

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

  constructor(
    x: number,
    y: number,
    symbol: string,
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    blocksMovement: boolean = false,
    renderOrder: number = RenderOrder.Corpse,
  ) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.foreGroundColor = foreGroundColor;
    this.backGroundColor = backGroundColor;
    this.name = name;
    this.blocksMovement = blocksMovement;
    this.renderOrder = renderOrder;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
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

  constructor(
    x: number,
    y: number,
    symbol: string,
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    ai: BaseAI | null,
    fighter: Fighter,
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
    );
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.foreGroundColor = foreGroundColor;
    this.backGroundColor = backGroundColor;
    this.name = name;
    this.ai = ai;
    this.fighter = fighter;
    this.fighter.entity = this;
  }

  get canAct(): boolean {
    return !!this.ai || window.engine.player === this;
  }
}

export function spawnPlayer(x: number, y: number): Actor {
  return new Actor(
    x,
    y,
    "@",
    "#fff",
    "#000",
    "Player",
    null,
    new Fighter(30, 2, 5),
  );
}

export function spawnOrc(x: number, y: number): Actor {
  return new Actor(
    x,
    y,
    "o",
    "#3f7f3f",
    "#000",
    "Orc",
    new HostileEnemy(),
    new Fighter(10, 0, 3),
  );
}

export function spawnTroll(x: number, y: number): Actor {
  return new Actor(
    x,
    y,
    "T",
    "#007f00",
    "#000",
    "Troll",
    new HostileEnemy(),
    new Fighter(16, 1, 4),
  );
}

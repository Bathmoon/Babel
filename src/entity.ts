export class Entity {
  x: number;
  y: number;
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;
  name: string;
  blocksMovement: boolean;

  constructor(
    x: number,
    y: number,
    symbol: string,
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
    name: string = "<Unnamed>",
    blocksMovement: boolean = false,
  ) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.foreGroundColor = foreGroundColor;
    this.backGroundColor = backGroundColor;
    this.name = name;
    this.blocksMovement = blocksMovement;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
}

export function spawnPlayer(x: number, y: number): Entity {
  return new Entity(x, y, "@", "#fff", "#000", "Player", true);
}

export function spawnOrc(x: number, y: number): Entity {
  return new Entity(x, y, "o", "#3f7f3f", "#000", "Orc", true);
}

export function spawnTroll(x: number, y: number): Entity {
  return new Entity(x, y, "T", "#007f00", "#000", "Troll", true);
}

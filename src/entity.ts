export class Entity {
  x: number;
  y: number;
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;

  constructor(
    x: number,
    y: number,
    symbol: string,
    foreGroundColor: string = "#fff",
    backGroundColor: string = "#000",
  ) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.foreGroundColor = foreGroundColor;
    this.backGroundColor = backGroundColor;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
}

import type { Tile } from "./tile-types";
import { WALL_TILE } from "./tile-types";
import { Display } from "rot-js";

export class GameMap {
  width: number;
  height: number;
  display: Display;

  tiles: Tile[][];

  constructor(width: number, height: number, display: Display) {
    this.width = width;
    this.height = height;
    this.display = display;
    this.tiles = new Array(this.height);

    for (let y = 0; y < this.height; y++) {
      const row = new Array(this.width);

      for (let x = 0; x < this.width; x++) {
        row[x] = { ...WALL_TILE };
      }

      this.tiles[y] = row;
    }
  }

  isInBounds(x: number, y: number) {
    return 0 <= x && x < this.width && 0 <= y && y < this.height;
  }

  // currentX and currentY are relative to the entire map
  addRoom(x: number, y: number, roomTiles: Tile[][]) {
    const relativeHeight = y + roomTiles.length;

    for (let currentY = y; currentY < relativeHeight; currentY++) {
      const roomY = currentY - y;
      const mapRow = this.tiles[currentY];
      const roomRow = roomTiles[roomY];
      const relativeWidth = x + roomRow.length;

      for (let currentX = x; currentX < relativeWidth; currentX++) {
        const roomX = currentX - x;

        mapRow[currentX] = roomRow[roomX];
      }
    }
  }

  render() {
    for (let y = 0; y < this.tiles.length; y++) {
      const row = this.tiles[y];

      for (let x = 0; x < row.length; x++) {
        const tile = row[x];

        this.display.draw(
          x,
          y,
          tile.dark.symbol,
          tile.dark.foreGroundColor,
          tile.dark.backGroundColor,
        );
      }
    }
  }
}

import * as ROT from "rot-js";

import type { Tile } from "./tiles/tile";
import { TILES } from "./tiles/tile";
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
        row[x] = { ...TILES.WALL_TILE };
      }

      this.tiles[y] = row;
    }
  }

  isInBounds(x: number, y: number) {
    return 0 <= x && x < this.width && 0 <= y && y < this.height;
  }

  addRoom(x: number, y: number, roomTiles: Tile[][]) {
    for (let curY = y; curY < y + roomTiles.length; curY++) {
      const mapRow = this.tiles[curY];
      const roomRow = roomTiles[curY - y];
      for (let curX = x; curX < x + roomRow.length; curX++) {
        mapRow[curX] = roomRow[curX - x];
      }
    }
  }

  canLightPass(x: number, y: number): boolean {
    if (this.isInBounds(x, y)) {
      return this.tiles[y][x].isTransparent;
    }

    return false;
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

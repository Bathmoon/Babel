import * as ROT from "rot-js";

import type { Tile } from "./tile-types";
import { WALL_TILE } from "./tile-types";
import { Display } from "rot-js";
import { Entity } from "./entity";

export class GameMap {
  width: number;
  height: number;
  display: Display;
  entities: Entity[];

  tiles: Tile[][];

  constructor(
    width: number,
    height: number,
    display: Display,
    entities: Entity[],
  ) {
    this.width = width;
    this.height = height;
    this.display = display;
    this.tiles = new Array(this.height);
    this.entities = entities;

    for (let y = 0; y < this.height; y++) {
      const row = new Array(this.width);

      for (let x = 0; x < this.width; x++) {
        row[x] = { ...WALL_TILE };
        row[x].position = [x, y];
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
        mapRow[currentX].roomPosition = [roomX, roomY];
      }
    }
  }

  lightPasses(x: number, y: number): boolean {
    // Make sure we don't try to check tiles that don't exist, being outside the map area
    if (this.isInBounds(x, y)) {
      return this.tiles[y][x].isTransparent;
    }

    return false;
  }

  updateFov(player: Entity) {
    const fov = new ROT.FOV.PreciseShadowcasting(this.lightPasses.bind(this));
    const viewDistance = 8;

    // Reset visibility prior to checking
    this.setTilesInvisible();

    fov.compute(player.x, player.y, viewDistance, (x, y, _r, isVisible) => {
      if (isVisible === 1) {
        if (x in this.tiles && y in this.tiles[x]) {
          this.tiles[y][x].isVisible = true;
          this.tiles[y][x].isSeen = true;
        } else {
          console.log(player);
          console.log(`Array out of bounds error at ${x}, ${y}`);
        }
      }
    });
  }

  setTilesInvisible() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x].isVisible = false;
      }
    }
  }

  render() {
    for (let y = 0; y < this.tiles.length; y++) {
      const row = this.tiles[y];

      for (let x = 0; x < row.length; x++) {
        const tile = row[x];

        let symbol = " ";
        let foreGroundColor = "#fff";
        let backGroundColor = "#000";

        if (tile.isVisible) {
          symbol = tile.light.symbol;
          foreGroundColor = tile.light.foreGroundColor;
          backGroundColor = tile.light.backGroundColor;
        } else if (tile.isSeen) {
          symbol = tile.dark.symbol;
          foreGroundColor = tile.dark.foreGroundColor;
          backGroundColor = tile.dark.backGroundColor;
        }

        this.display.draw(x, y, symbol, foreGroundColor, backGroundColor);
      }
    }

    this.entities.forEach((entity) => {
      this.display.draw(
        entity.x,
        entity.y,
        entity.symbol,
        entity.foreGroundColor,
        entity.backGroundColor,
      );
    });
  }
}

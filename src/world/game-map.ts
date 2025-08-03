import * as ROT from "rot-js";

import { Entity } from "../entity";
import type { Tile } from "../tiles/tile";
import { TILES } from "../tiles/tile";
import { Display } from "rot-js";

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

    this.entities = entities;
    this.tiles = new Array(this.height);

    for (let y = 0; y < this.height; y++) {
      const row = new Array(this.width);

      for (let x = 0; x < this.width; x++) {
        row[x] = { ...TILES.WALL_TILE };
      }

      this.tiles[y] = row;
    }
  }

  public get nonPlayerEntities(): Entity[] {
    return this.entities.filter((entity) => entity.name !== "Player");
  }

  getBlockingEntityAtLocation(x: number, y: number): Entity | undefined {
    return this.entities.find(
      (entity) => entity.blocksMovement && entity.x === x && entity.y === y,
    );
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

  updateFov(player: Entity) {
    // Set all tiles to not visible to ensure that as we move, we don't keep tiles incorrectly lit
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x].isVisible = false;
      }
    }

    const fov = new ROT.FOV.PreciseShadowcasting(this.canLightPass.bind(this));

    fov.compute(
      player.x,
      player.y,
      player.sightRange,
      (x, y, _r, visibility) => {
        if (visibility === 1) {
          // Set any tiles in range to visible, also mark them as having been seen
          this.tiles[y][x].isVisible = true;
          this.tiles[y][x].isSeen = true;
        }
      },
    );
  }

  render() {
    for (let y = 0; y < this.tiles.length; y++) {
      const row = this.tiles[y];

      for (let x = 0; x < row.length; x++) {
        const tile = row[x];

        let symbol = tile.isVisible ? tile.light.symbol : tile.dark.symbol;
        let foreGroundColor = tile.isVisible
          ? tile.light.foreGroundColor
          : tile.dark.foreGroundColor;
        let backGroundColor = tile.isVisible
          ? tile.light.backGroundColor
          : tile.dark.backGroundColor;

        // draw tiles
        this.display.draw(x, y, symbol, foreGroundColor, backGroundColor);

        // draw entities
        this.entities.forEach((entity) => {
          if (this.tiles[entity.y][entity.x].isVisible || window.debug) {
            this.display.draw(
              entity.x,
              entity.y,
              entity.symbol,
              entity.foreGroundColor,
              entity.backGroundColor,
            );
          }

          entity.emitCoordinates();
        });
      }
    }
  }
}

import * as ROT from "rot-js";

// Set debug mode in the configuration.ts

import type { Tile } from "./tile-types";
import { WALL_TILE } from "./tile-types";
import { Display } from "rot-js";
import { Actor, Entity, Item } from "./entity";

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

  public get gameMap(): GameMap {
    return this;
  }

  public get nonPlayerEntities(): Entity[] {
    return this.entities.filter((entity) => entity.name !== "Player");
  }

  public get items(): Item[] {
    return this.entities.filter((e) => e instanceof Item).map((e) => e as Item);
  }

  public get actors(): Actor[] {
    return this.entities
      .filter((entity) => entity instanceof Actor)
      .map((entity) => entity as Actor)
      .filter((actor) => actor.canAct);
  }

  getActorAtLocation(x: number, y: number): Actor | undefined {
    return this.actors.find((actor) => actor.x === x && actor.y === y);
  }

  getBlockingEntityAtLocation(x: number, y: number): Entity | undefined {
    return this.entities.find(
      (entity) => entity.blocksMovement && entity.x === x && entity.y === y,
    );
  }

  isInBounds(x: number, y: number) {
    return 0 <= x && x < this.width && 0 <= y && y < this.height;
  }

  removeEntity(entity: Entity) {
    const index = this.entities.indexOf(entity);
    if (index >= 0) {
      this.entities.splice(index, 1);
    }
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

        if (this.isInBounds(currentX, currentY)) {
          mapRow[currentX] = roomRow[roomX];
          mapRow[currentX].roomPosition = [roomX, roomY];
        }
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
      if (isVisible === 1 && this.isInBounds(x, y)) {
        this.tiles[y][x].isVisible = true;
        this.tiles[y][x].isSeen = true;
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

    const sortedEntities = this.entities
      .slice() // copies the array so we don't sort the original
      .sort((a, b) => a.renderOrder - b.renderOrder);

    sortedEntities.forEach((entity) => {
      if (this.tiles[entity.y][entity.x].isVisible) {
        this.display.draw(
          entity.x,
          entity.y,
          entity.symbol,
          entity.foreGroundColor,
          entity.backGroundColor,
        );
      }
    });
  }
}

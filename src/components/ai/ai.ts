import * as ROT from "rot-js";

import { Action, BumpAction } from "../../actions";
import { generateRandomNumber } from "../../generation";
import { Entity } from "../../entity";
import { Actor } from "../../entity";
import { GameMap } from "../../game-map";

export abstract class BaseAI implements Action {
  path: [number, number][];

  constructor() {
    this.path = [];
  }

  abstract perform(_entity: Entity, _gameMap: GameMap): void;

  /**
   * Compute and return a path to the target position.
   *
   * If there is no valid path then return an empty list.
   *
   * @param destX
   * @param destY
   * @param entity
   */
  calculatePathTo(
    destX: number,
    destY: number,
    entity: Entity,
    gameMap: GameMap,
  ) {
    const isPassable = (x: number, y: number) => gameMap.tiles[y][x].isWalkable;
    const dijkstra = new ROT.Path.Dijkstra(destX, destY, isPassable, {});

    this.path = [];

    dijkstra.compute(entity.x, entity.y, (x: number, y: number) => {
      this.path.push([x, y]);
    });
    this.path.shift(); // Remove the first element of the path, because it is the starting location - otherwise we'll just stay there
  }
}

export const directions: [number, number][] = [
  [-1, -1], // Northwest
  [0, -1], // North
  [1, -1], // Northeast
  [-1, 0], // West
  [1, 0], // East
  [-1, 1], // Southwest
  [0, 1], // South
  [1, 1], // Southeast
];

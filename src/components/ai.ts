import * as ROT from "rot-js";

// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "../configuration";

import { type Action } from "../input-handler";
import { Entity } from "../entity";

export abstract class BaseAI implements Action {
  path: [number, number][];

  constructor() {
    this.path = [];
  }

  perform(_entity: Entity) {}

  /**
   * Compute and return a path to the target position.
   *
   * If there is no valid path then return an empty list.
   *
   * @param destX
   * @param destY
   * @param entity
   */
  calculatePathTo(destX: number, destY: number, entity: Entity) {
    const isPassable = (x: number, y: number) =>
      window.engine.gameMap.tiles[y][x].isWalkable;
    const dijkstra = new ROT.Path.Dijkstra(destX, destY, isPassable, {});

    this.path = [];

    dijkstra.compute(entity.x, entity.y, (x: number, y: number) => {
      this.path.push([x, y]);
    });
    this.path.shift(); // Remove the first element of the path, because it is the starting location - otherwise we'll just stay there
  }
}

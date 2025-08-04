import * as ROT from "rot-js";

import { Action } from "../actions/action";
import { MeleeAction } from "../actions/combat";
import { MovementAction, WaitAction } from "../actions/movement";
import { Entity } from "../entity/entity";

export abstract class BaseRoutine implements Action {
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

    this.path.shift();
  }
}

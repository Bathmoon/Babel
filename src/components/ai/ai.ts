import * as ROT from "rot-js";

// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "../../configuration";

import {
  Action,
  BumpAction,
  MeleeAction,
  MovementAction,
  WaitAction,
} from "../../actions";
import { generateRandomNumber } from "../../generation";
import { Entity } from "../../entity";
import { Actor } from "../../entity";

export abstract class BaseAI implements Action {
  path: [number, number][];

  constructor() {
    this.path = [];
  }

  abstract perform(_entity: Entity): void;

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

export class ConfusedEnemy extends BaseAI {
  previousAi: BaseAI | null;
  turnsRemaining: number;

  constructor(previousAi: BaseAI | null, turnsRemaining: number) {
    super();

    this.previousAi = previousAi;
    this.turnsRemaining = turnsRemaining;
  }

  perform(entity: Entity) {
    const actor = entity as Actor;

    if (!actor) return;

    if (this.turnsRemaining <= 0) {
      window.engine.messageLog.addMessage(
        `The ${entity.name} is no longer confused.`,
      );

      actor.ai = this.previousAi;
    } else {
      const [directionX, directionY] =
        directions[generateRandomNumber(0, directions.length)];
      const action = new BumpAction(directionX, directionY);

      this.turnsRemaining -= 1;
      action.perform(entity);
    }
  }
}

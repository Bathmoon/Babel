import { BaseAI, directions } from "./ai";
import { Entity } from "../../entity";
import { Actor } from "../../entity";
import { generateRandomNumber } from "../../generation";
import { BumpAction } from "../../actions";
import { GameMap } from "../../game-map";

export class ConfusedEnemy extends BaseAI {
  previousAi: BaseAI | null;
  turnsRemaining: number;

  constructor(previousAi: BaseAI | null, turnsRemaining: number) {
    super();

    this.previousAi = previousAi;
    this.turnsRemaining = turnsRemaining;
  }

  perform(entity: Entity, gameMap: GameMap) {
    const actor = entity as Actor;

    if (!actor) return;

    if (this.turnsRemaining <= 0) {
      window.messageLog.addMessage(`The ${entity.name} is no longer confused.`);

      actor.ai = this.previousAi;
    } else {
      const [directionX, directionY] =
        directions[generateRandomNumber(0, directions.length)];
      const action = new BumpAction(directionX, directionY);

      this.turnsRemaining -= 1;
      action.perform(entity, gameMap);
    }
  }
}

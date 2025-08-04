import * as ROT from "rot-js";

import { handleInput } from "./input-handler";
import { Coordinate } from "./components/coordinate";
import { Entity } from "./entity/entity";
import { Events } from "./eventSystem";
import { GameMap } from "./world/game-map";
import { generateDungeon } from "./procedural/generation";

export class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;
  public static readonly MAP_WIDTH = 80;
  public static readonly MAP_HEIGHT = 45;
  public static readonly MIN_ROOM_SIZE = 6;
  public static readonly MAX_ROOM_SIZE = 10;
  public static readonly MAX_ROOMS = 30;
  public static readonly MAX_MONSTERS_PER_ROOM = 2;

  display: ROT.Display;
  gameMap: GameMap;

  constructor() {
    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT,
      forceSquareRatio: true,
    });
    const container = this.display.getContainer()!;
    document.body.appendChild(container);

    this.gameMap = generateDungeon(
      Engine.MAP_WIDTH,
      Engine.MAP_HEIGHT,
      Engine.MAX_ROOMS,
      Engine.MIN_ROOM_SIZE,
      Engine.MAX_ROOM_SIZE,
      Engine.MAX_MONSTERS_PER_ROOM,
      this.display,
    );

    window.addEventListener("keydown", (event) => {
      this.update(event);
    });

    if (window.verboseDebug) {
      Events.on("entityPosition", (coordinate: Coordinate) => {
        console.log("Entity at position: " + coordinate);
      });
    }

    this.gameMap.updateFov(window.player); // update fov for the first time or it wont happen till updating
    this.render();
  }

  handleEnemyTurns() {
    this.gameMap.nonPlayerEntities.forEach((entity) => {
      console.log(
        `The ${entity.name} wonders when it will get to take a real turn.`,
      );

      if (entity.canPerform()) {
        entity.perform();
      }
    });
  }

  update(event: KeyboardEvent) {
    this.display.clear();
    const action = handleInput(event);

    if (action) {
      action.perform(window.player);
    }

    this.handleEnemyTurns();
    this.gameMap.updateFov(window.player);
    this.render();
  }

  render() {
    this.gameMap.render();
  }
}

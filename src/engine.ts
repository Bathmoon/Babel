import * as ROT from "rot-js";

import { handleInput } from "./input-handler";
import { Entity } from "./entity";
import { GameMap } from "./game-map";
import { generateDungeon } from "./generation";

export class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;
  public static readonly MAP_WIDTH = 80;
  public static readonly MAP_HEIGHT = 45;

  display: ROT.Display;
  gameMap: GameMap;

  player: Entity;
  entities: Entity[];

  constructor(entities: Entity[], player: Entity) {
    this.entities = entities;
    this.player = player;

    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT,
      forceSquareRatio: true,
    });

    this.gameMap = generateDungeon(
      Engine.MAP_WIDTH,
      Engine.MAP_HEIGHT,
      10,
      5,
      20,
      player,
      this.display,
    );

    const container = this.display.getContainer()!;

    document.body.appendChild(container);

    window.addEventListener("keydown", (event) => {
      this.update(event);
    });

    this.gameMap.updateFov(this.player);
    this.render();
  }

  update(event: KeyboardEvent) {
    const action = handleInput(event);

    if (action) {
      action.perform(this, this.player);
    }

    this.display.clear();
    this.gameMap.updateFov(this.player);
    this.render();
  }

  render() {
    this.gameMap.render();
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

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
  public static readonly MAX_MONSTERS_PER_ROOM = 2;

  display: ROT.Display;
  gameMap: GameMap;

  player: Entity;

  constructor(player: Entity) {
    this.player = player;

    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT,
      forceSquareRatio: true,
    });

    this.gameMap = generateDungeon(
      Engine.MAP_WIDTH,
      Engine.MAP_HEIGHT,
      10, // max rooms
      5, // min size
      20, // max size
      Engine.MAX_MONSTERS_PER_ROOM,
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
  }
}

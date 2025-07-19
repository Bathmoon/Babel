import * as ROT from "rot-js";

// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { handleInput } from "./input-handler";
import { Actor } from "./entity";
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

  player: Actor;

  constructor(player: Actor) {
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

  handleEnemyTurns() {
    this.gameMap.actors.forEach((actor) => {
      if (debug) {
        console.log(`The ${actor.name} should take a turn`);
      }

      if (actor.canAct) {
        actor.ai?.perform(actor);
      }
    });
  }

  update(event: KeyboardEvent) {
    const action = handleInput(event);

    if (action && this.player.fighter.hp > 0) {
      action.perform(this.player);
    }

    this.display.clear();
    this.handleEnemyTurns();
    this.gameMap.updateFov(this.player);
    this.render();
  }

  render() {
    this.display.drawText(
      1,
      47, // %c for foreground color, %b for background
      `HP: %c{red}%b{white}${this.player.fighter.hp}/%c{green}%b{white}${this.player.fighter.maxHp}`,
    );
    this.gameMap.render();
  }
}

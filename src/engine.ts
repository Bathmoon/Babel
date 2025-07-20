import * as ROT from "rot-js";

// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { handleGameInput, handleLogInput } from "./input-handler";
import { Actor } from "./entity";
import { GameMap } from "./game-map";
import { generateDungeon } from "./generation";
import { MessageLog } from "./ui/message-log";
import { Colors } from "./ui/colors";

import {
  renderHealthBar,
  renderNamesAtLocation,
  renderFrameWithTitle,
} from "./ui/rendering";

export const EngineState = {
  Game: 0,
  Dead: 1,
  Log: 2,
};

export class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;
  public static readonly MAP_WIDTH = 80;
  public static readonly MAP_HEIGHT = 43;
  public static readonly MAX_MONSTERS_PER_ROOM = 2;

  display: ROT.Display;
  gameMap: GameMap;
  messageLog: MessageLog;
  mousePosition: [number, number];

  player: Actor;

  _state: number;
  logCursorPosition: number;

  constructor(player: Actor) {
    this._state = EngineState.Game;
    this.logCursorPosition = 0;
    this.player = player;

    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT,
      forceSquareRatio: true,
    });

    this.mousePosition = [0, 0];
    this.messageLog = new MessageLog();

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

    this.messageLog.addMessage(
      "Hello and welcome, adventurer, to yet another dungeon!",
      Colors.WelcomeText,
    );

    window.addEventListener("keydown", (event) => {
      this.update(event);
    });
    window.addEventListener("mousemove", (event) => {
      this.mousePosition = this.display.eventToPosition(event);
      this.render();
    });

    this.gameMap.updateFov(this.player);
  }

  public get state() {
    return this._state;
  }

  public set state(state: number) {
    this._state = state;
    this.logCursorPosition = this.messageLog.messages.length - 1;
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
    if (this.state === EngineState.Game) {
      this.updateGameloop(event);
    } else if (this.state === EngineState.Log) {
      this.updateLogLoop(event);
    }

    this.render();
  }

  updateGameloop(event: KeyboardEvent) {
    if (this.player.fighter.hp > 0) {
      const action = handleGameInput(event);

      if (action) {
        action.perform(this.player);

        if (this.state === EngineState.Game) {
          this.handleEnemyTurns();
        }
      }
    }

    this.gameMap.updateFov(this.player);
  }

  updateLogLoop(event: KeyboardEvent) {
    const scrollAmount = handleLogInput(event);
    if (scrollAmount < 0 && this.logCursorPosition === 0) {
      this.logCursorPosition = this.messageLog.messages.length - 1;
    } else if (
      scrollAmount > 0 &&
      this.logCursorPosition === this.messageLog.messages.length - 1
    ) {
      this.logCursorPosition = 0;
    } else {
      this.logCursorPosition = Math.max(
        0,
        Math.min(
          this.logCursorPosition + scrollAmount,
          this.messageLog.messages.length - 1,
        ),
      );
    }
  }

  render() {
    this.display.clear();
    this.messageLog.render(this.display, 21, 45, 40, 5);

    renderHealthBar(
      this.display,
      this.player.fighter.hp,
      this.player.fighter.maxHp,
      Engine.MAP_WIDTH / 4,
    );

    renderNamesAtLocation(21, 44);

    this.gameMap.render();

    if (this.state === EngineState.Log) {
      renderFrameWithTitle(3, 3, 74, 38, "Log History");
      this.messageLog.renderMessages(
        this.display,
        4,
        4,
        72,
        36,
        this.messageLog.messages.slice(0, this.logCursorPosition + 1),
      );
    }
  }
}

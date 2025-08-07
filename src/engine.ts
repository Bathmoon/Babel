import * as ROT from "rot-js";

import { handleGameInput, handleLogInput } from "./input-handler";
import { Coordinate } from "./components/coordinate";
import { Entity } from "./entity/entity";
import { Events } from "./eventSystem";
import { GameMap } from "./world/game-map";
import { generateDungeon } from "./procedural/generation";
import { Health } from "./components/statistics/health";
import {
  renderHealthBar,
  renderNamesAtLocation,
  renderFrameWithTitle,
} from "./rendering/functions";
import { Message, MessageLog } from "./message-log";
import { Colors } from "./rendering/colors";

export const EngineState = {
  Game: 1,
  Dead: 2,
  Log: 3,
};

export class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;
  public static readonly MAP_WIDTH = 80;
  public static readonly MAP_HEIGHT = 43;
  public static readonly MIN_ROOM_SIZE = 6;
  public static readonly MAX_ROOM_SIZE = 10;
  public static readonly MAX_ROOMS = 30;
  public static readonly MAX_MONSTERS_PER_ROOM = 2;

  display: ROT.Display;
  gameMap: GameMap;
  messageLog: MessageLog;
  mousePosition: [number, number];
  logCursorPosition: number;

  _state: number;

  constructor() {
    this._state = EngineState.Game;
    this.logCursorPosition = 0;

    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT,
      forceSquareRatio: true,
    });
    const container = this.display.getContainer()!;
    document.body.appendChild(container);

    this.mousePosition = [0, 0];
    this.messageLog = new MessageLog();
    this.messageLog.addMessage(
      "Hello and welcome, adventurer, to yet another dungeon!",
      Colors.WelcomeText,
    );

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

    window.addEventListener("mousemove", (event) => {
      this.mousePosition = this.display.eventToPosition(event);
      this.render();
    });

    if (window.verboseDebug) {
      Events.on("entityPosition", (coordinate: Coordinate) => {
        console.log("Entity at position: " + coordinate);
      });
    }

    this.gameMap.updateFov(window.player); // update fov for the first time or it wont happen till updating
  }

  get state(): number {
    return this._state;
  }

  set state(targetState: number) {
    this._state = targetState;
    this.logCursorPosition = this.messageLog.messages.length - 1;
  }

  handleEnemyTurns() {
    this.gameMap.actors.forEach((entity) => {
      entity.perform();
    });
  }

  update(event: KeyboardEvent) {
    if (this.state === EngineState.Game) {
      this.processGameLoop(event);
    } else if (this.state === EngineState.Log) {
      this.processLogLoop(event);
    }

    this.render();
  }

  processGameLoop(event: KeyboardEvent) {
    if (window.player.getComponent<Health>("health")?.isAlive()) {
      const action = handleGameInput(event);

      if (action && window.player.hasComponent("health")) {
        action.perform(window.player);

        if (this.state === EngineState.Game) {
          this.handleEnemyTurns();
        }
      }
    }

    this.gameMap.updateFov(window.player);
  }

  processLogLoop(event: KeyboardEvent) {
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
    let playerHealth =
      window.player.getComponent<Health>("health")?.currentValue ?? 0;
    let playerMaxHealth =
      window.player.getComponent<Health>("health")?.baseValue ?? 0;

    this.messageLog.render(this.display, 21, 45, 40, 5);

    renderNamesAtLocation(21, 44);
    renderHealthBar(this.display, playerHealth, playerMaxHealth, 20);

    this.gameMap.render();

    if (this.state === EngineState.Log) {
      renderFrameWithTitle(3, 3, 74, 38, "Test Frame");
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

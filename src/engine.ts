import * as ROT from "rot-js";

// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { Actor } from "./entity";
import { GameMap } from "./game-map";
import { generateDungeon } from "./generation";
import { MessageLog } from "./ui/message-log";
import { Colors } from "./ui/colors";

import {
  handleGameInput,
  handleInventoryInput,
  handleLogInput,
} from "./input-handler";

import {
  renderHealthBar,
  renderNamesAtLocation,
  renderFrameWithTitle,
} from "./ui/rendering";

export const EngineState = {
  Game: 0,
  Dead: 1,
  Log: 2,
  UseInventory: 3,
  DropInventory: 4,
};

export class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;
  public static readonly MAP_WIDTH = 80;
  public static readonly MAP_HEIGHT = 43;
  public static readonly MAX_ROOMS = 10;
  public static readonly MIN_SIZE = 5;
  public static readonly MAX_SIZE = 10;
  public static readonly MAX_MONSTERS_PER_ROOM = 2;
  public static readonly MAX_ITEMS_PER_ROOM = 2;

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
      Engine.MAX_ROOMS,
      Engine.MIN_SIZE,
      Engine.MAX_SIZE,
      Engine.MAX_MONSTERS_PER_ROOM,
      Engine.MAX_ITEMS_PER_ROOM,
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
        try {
          actor.ai?.perform(actor);
        } catch {}
      }
    });
  }

  update(event: KeyboardEvent) {
    if (this.state === EngineState.Game) {
      this.updateGameloop(event);
    } else if (this.state === EngineState.Log) {
      this.updateGameloop(event);
    } else if (
      this.state === EngineState.UseInventory ||
      this.state === EngineState.DropInventory
    ) {
      this.updateInventoryLoop(event);
    }

    this.render();
  }

  updateInventoryLoop(event: KeyboardEvent) {
    const action = handleInventoryInput(event);
    action?.perform(this.player);
  }

  updateGameloop(event: KeyboardEvent) {
    if (this.player.fighter.hp > 0) {
      const action = handleGameInput(event);

      if (action) {
        try {
          action.perform(this.player);

          if (this.state === EngineState.Game) {
            this.handleEnemyTurns();
          }
        } catch {}
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

    if (this.state === EngineState.UseInventory) {
      this.renderInventory("Select an item to use");
    }

    if (this.state === EngineState.DropInventory) {
      this.renderInventory("Select an item to drop");
    }
  }

  renderInventory(title: string) {
    const itemCount = this.player.inventory.items.length;
    const height = itemCount + 2 <= 3 ? 3 : itemCount + 2;
    const width = title.length + 4;
    const x = this.player.x <= 30 ? 40 : 0;
    const y = 0;

    renderFrameWithTitle(x, y, width, height, title);

    if (itemCount > 0) {
      this.player.inventory.items.forEach((i, index) => {
        const key = String.fromCharCode("a".charCodeAt(0) + index);
        this.display.drawText(x + 1, y + index + 1, `(${key}) ${i.name}`);
      });
    } else {
      this.display.drawText(x + 1, y + 1, "(Empty)");
    }
  }
}

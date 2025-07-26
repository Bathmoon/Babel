import { Display } from "rot-js";
import { BaseView } from "./base-view";
import { Actor } from "../entity";
import { Engine } from "../engine";
import { BaseInputHandler, GameInputHandler } from "../input-handler";
import { GameView } from "./game-screen";

const OPTIONS = [
  "[N] Play a new game",
  "[C] Continue last game", // TODO: hide this option if no save game is present
];

const MENU_WIDTH = 24;

export class MainMenuView extends BaseView {
  inputHandler: BaseInputHandler;

  constructor(display: Display, player: Actor) {
    super(display, player);
    this.inputHandler = new GameInputHandler();
  }

  update(event: KeyboardEvent): BaseView {
    if (event.key === "n") {
      return new GameView(this.display, this.player);
    }

    this.render();

    return this;
  }

  render() {
    this.display.clear();

    OPTIONS.forEach((option, index) => {
      const x = Math.floor(Engine.WIDTH / 2);
      const y = Math.floor(Engine.HEIGHT / 2 - 1 + index);

      this.display.draw(x, y, option.padEnd(MENU_WIDTH, " "), "#fff", "#000");
    });
  }
}

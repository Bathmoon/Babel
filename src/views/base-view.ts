import { Display } from "rot-js";
import { Actor } from "../entity";
import { BaseInputHandler } from "../input-handler";

export abstract class BaseView {
  abstract inputHandler: BaseInputHandler;
  display: Display;
  player: Actor;

  protected constructor(display: Display, player: Actor) {
    this.display = display;
    this.player = player;
  }

  abstract update(event: KeyboardEvent): BaseView;

  abstract render(): void;
}

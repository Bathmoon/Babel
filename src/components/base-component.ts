import { Entity } from "../entity";
import { GameMap } from "../game-map";

export abstract class BaseComponent {
  parent: Entity | null;

  protected constructor() {
    this.parent = null;
  }

  public get gameMap(): GameMap | BaseComponent | null | undefined {
    return this.parent?.parent;
  }
}

import { Component } from "./component";

export class Entity {
  // An entity will optionally have a collection of components that define behavior
  components: Array<Component<any>> = [];

  /* An entity will always have these basic properties */

  // Coordinates
  x: number = 0;
  y: number = 0;

  // Visual Elements
  symbol: string = "@";
  foreGroundColor: string = "#fff";
  backGroundColor: string = "#000";

  // We add components and properties using the build pattern
  addComponent(component: Component<any>): Entity {
    this.components.push(component);

    return this;
  }

  get coordinates(): [number, number] {
    return [this.x, this.y];
  }

  setCoordinates(x: number, y: number): Entity {
    this.x = x;
    this.y = y;

    return this;
  }

  setSymbol(symbol: string): Entity {
    this.symbol = symbol;

    return this;
  }

  setBackgroundColor(color: string): Entity {
    this.backGroundColor = color;

    return this;
  }

  setForegroundColor(color: string): Entity {
    this.foreGroundColor = color;

    return this;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
}

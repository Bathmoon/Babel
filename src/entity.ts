import { Events } from "./eventSystem";
import { Component } from "./component";
import { Coordinate } from "./components/coordinate";

export class Entity {
  // An entity will optionally have a collection of components that define behavior
  components: Array<Component<any>> = [];

  /* An entity will always have these basic properties */

  // Coordinates
  entityCoordinate: Coordinate = new Coordinate(0, 0);

  // Visual Elements
  symbol: string = "@";
  foreGroundColor: string = "#fff";
  backGroundColor: string = "#000";

  // How far an entity can "see"
  _sightRange: number = 0;

  // We add components and properties using the build pattern
  addComponent(component: Component<any>): Entity {
    this.components.push(component);

    return this;
  }

  get x(): number {
    return this.entityCoordinate.x;
  }

  get y(): number {
    return this.entityCoordinate.y;
  }

  get z(): number {
    return this.entityCoordinate.z;
  }

  get heightRange(): number[] {
    return this.entityCoordinate.heightRange;
  }

  get sightRange(): number {
    return this._sightRange;
  }

  set x(value: number) {
    this.entityCoordinate.x = value;
  }

  set y(value: number) {
    this.entityCoordinate.y = value;
  }

  set z(value: number) {
    this.entityCoordinate.z = value;
  }

  set heightRange(value: number[]) {
    this.entityCoordinate.heightRange = value;
  }

  set sightRange(range: number) {
    this.sightRange = range;
  }

  setCoordinate(
    x: number,
    y: number,
    z: number = 0,
    heightRange: number[] = [1],
  ): Entity {
    this.entityCoordinate.x = x;
    this.entityCoordinate.y = y;
    this.entityCoordinate.z = z;
    this.entityCoordinate.heightRange = heightRange;

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

  setSightRange(range: number): Entity {
    this._sightRange = range;

    return this;
  }

  // increment coordinates by the directional values supplied
  move(dx: number, dy: number, dz: number = 0) {
    this.entityCoordinate.x += dx;
    this.entityCoordinate.y += dy;
    this.entityCoordinate.z += dz;
  }

  emitCoordinates() {
    Events.emit("entityPosition", this.entityCoordinate.coordinate);
  }
}

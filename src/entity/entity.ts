import { Events } from "../eventSystem";
import { Coordinate } from "../components/coordinate";

export class Entity {
  // An enbase-tity will optionally have a map of components that define behavior
  components: Map<string, any> = new Map();

  /* An entity will always have these basic properties */

  // Coordinates
  entityCoordinate: Coordinate = new Coordinate(0, 0);

  // Visual Elements
  symbol: string = "@";
  foreGroundColor: string = "#fff";
  backGroundColor: string = "#000";

  // How far an entity can "see"
  _sightRange: number = 0;

  // Basic entity properties
  _name: string = "Unnamed";
  _blocksMovement: boolean = false;
  _spawnChance: number = 0; // percentage from 0-100

  // We can add components and properties using the build pattern
  setComponent(name: string, component: any): Entity {
    this.components.set(name, component);

    return this;
  }

  get name(): string {
    return this._name;
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

  get blocksMovement(): boolean {
    return this._blocksMovement;
  }

  get coordinate(): Coordinate {
    return this.entityCoordinate;
  }

  get spawnChance(): number {
    return this._spawnChance;
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

  setBlocksMovement(blocksMovement: boolean): Entity {
    this._blocksMovement = blocksMovement;

    return this;
  }

  setName(name: string): Entity {
    this._name = name;

    return this;
  }

  setSpawnChance(chance: number): Entity {
    this._spawnChance = chance;

    return this;
  }

  /* Post build component methods */

  addComponent(name: string, component: any): void {
    this.components.set(name, component);
  }

  getComponent<T>(name: string): T | undefined {
    return this.components.get(name);
  }

  hasComponent(name: string): boolean {
    return this.components.has(name);
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

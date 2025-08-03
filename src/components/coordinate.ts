export class Coordinate {
  _x: number;
  _y: number;
  _z: number;
  _heightRange: number[];

  constructor(
    x: number,
    y: number,
    z: number = 0,
    heightRange: number[] = [1],
  ) {
    // we always have x and y coordinates
    this._x = x;
    this._y = y;

    // z defaults to 0, but if we need to layer things we can use heightRange
    // height range defaults to 1, but if an entity is taller than a single plane we can extend that
    this._z = z;
    this._heightRange = heightRange;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get z(): number {
    return this._z;
  }

  get heightRange(): number[] {
    return this._heightRange;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }

  set z(value: number) {
    this._z = value;
  }

  set heightRange(value: number[]) {
    this._heightRange = value;
  }

  get coordinate(): [number, number, number] {
    return [this._x, this._y, this._z];
  }
}

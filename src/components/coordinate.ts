export class Coordinate {
  x: number;
  y: number;
  z: number;
  heightRange: number;

  constructor(x: number, y: number, z: number = 0, heightRange: number = 1) {
    // we always have x and y coordinates
    this.x = x;
    this.y = y;

    // z defaults to 0, but if we need to layer things we can use heightRange
    // height range defaults to 1, but if an entity is taller than a single plane we can extend that
    this.z = z;
    this.heightRange = heightRange;
  }
}

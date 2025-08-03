import { type Bounds } from "./bounds";
import { Coordinate } from "../components/coordinate";
import { type Tile, TILES } from "../tiles/tile";

export class RectangularRoom {
  upperLeftCoordinate: Coordinate;
  lowerRightCoordinate: Coordinate;
  width: number;
  height: number;

  tiles: Tile[][];

  constructor(x: number, y: number, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Array(this.height);

    // based on the top left corner, create coordinates for the top left and bottom right corners
    this.upperLeftCoordinate = new Coordinate(x, y);
    this.lowerRightCoordinate = new Coordinate(x + this.width, y + this.height);

    this.build();
  }

  public get center(): [number, number] {
    const centerX = this.upperLeftCoordinate.x + Math.floor(this.width / 2);
    const centerY = this.upperLeftCoordinate.y + Math.floor(this.height / 2);

    return [centerX, centerY];
  }

  get bounds(): Bounds {
    return {
      upperLeftCoordinate: this.upperLeftCoordinate,
      lowerRightCoordinate: this.lowerRightCoordinate,
    };
  }

  isIntersecting(otherRoom: RectangularRoom): boolean {
    return !(
      this.lowerRightCoordinate.x < otherRoom.upperLeftCoordinate.x ||
      this.upperLeftCoordinate.x > otherRoom.lowerRightCoordinate.x ||
      this.lowerRightCoordinate.y < otherRoom.upperLeftCoordinate.y ||
      this.upperLeftCoordinate.y > otherRoom.lowerRightCoordinate.y
    );
  }

  // take an x or y value and compare it against the width or height dimensions
  isBoundary(v: number, dimension: number) {
    return v === 0 || v === dimension - 1; // - 1 since the width/height are not 0 based
  }

  build() {
    for (let y = 0; y < this.height; y++) {
      const row = new Array(this.width);

      for (let x = 0; x < this.width; x++) {
        const isWall =
          this.isBoundary(x, this.width) || this.isBoundary(y, this.height);

        row[x] = isWall ? { ...TILES.WALL_TILE } : { ...TILES.FLOOR_TILE };
      }

      this.tiles[y] = row;
    }
  }
}

import { FLOOR_TILE, WALL_TILE } from "./tile-types";
import type { Tile } from "./tile-types";
import { GameMap } from "./game-map";
import { Display } from "rot-js";
import { Entity } from "./entity";

class RectangularRoom {
  topLeftX: number;
  topLeftY: number;
  width: number;
  height: number;

  tiles: Tile[][];

  constructor(x: number, y: number, width: number, height: number) {
    this.topLeftX = x;
    this.topLeftY = y;
    this.width = width;
    this.height = height;
    this.tiles = new Array(this.height);

    this.build();
  }

  public get center(): [number, number] {
    const centerX = this.topLeftX + Math.floor(this.width / 2);
    const centerY = this.topLeftY + Math.floor(this.height / 2);

    return [centerX, centerY];
  }

  isIntersecting(otherRoom: RectangularRoom): boolean {
    return (
      this.topLeftX <= otherRoom.topLeftX + otherRoom.width &&
      this.topLeftX + this.width >= otherRoom.topLeftX &&
      this.topLeftY <= otherRoom.topLeftY + otherRoom.height &&
      this.topLeftY + this.width >= otherRoom.topLeftY
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

        row[x] = isWall ? { ...WALL_TILE } : { ...FLOOR_TILE };
      }

      this.tiles[y] = row;
    }
  }
}

export function generateDungeon(
  mapWidth: number,
  mapHeight: number,
  maxRooms: number,
  minSize: number,
  maxSize: number,
  player: Entity,
  display: Display,
): GameMap {
  const dungeon = new GameMap(mapWidth, mapHeight, display);
  const rooms: RectangularRoom[] = [];

  for (let count = 0; count < maxRooms; count++) {
    // Generate random room size
    const width = generateRandomNumber(minSize, maxSize);
    const height = generateRandomNumber(minSize, maxSize);

    // Generate random room location
    const x = generateRandomNumber(0, mapWidth - width - 1);
    const y = generateRandomNumber(0, mapHeight - height - 1);

    // Generate room
    const newRoom = new RectangularRoom(x, y, width, height);

    // Ensure the new room does not overlap with existing ones
    if (rooms.some((room) => room.isIntersecting(newRoom))) {
      continue;
    }

    dungeon.addRoom(x, y, newRoom.tiles);
    rooms.push(newRoom);
  }

  for (let index = 0; index < rooms.length - 1; index++) {
    const first = rooms[index];
    const second = rooms[index + 1];

    for (let tile of connectRooms(first, second)) {
      dungeon.tiles[tile[1]][tile[0]] = { ...FLOOR_TILE };
    }
  }

  const startPoint = rooms[0].center;
  player.x = startPoint[0];
  player.y = startPoint[1];

  return dungeon;
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function* connectRooms(
  roomA: RectangularRoom,
  roomB: RectangularRoom,
): Generator<[number, number], void, void> {
  const endPosition = roomB.center; // set the end point at the center of the second room
  let currentPosition = roomA.center; // set the start point of our tunnel at the center of the first room
  let isHorizontal = Math.random() < 0.5; // flip a coin to see if we go horizontally first or vertically
  let axisIndex = isHorizontal ? 0 : 1; // set our axisIndex to 0 (x axis) if horizontal or 1 (y axis) if vertical

  // we'll loop until our current point is the same as the end point
  // [0] for the first element of the tuple, [1] for the second
  while (
    currentPosition[0] !== endPosition[0] ||
    currentPosition[1] !== endPosition[1]
  ) {
    const direction = Math.sign(
      endPosition[axisIndex] - currentPosition[axisIndex], // determine if we tunneling in the positive or negative direction
    );

    // if direction is 0 we have hit the destination in one direction
    if (direction !== 0) {
      currentPosition[axisIndex] += direction;
      yield currentPosition;
    } else {
      axisIndex = axisIndex === 0 ? 1 : 0; // we've finished in this direction so switch to the other
      yield currentPosition;
    }
  }
}

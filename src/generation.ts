// Set debug mode in the configuration.ts
import { FLOOR_TILE, WALL_TILE, STAIRS_DOWN_TILE } from "./tile-types";
import type { Tile } from "./tile-types";
import { GameMap } from "./game-map";
import { Display, RNG } from "rot-js";
import { Entity, spawnMap } from "./entity";

type FloorValue = [number, number][];

const MAX_ITEMS_BY_FLOOR: FloorValue = [
  [1, 1],
  [4, 2],
];

const MAX_MONSTERS_BY_FLOOR: FloorValue = [
  [1, 2],
  [4, 3],
  [6, 5],
];

type Choice = {
  value: string;
  weight: number;
};

type WeightedChoices = {
  floor: number;
  weights: Choice[];
};

const ITEM_CHANCES: WeightedChoices[] = [
  {
    floor: 0,
    weights: [{ value: "spawnHealthPotion", weight: 35 }],
  },
  {
    floor: 2,
    weights: [{ value: "spawnConfusionScroll", weight: 10 }],
  },
  {
    floor: 4,
    weights: [{ value: "spawnLightningScroll", weight: 25 }],
  },
  {
    floor: 6,
    weights: [{ value: "spawnFireballScroll", weight: 25 }],
  },
];

const MONSTER_CHANCES: WeightedChoices[] = [
  {
    floor: 0,
    weights: [{ value: "spawnOrc", weight: 80 }],
  },
  {
    floor: 3,
    weights: [{ value: "spawnTroll", weight: 15 }],
  },
  {
    floor: 5,
    weights: [{ value: "spawnTroll", weight: 30 }],
  },
  {
    floor: 7,
    weights: [{ value: "spawnTroll", weight: 60 }],
  },
];

interface Bounds {
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
}

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

  get bounds(): Bounds {
    return {
      topLeftX: this.topLeftX,
      topLeftY: this.topLeftY,
      bottomRightX: this.topLeftX + this.width - 1,
      bottomRightY: this.topLeftY + this.height - 1,
    };
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

/*
  This function will take in a given room, the dungeon the room is being added to,
  and the maximum number of monsters to add to the room
*/
function placeEntities(
  room: RectangularRoom,
  dungeon: GameMap,
  floorNumber: number,
) {
  const numberOfMonstersToAdd = generateRandomNumber(
    0,
    getMaxValueForFloor(MAX_MONSTERS_BY_FLOOR, floorNumber),
  );
  const numberOfItemsToAdd = generateRandomNumber(
    0,
    getMaxValueForFloor(MAX_ITEMS_BY_FLOOR, floorNumber),
  );
  const bounds = room.bounds;

  for (let i = 0; i < numberOfMonstersToAdd; i++) {
    const x = generateRandomNumber(
      bounds.topLeftX + 1,
      bounds.bottomRightX - 1,
    );
    const y = generateRandomNumber(
      bounds.topLeftY + 1,
      bounds.bottomRightY - 1,
    );

    if (!dungeon.entities.some((e) => e.x == x && e.y == y)) {
      const weights = getWeights(MONSTER_CHANCES, floorNumber);
      const spawnType = RNG.getWeightedValue(weights);
      if (spawnType) {
        spawnMap[spawnType](dungeon, x, y);
      }
    }
  }

  for (let i = 0; i < numberOfItemsToAdd; i++) {
    const x = generateRandomNumber(
      bounds.topLeftX + 1,
      bounds.bottomRightX - 1,
    );
    const y = generateRandomNumber(
      bounds.topLeftY + 1,
      bounds.bottomRightY - 1,
    );

    if (!dungeon.entities.some((e) => e.x == x && e.y == y)) {
      const weights = getWeights(ITEM_CHANCES, floorNumber);
      const spawnType = RNG.getWeightedValue(weights);
      if (spawnType) {
        spawnMap[spawnType](dungeon, x, y);
      }
    }
  }
}

function getMaxValueForFloor(
  maxValueByFloor: FloorValue,
  floor: number,
): number {
  let current = 0;

  for (let [min, value] of maxValueByFloor) {
    if (min > floor) break;
    current = value;
  }

  return current;
}

export function generateDungeon(
  mapWidth: number,
  mapHeight: number,
  maxRooms: number,
  minSize: number,
  maxSize: number,
  maxMonsters: number,
  maxItems: number,
  player: Entity,
  display: Display,
  currentFloor: number,
): GameMap {
  const dungeon = new GameMap(mapWidth, mapHeight, display, [player]);
  const rooms: RectangularRoom[] = [];

  let centerOfLastRoom: [number, number] = [0, 0];

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
    placeEntities(newRoom, dungeon, currentFloor);
    rooms.push(newRoom);
    centerOfLastRoom = newRoom.center;
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

  dungeon.tiles[centerOfLastRoom[1]][centerOfLastRoom[0]] = {
    ...STAIRS_DOWN_TILE,
  };

  dungeon.downStairsLocation = centerOfLastRoom;

  return dungeon;
}

export function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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

type WeightMap = {
  [key: string]: number;
};

function getWeights(
  chancesByFloor: WeightedChoices[],
  floorNumber: number,
): WeightMap {
  let current: WeightMap = {};

  for (let { floor, weights } of chancesByFloor) {
    if (floor > floorNumber) break;

    for (let { value, weight } of weights) {
      current[value] = weight;
    }
  }

  return current;
}

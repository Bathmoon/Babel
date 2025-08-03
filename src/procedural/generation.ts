import { TILES } from "../tiles/tile";
import type { Tile } from "../tiles/tile";
import { GameMap } from "../world/game-map";
import { Display } from "rot-js";
import { Entity } from "../entity";
import { type EntityConfig } from "../entity-config";
import { type Bounds } from "./bounds";
import { RectangularRoom } from "./room-rect";

function spawnEntity(config: EntityConfig, x: number, y: number): Entity {
  const entity = new Entity()
    .setCoordinate(x, y)
    .setSymbol(config.symbol)
    .setName(config.name)
    .setBackgroundColor(config.backGroundColor)
    .setForegroundColor(config.foreGroundColor)
    .setSightRange(config.sightRange)
    .setBlocksMovement(config.blocksMovement)
    .setSpawnChance(config.spawnChance);

  return entity;
}

export function generateDungeon(
  mapWidth: number,
  mapHeight: number,
  maxRooms: number,
  minSize: number,
  maxSize: number,
  maxMonsters: number,
  player: Entity,
  display: Display,
): GameMap {
  const dungeon = new GameMap(mapWidth, mapHeight, display, [player]);
  const rooms: RectangularRoom[] = [];

  for (let count = 0; count < maxRooms; count++) {
    const width = generateRandomNumber(minSize, maxSize);
    const height = generateRandomNumber(minSize, maxSize);

    const x = generateRandomNumber(0, mapWidth - width - 1);
    const y = generateRandomNumber(0, mapHeight - height - 1);

    const newRoom = new RectangularRoom(x, y, width, height);

    if (rooms.some((room) => room.isIntersecting(newRoom))) {
      continue;
    }

    dungeon.addRoom(x, y, newRoom.tiles);
    placeEntities(newRoom, dungeon, maxMonsters);
    rooms.push(newRoom);
  }

  for (let index = 0; index < rooms.length - 1; index++) {
    const first = rooms[index];
    const second = rooms[index + 1];

    for (let tile of connectRooms(first, second)) {
      dungeon.tiles[tile[1]][tile[0]] = { ...TILES.FLOOR_TILE };
    }
  }

  const startPoint = rooms[0].center;
  player.x = startPoint[0];
  player.y = startPoint[1];

  return dungeon;
}

function generateRandomNumber(min: number, max: number) {
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

function placeEntities(
  room: RectangularRoom,
  dungeon: GameMap,
  maxMonsters: number,
) {
  const numberOfMonstersToAdd = generateRandomNumber(0, maxMonsters);

  for (let i = 0; i < numberOfMonstersToAdd; i++) {
    const bounds = room.bounds;
    const x = generateRandomNumber(
      bounds.upperLeftCoordinate.x + 1,
      bounds.upperLeftCoordinate.y - 1,
    );
    const y = generateRandomNumber(
      bounds.lowerRightCoordinate.x + 1,
      bounds.lowerRightCoordinate.y - 1,
    );

    if (!dungeon.entities.some((entity) => entity.x == x && entity.y == y)) {
      dungeon.entities.push(spawnEntity());
      if (Math.random() < entity.spawnChance / 100) {
        console.log(`We'll be putting an orc at (${x}, ${y})!!!`);
      } else {
        console.log(`We'll be putting an troll at (${x}, ${y})!!!`);
      }
    }
  }
}

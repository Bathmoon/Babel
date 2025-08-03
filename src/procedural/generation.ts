import { TILES } from "../tiles/tile";
import { GameMap } from "../world/game-map";
import { Display } from "rot-js";
import { Entity } from "../entity/entity";
import { type EntityConfig, entityConfigs } from "../entity-config";
import { RectangularRoom } from "./room-rect";
import { EntityBuilder } from "../entity/entity-builder";

function spawnEntity(config: EntityConfig, x: number, y: number): Entity {
  return new EntityBuilder()
    .setCoordinate(x, y)
    .setSymbol(config.symbol)
    .setName(config.name)
    .setBackgroundColor(config.backGroundColor)
    .setForegroundColor(config.foreGroundColor)
    .setSightRange(config.sightRange)
    .setBlocksMovement(config.blocksMovement)
    .setSpawnChance(config.spawnChance)
    .withComponentsFromConfig(config.components) // add components here
    .build();
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
  const endPosition = roomB.center; // second room center
  let currentPosition = roomA.center; // first room center
  let isHorizontal = Math.random() < 0.5;
  let axisIndex = isHorizontal ? 0 : 1;

  while (
    currentPosition[0] !== endPosition[0] ||
    currentPosition[1] !== endPosition[1]
  ) {
    const direction = Math.sign(
      endPosition[axisIndex] - currentPosition[axisIndex],
    );

    if (direction !== 0) {
      currentPosition = [...currentPosition] as [number, number]; // clone to avoid mutating original tuple
      currentPosition[axisIndex] += direction;
      yield currentPosition;
    } else {
      axisIndex = axisIndex === 0 ? 1 : 0;
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
  const bounds = room.bounds;
  const entries = Object.entries(entityConfigs).filter(
    ([key]) => key !== "player",
  ); // Convert entries to array of [entityType, config] for iteration - sans player
  const totalChance = entries.reduce(
    (acc, [, config]) => acc + (config.spawnChance ?? 0),
    0,
  ); // Calculate total spawn chance sum
  const rand = Math.random() * totalChance;

  let cumulativeChance = 0;
  let selectedType: string | null = null;

  for (let i = 0; i < numberOfMonstersToAdd; i++) {
    const x = generateRandomNumber(
      bounds.upperLeftCoordinate.x + 1,
      bounds.lowerRightCoordinate.x - 1,
    );
    const y = generateRandomNumber(
      bounds.upperLeftCoordinate.y + 1,
      bounds.lowerRightCoordinate.y - 1,
    );

    // Skip if position is already occupied
    if (
      dungeon.entities.some(
        (entity) => entity.coordinate.x === x && entity.coordinate.y === y,
      )
    ) {
      continue;
    }

    for (const [type, config] of entries) {
      cumulativeChance += config.spawnChance ?? 0;

      if (rand < cumulativeChance) {
        selectedType = type;
        break;
      }
    }

    if (selectedType) {
      // Spawn entity using the selected config
      const entity = spawnEntity(entityConfigs[selectedType], x, y);
      dungeon.entities.push(entity);
    }
  }
}

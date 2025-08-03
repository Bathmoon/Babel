import { Coordinate } from "../components/coordinate";
import floorTile from "./types/floor.json";
import wallTile from "./types/wall.json";

export interface Graphic {
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;
}

export interface Tile {
  isWalkable: boolean;
  isTransparent: boolean;
  isVisible: boolean;
  isSeen: boolean;
  isOccupied: boolean;
  plane: number;
  heightRange: number[];
  dark: Graphic;
  light: Graphic;
  coordinate: Coordinate;
}

const FLOOR_TILE: Tile = {
  ...floorTile,
  coordinate: new Coordinate(0, 0),
};

const WALL_TILE: Tile = {
  ...wallTile,
  coordinate: new Coordinate(0, 0),
};

export const TILES: { [key: string]: Tile } = {
  FLOOR_TILE,
  WALL_TILE,
};

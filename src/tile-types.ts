export interface Graphic {
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;
}

export interface Tile {
  isWalkable: boolean;
  isTransparent: boolean;
  dark: Graphic;
}

export const FLOOR_TILE: Tile = {
  isWalkable: true,
  isTransparent: true,
  dark: { symbol: " ", foreGroundColor: "#fff", backGroundColor: "#323296" },
};

export const WALL_TILE: Tile = {
  isWalkable: false,
  isTransparent: false,
  dark: { symbol: " ", foreGroundColor: "#fff", backGroundColor: "#000064" },
};

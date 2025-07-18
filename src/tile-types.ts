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
  dark: Graphic;
  light: Graphic;
  globalPosition: [number, number];
  roomPosition: [number, number];
  onClick?: (event: MouseEvent) => void;
}

export const FLOOR_TILE: Tile = {
  isWalkable: true,
  isTransparent: true,
  isVisible: false,
  isSeen: false,
  dark: { symbol: " ", foreGroundColor: "#fff", backGroundColor: "#323296" },
  light: { symbol: " ", foreGroundColor: "#fff", backGroundColor: "#c8b432" },
  globalPosition: [0, 0],
  roomPosition: [0, 0],
};

export const WALL_TILE: Tile = {
  isWalkable: false,
  isTransparent: false,
  isVisible: false,
  isSeen: false,
  dark: { symbol: " ", foreGroundColor: "#fff", backGroundColor: "#000064" },
  light: { symbol: " ", foreGroundColor: "#fff", backGroundColor: "826e32" },
  globalPosition: [0, 0],
  roomPosition: [0, 0],
};

import orc from "../entities/orc.json";
import troll from "../entities/troll.json";
import player from "../entities/player.json";

export interface EntityConfig {
  symbol: string;
  foreGroundColor: string;
  backGroundColor: string;
  name: string;
  blocksMovement: boolean;
  sightRange: number;
  spawnChance: number;
  hp?: number;
  attack?: number;
  components?: { [componentName: string]: any };
}

export const entityConfigs: { [key: string]: EntityConfig } = {
  player: player,
  orc: orc,
  troll: troll,
};

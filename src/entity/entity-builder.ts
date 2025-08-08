import { Entity } from "./entity";
import { GameMap } from "../world/game-map";
import { createComponentInstance } from "../components/componentFactory";

export class EntityBuilder {
  private entity: Entity;

  constructor() {
    this.entity = new Entity();
  }

  setCoordinate(x: number, y: number): this {
    this.entity.setCoordinate(x, y);
    return this;
  }

  setSymbol(symbol: string): this {
    this.entity.setSymbol(symbol);
    return this;
  }

  setName(name: string): this {
    this.entity.setName(name);
    return this;
  }

  setBackgroundColor(color: string): this {
    this.entity.setBackgroundColor(color);
    return this;
  }

  setForegroundColor(color: string): this {
    this.entity.setForegroundColor(color);
    return this;
  }

  setSightRange(range: number): this {
    this.entity.setSightRange(range);
    return this;
  }

  setBlocksMovement(blocks: boolean): this {
    this.entity.setBlocksMovement(blocks);
    return this;
  }

  setSpawnChance(chance: number): this {
    this.entity.setSpawnChance(chance);
    return this;
  }

  // New method: add components from JSON config object
  withComponentsFromConfig(componentsConfig?: { [key: string]: any }): this {
    if (componentsConfig) {
      for (const [componentName, componentData] of Object.entries(
        componentsConfig,
      )) {
        const componentInstance = createComponentInstance(
          componentName,
          componentData,
          this.entity,
        );

        if (componentInstance) {
          this.entity.addComponent(componentName, componentInstance);
        }
      }
    }

    return this;
  }

  setGameMap(map: GameMap): this {
    this.entity.currentMap = map;

    return this;
  }

  build(): Entity {
    return this.entity;
  }
}

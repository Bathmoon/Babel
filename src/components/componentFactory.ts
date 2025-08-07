import { Defense } from "./statistics/defense";
import { Entity } from "../entity/entity";
import { Health } from "./statistics/health";
import { Attack } from "./statistics/attack";
import { SimpleHostileRoutine } from "./routines/simple-hostile";

export function createComponentInstance(
  componentName: string,
  componentData: any,
  owningEntity: Entity,
): any | null {
  switch (componentName) {
    case "health":
      return new Health(componentData.baseValue, owningEntity);
    case "defense":
      return new Defense(componentData.baseValue, owningEntity);
    case "attack":
      return new Attack(componentData.baseValue, owningEntity);
    case "simpleHostileRoutine":
      return new SimpleHostileRoutine();
    default:
      console.warn(`Unknown component: ${componentName}`);
      return null;
  }
}

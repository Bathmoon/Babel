import { Defense } from "./statistics/defense";
import { Health } from "./statistics/health";
import { Attack } from "./statistics/attack";

export function createComponentInstance(
  componentName: string,
  componentData: any,
): any | null {
  switch (componentName) {
    case "health":
      return new Health(componentData.baseValue);
    case "defense":
      return new Defense(componentData.baseValue);
    case "attack":
      return new Attack(componentData.baseValue);
    default:
      console.warn(`Unknown component: ${componentName}`);
      return null;
  }
}

import { Health } from "./statistics.ts/health";
// import other component classes here

export function createComponentInstance(
  componentName: string,
  componentData: any,
): any | null {
  switch (componentName) {
    case "health":
      return new Health(componentData.maxHp);
    // add cases for additional components here
    default:
      console.warn(`Unknown component: ${componentName}`);
      return null;
  }
}

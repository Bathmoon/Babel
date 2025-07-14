import { Entity } from "./entity";
import { Engine } from "./engine";

/*
  things to keep in mind for refactoring and additions at the end

  1. Debug mode
    a. Make sure there's an option to view the whole map, disregarding fov
  2. Split out the generateDungeon function into multiple functions
  3. It feels like something needs to keep track of the list of rooms for a given game map
*/

declare global {
  interface Window {
    engine: Engine;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const player = new Entity(Engine.WIDTH / 2, Engine.HEIGHT / 2, "@");
  const npc1 = new Entity(Engine.WIDTH / 2 - 5, Engine.HEIGHT / 2, "@", "#ff0");
  const npc2 = new Entity(
    Engine.WIDTH / 2 - 3,
    Engine.HEIGHT / 2 - 3,
    "@",
    "#ff0",
  );
  const npc3 = new Entity(
    Engine.WIDTH / 2 - 7,
    Engine.HEIGHT / 2 - 5,
    "@",
    "#ff0",
  );
  const entities = [player, npc1, npc2, npc3];

  window.engine = new Engine(entities, player);
});

import { Engine } from "./engine";
import { spawnPlayer } from "./entity";

/*
  things to keep in mind for refactoring and additions at the end

  1. Debug mode
    a. Make sure there's an option to view the whole map, disregarding fov
  2. Split out the generateDungeon function into multiple functions
  3. It feels like something needs to keep track of the list of rooms for a given game map
  4. Entity generation can place orcs in walls
*/

declare global {
  interface Window {
    engine: Engine;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const player = spawnPlayer(Engine.WIDTH / 2, Engine.HEIGHT / 2);
  console.log(player);
  window.engine = new Engine(player);
});

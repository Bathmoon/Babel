// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { Engine } from "./engine";
import { spawnPlayer } from "./entity";

/*
  things to keep in mind for refactoring and additions at the end

  1. Debug mode
    a. Make sure there's an option to view the whole map, disregarding fov
  2. Split out the generateDungeon function into multiple functions
  3. It feels like something needs to keep track of the list of rooms for a given game map
  5. Simplify files if possible, single classes, fewer operations and types of operations per file, e.g. no entity and actor in entity.ts
*/

declare global {
  interface Window {
    engine: Engine;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const player = spawnPlayer(Engine.WIDTH / 2, Engine.HEIGHT / 2);

  if (debug) {
    console.log(`Initial player: ${player}`);
  }

  window.engine = new Engine(player);
});

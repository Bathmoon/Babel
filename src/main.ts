// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "./configuration";

import { Engine } from "./engine";
import { Actor, spawnPlayer } from "./entity";

/*
  Things to keep in mind for refactoring at the end, prior to net new additions

  1. Debug mode
    a. Make sure there's an option to view the whole map, disregarding fov
  2. Split out the generateDungeon function into multiple functions
  3. It feels like something needs to keep track of the list of rooms for a given game map
  5. Simplify files if possible, single classes, fewer operations and types of operations per file, e.g. no entity and actor in entity.ts
  6. I want entities (and tiles) to know their own coordinates - and ideally have event handlers for mouseover, vs having a global one
  7. Add a "debug" message log?
  8. Refactor away from the ridiculous constructors of entity/fighter/etc. Options: simple config object/dto. Composition (entity has list of components)
    + factory functions? like spawnplayer apparently
  9. Split out actions into folder/files
  10. bug: every "look" cursor movement counts as a turn and enemies move and attack
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
  window.engine.render();
});

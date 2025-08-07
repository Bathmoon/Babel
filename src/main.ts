import { Entity } from "./entity/entity";
import { Engine } from "./engine";
/*
  Things to keep in mind for refactoring at the end, prior to net new additions

  1. Debug mode
    a. Make sure there's an option to view the whole map, disregarding fov
  2. Split out the generateDungeon function into multiple functions
  3. It feels like something needs to keep track of the list of rooms for a given game map
  5. Simplify files if possible, single classes, fewer operations and types of operations per file, e.g. no entity and actor in entity.ts
  6. I want entities (and tiles) to know their own coordinates - and ideally have event handlers for mouseover, vs having a global one
  7. Add a "debug" message log?
  10. Import json files as consumables etc instead of hardcoding classes for everything all over the place?
  11. When loading the game, the stairs location is not remembered and defaults to 0, 0
  12. game-view.. why do I need to do this for currentxp but nothing else? player.level.currentXp = playerEntity.level?.currentXp ?? 0;
  14. toggling equip does not work
  15. have to hit another key after the look key before you can actually look
*/

declare global {
  interface Window {
    engine: Engine;
    player: Entity;
    debug: Boolean;
    verboseDebug: Boolean;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.debug = false;
  window.verboseDebug = false;

  window.engine = new Engine();
  window.engine.render();
});

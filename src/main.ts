import { Entity } from "./entity/entity";
import { Engine } from "./engine";
/*
  Things to keep in mind for refactoring at the end, prior to net new additions

  1. Debug mode
    a. Make sure there's an option to view the whole map, disregarding fov
    b. now I need to properly go back to hiding most of it..
  2. Split out the generateDungeon function into multiple functions
  3. It feels like something needs to keep track of the list of rooms for a given game map
  7. Add a "debug" message log?
  8. Pop up full log on death

  - check at end, refactor may have fixed
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

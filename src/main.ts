import { Engine } from "./engine";
import { MessageLog } from "./ui/message-log";
import { Colors } from "./ui/colors";
import { spawnPlayer } from "./entity";

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
  10. Import json files as consumables etc instead of hardcoding classes for everything all over the place?
  11. When loading the game, the stairs location is not remembered and defaults to 0, 0
  12. game-view.. why do I need to do this for currentxp but nothing else? player.level.currentXp = playerEntity.level?.currentXp ?? 0;
  13. tentatively i want a single entity class that uses composition to compose what the entity.. actually is.
    a. this should have super basic functionality like, perhaps, a title? is player? something that emits location?
    b. otherwise I want, maybe a list of classes that it has - fighter, inventory, conumable, whatever
    c. avoid .parent style things as much as possible
  14. toggling equip does not work
  15. have to hit another key after the look key before you can actually look
*/

declare global {
  interface Window {
    engine: Engine;
    messageLog: MessageLog;
    debug: boolean;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.debug = false;
  window.messageLog = new MessageLog();
  window.engine = new Engine();

  window.messageLog.addMessage(
    "Hello and welcome, adventurer, to yet another dungeon!",
    Colors.WelcomeText,
  );

  window.engine.view.render();
});

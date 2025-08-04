import { type Action } from "./actions/action";
import { type MovementMap, WaitAction } from "./actions/movement";
import { BumpAction } from "./actions/action-orchestration";

const MOVE_KEYS: MovementMap = {
  // Arrow Keys
  ArrowUp: new BumpAction(0, -1),
  ArrowDown: new BumpAction(0, 1),
  ArrowLeft: new BumpAction(-1, 0),
  ArrowRight: new BumpAction(1, 0),

  // Num Pad
  Numpad9: new BumpAction(1, -1), // move diagonally up and to the right
  Numpad8: new BumpAction(0, -1), // move up
  Numpad7: new BumpAction(-1, -1), // move diagonally up and to the left
  Numpad4: new BumpAction(-1, 0), // move left
  Numpad1: new BumpAction(-1, 1), // move diagonally down and to the left
  Numpad2: new BumpAction(0, 1), // move down
  Numpad3: new BumpAction(1, 1), // move diagonally down and to the right
  Numpad6: new BumpAction(1, 0), // move right
  Numpad5: new WaitAction(), // wait
};

export function handleInput(event: KeyboardEvent): Action {
  return MOVE_KEYS[event.code];
}

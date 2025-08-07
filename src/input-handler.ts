import { type Action } from "./actions/action";
import { type MovementMap, WaitAction } from "./actions/movement";
import { BumpAction } from "./actions/action-orchestration";
import { LogAction, LOG_KEYS } from "./actions/log";
import { EngineState } from "./engine";

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

  // Wait
  Numpad5: new WaitAction(),
  KeyPeriod: new WaitAction(),

  // Menu
  KeyV: new LogAction(),
};

export function handleGameInput(event: KeyboardEvent): Action {
  return MOVE_KEYS[event.code];
}

export function handleLogInput(event: KeyboardEvent): number {
  const scrollAmount = LOG_KEYS[event.code];

  switch (event.code) {
    case "KeyHome":
      window.engine.logCursorPosition = 0;
      return 0;
    case "KeyEnd":
      window.engine.messageLog.messages.length - 1;
      return 0;
  }

  if (!scrollAmount) {
    window.engine.state = EngineState.Game;
    return 0;
  }

  return scrollAmount;
}

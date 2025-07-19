// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "../configuration";

import { Entity } from "../entity";

export interface BaseComponent {
  entity: Entity | null;
}

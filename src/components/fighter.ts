// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "../configuration";

import { type BaseComponent } from "./base-component";
import { Actor, RenderOrder } from "../entity";
import { Colors } from "../ui/colors";

export class Fighter implements BaseComponent {
  entity: Actor | null;
  _hp: number;
  maxHp: number;
  defense: number;
  power: number;

  constructor(maxHp: number, defense: number, power: number) {
    this.maxHp = maxHp;
    this.defense = defense;
    this.power = power;
    this._hp = maxHp;
    this.entity = null;
  }

  public get hp(): number {
    return this._hp;
  }

  public set hp(value: number) {
    this._hp = Math.max(0, Math.min(value, this.maxHp));

    if (this._hp === 0 && this.entity?.canAct) {
      this.die();
    }
  }

  die() {
    if (!this.entity) return;

    const log = window.engine.messageLog;
    let deathMessage = "";
    let messageColor = null;

    if (window.engine.player === this.entity) {
      deathMessage = "You died!";
      messageColor = Colors.PlayerDie;
    } else {
      deathMessage = `${this.entity.name} is dead!`;
      messageColor = Colors.EnemyDie;
    }

    this.entity.symbol = "%";
    this.entity.foreGroundColor = "#bf0000";
    this.entity.blocksMovement = false;
    this.entity.renderOrder = RenderOrder.Corpse;
    this.entity.ai = null;
    this.entity.name = `Remains of ${this.entity.name}`;

    log.addMessage(deathMessage, messageColor);
  }
}

// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "../configuration";

import { BaseComponent } from "./base-component";
import { Actor, RenderOrder } from "../entity";
import { Colors } from "../ui/colors";

export class Fighter extends BaseComponent {
  parent: Actor | null;
  _hp: number;
  maxHp: number;
  defense: number;
  power: number;

  constructor(maxHp: number, defense: number, power: number) {
    super();
    this.maxHp = maxHp;
    this.defense = defense;
    this.power = power;
    this._hp = maxHp;
    this.parent = null;
  }

  public get hp(): number {
    return this._hp;
  }

  public set hp(value: number) {
    this._hp = Math.max(0, Math.min(value, this.maxHp));

    if (this._hp === 0 && this.parent?.canAct) {
      this.die();
    }
  }

  heal(amount: number): number {
    if (this.hp === this.maxHp) return 0;

    const newHp = Math.min(this.maxHp, this.hp + amount);
    const amountRecovered = newHp - this.hp;
    this.hp = newHp;

    return amountRecovered;
  }

  takeDamage(amount: number) {
    this.hp -= amount;
  }

  die() {
    if (!this.parent) return;

    const log = window.engine.messageLog;
    let deathMessage = "";
    let messageColor = null;

    if (window.engine.player === this.parent) {
      deathMessage = "You died!";
      messageColor = Colors.PlayerDie;
    } else {
      deathMessage = `${this.parent.name} is dead!`;
      messageColor = Colors.EnemyDie;
    }

    this.parent.symbol = "%";
    this.parent.foreGroundColor = "#bf0000";
    this.parent.blocksMovement = false;
    this.parent.renderOrder = RenderOrder.Corpse;
    this.parent.ai = null;
    this.parent.name = `Remains of ${this.parent.name}`;

    log.addMessage(deathMessage, messageColor);
  }
}

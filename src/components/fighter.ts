// Set debug mode in the configuration.ts
import { BaseComponent } from "./base-component";
import { Actor, RenderOrder } from "../entity";
import { Colors } from "../ui/colors";

export class Fighter extends BaseComponent {
  parent: Actor | null;
  _hp: number;
  maxHp: number;
  public baseDefense: number;
  public basePower: number;

  constructor(maxHp: number, defense: number, power: number) {
    super();
    this.maxHp = maxHp;
    this.baseDefense = defense;
    this.basePower = power;
    this._hp = maxHp;
    this.parent = null;
  }

  public get hp(): number {
    return this._hp;
  }

  public get defenseBonus(): number {
    if (this.parent?.equipment) {
      return this.parent.equipment.defenseBonus;
    }

    return 0;
  }

  public get powerBonus(): number {
    if (this.parent?.equipment) {
      return this.parent.equipment.powerBonus;
    }

    return 0;
  }

  public get defense(): number {
    return this.baseDefense + this.defenseBonus;
  }

  public get power(): number {
    return this.basePower + this.powerBonus;
  }

  public set hp(value: number) {
    this._hp = Math.max(0, Math.min(value, this.maxHp));

    if (this._hp === 0 && this.parent?.canAct) {
      this.die();
    }
  }

  public set power(value: number) {
    this.basePower += value;
  }

  public set defense(value: number) {
    this.baseDefense += value;
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

    const log = window.messageLog;
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

    window.engine.player.level.addXp(this.parent.level.xpGiven);
  }
}

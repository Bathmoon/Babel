// Set debug mode in the configuration.ts
// May add additional config in the future
import { debug } from "../configuration";

import { type BaseComponent } from "./base-component";
import { Entity } from "../entity";

export class Fighter implements BaseComponent {
  entity: Entity | null;
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
  }
}

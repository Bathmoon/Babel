export class Health {
  baseHp: number;
  currentHp: number;
  modifiedHp: number | null = null;

  constructor(maxHp: number) {
    this.baseHp = maxHp;
    this.currentHp = maxHp;
  }

  takeDamage(amount: number) {
    this.currentHp = Math.max(this.currentHp - amount, 0);
  }

  heal(amount: number) {
    this.currentHp = Math.min(this.currentHp + amount, this.baseHp);
  }

  isAlive(): boolean {
    return this.currentHp > 0;
  }
}

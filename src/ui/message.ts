export class Message {
  count: number;
  plainText: string;
  foreGroundColor: string;

  constructor(plainText: string, foreGroundColor: string) {
    this.plainText = plainText;
    this.foreGroundColor = foreGroundColor;
    this.count = 1;
  }

  get fullText(): string {
    if (this.count > 1) {
      return `${this.plainText} (x${this.count})`;
    }
    return this.plainText;
  }
}

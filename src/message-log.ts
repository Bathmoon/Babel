import { Display } from "rot-js";
import { Colors } from "./rendering/colors";

export class Message {
  count: number;
  plainText: string;
  foreGroundColor: string;

  constructor(plainText: string, foreGroundColor: string) {
    this.count = 1;
    this.plainText = plainText;
    this.foreGroundColor = foreGroundColor;
  }

  get fullText(): string {
    if (this.count > 1) {
      return `${this.plainText} (x${this.count})`;
    }
    return this.plainText;
  }
}

export class MessageLog {
  messages: Message[];

  constructor() {
    this.messages = [];
  }

  addMessage(
    text: string,
    foreGroundColor: string = Colors.White,
    stackMessages: boolean = true,
  ) {
    if (
      stackMessages &&
      this.messages.length > 0 &&
      this.messages[this.messages.length - 1].plainText === text
    ) {
      this.messages[this.messages.length - 1].count++;
    } else {
      this.messages.push(new Message(text, foreGroundColor));
    }
  }

  renderMessages(
    display: Display,
    x: number,
    y: number,
    width: number,
    height: number,
    messages: Message[],
  ) {
    const reversed = messages.slice().reverse();

    let yOffset = height - 1;

    for (let message of reversed) {
      let lines = [message.fullText];

      if (message.fullText.length > width) {
        const words = message.fullText.split(" ");
        let currentLine = "";

        lines = [];

        // loop through words
        while (words.length > 0) {
          // if current line length + word length > width: start new line
          if ((currentLine + " " + words[0]).length > width) {
            lines.push(currentLine);
            currentLine = "";
          } else {
            // else add word to current line
            currentLine += " " + words.shift();
          }
        }

        lines.push(currentLine);
        lines.reverse();
      }

      for (let line of lines) {
        const text = `%c{${message.foreGroundColor}}${line}`;

        display.drawText(x, y + yOffset, text, width);
        yOffset -= 1;

        if (yOffset < 0) return;
      }
    }
  }

  render(
    display: Display,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.renderMessages(display, x, y, width, height, this.messages);
  }
}

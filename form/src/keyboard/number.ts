import { keyboard_creator } from "./keyboard";
import { KeyboardSpecialKeys } from "./types";

let NUMBER_KEYBOARD = document.createElement("div");

export function createNumberKeyboard() {
  if (NUMBER_KEYBOARD.childElementCount > 0) return NUMBER_KEYBOARD;
  NUMBER_KEYBOARD = keyboard_creator({
    default: {
      keys: [
        [
          ..."789".split("").map((n) => ({ text: n })),
          { text: "⌫", key: KeyboardSpecialKeys.Backspace },
        ],
        [..."456".split("").map((n) => ({ text: n }))],
        [..."123".split("").map((n) => ({ text: n }))],
        [{ text: "🗙", key: KeyboardSpecialKeys.Close }],
      ],
    },
  });

  return NUMBER_KEYBOARD;
}

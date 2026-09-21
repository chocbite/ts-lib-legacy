import { keyboard_creator } from "./keyboard";
import { KeyboardSpecialKeys } from "./types";

let TEXT_KEYBOARD = document.createElement("div");

export function createTextKeyboard() {
  if (TEXT_KEYBOARD.childElementCount > 0) return TEXT_KEYBOARD;
  TEXT_KEYBOARD = keyboard_creator({
    default: {
      max_width: 60,
      key_cols: 4,
      keys: [
        [
          ..."1234567890".split("").map((n) => ({ text: n })),
          { text: "⌫", key: KeyboardSpecialKeys.Backspace },
        ],
        [2, ..."qwertyuiop".split("").map((n) => ({ text: n }))],
        [
          { text: "Esc", key: KeyboardSpecialKeys.Escape, cols: 3 },
          ..."asdfghjkl".split("").map((n) => ({ text: n })),
          { text: "⏎", key: KeyboardSpecialKeys.Enter, cols: 5 },
        ],
        [
          { text: "⇧", key: "layer:shift", cols: 5 },
          ..."zxcvbnm,.".split("").map((n) => ({ text: n })),
        ],
        [
          { text: "Sym", key: "layer:sym", cols: 5 },
          6,
          { text: "Space", key: " ", cols: 20 },
          { text: "🡸", key: KeyboardSpecialKeys.Left },
          { text: "🡺", key: KeyboardSpecialKeys.Right },
          { text: "🗙", key: KeyboardSpecialKeys.Close, cols: 5 },
        ],
      ],
    },
    layers: {
      shift: {
        key_cols: 4,
        keys: [[]],
      },
      sym: {
        key_cols: 4,
        keys: [[]],
      },
    },
  });

  return TEXT_KEYBOARD;
}

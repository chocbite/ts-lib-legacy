import { Keyboard } from "./keyboard";
import { KeyboardSpecialKeys } from "./types";

export const NUMBER_KEYBOARD = new Keyboard({
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

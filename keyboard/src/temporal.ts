import { Keyboard_Keys } from "./keyboard_keys";
import { KeyboardSpecialKeys } from "./types";

function temporal_keyboard(characters: string): Keyboard_Keys {
  const keys = characters.split("").map((text) => ({ text }));

  return new Keyboard_Keys({
    default: {
      max_width: 24,
      keys: [
        [
          ..."789".split("").map((text) => ({ text })),
          ...keys,
          { text: "⌫", key: KeyboardSpecialKeys.Backspace },
        ],
        [
          ..."456".split("").map((text) => ({ text })),
          { text: "Esc", key: KeyboardSpecialKeys.Escape },
        ],
        [
          ..."123".split("").map((text) => ({ text })),
          { text: "⏎", key: KeyboardSpecialKeys.Enter },
        ],
        [
          { text: "0", cols: 2 },
          { text: "🡸", key: KeyboardSpecialKeys.Left },
          { text: "🡺", key: KeyboardSpecialKeys.Right },
          { text: "🗙", key: KeyboardSpecialKeys.Close },
        ],
      ],
    },
  });
}

export const DATE_KEYBOARD = temporal_keyboard("-");
export const DATETIME_LOCAL_KEYBOARD = temporal_keyboard("-:T");
export const MONTH_KEYBOARD = temporal_keyboard("-");
export const TIME_KEYBOARD = temporal_keyboard(":");
export const WEEK_KEYBOARD = temporal_keyboard("-W");

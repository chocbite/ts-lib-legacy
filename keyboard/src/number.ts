import { createButton, KeyboardSpecialKeys } from "./shared";

const NUMBER_KEYBOARD = document.createElement("div");
NUMBER_KEYBOARD.className = "number-keyboard";
NUMBER_KEYBOARD.addEventListener("mousedown", (e) => e.preventDefault());

export function createNumberKeyboard(
  negative: boolean,
  decimal: boolean,
  plus: boolean,
) {
  if (NUMBER_KEYBOARD.childElementCount > 0) return NUMBER_KEYBOARD;

  for (let i = 1; i <= 9; i++)
    createButton(
      NUMBER_KEYBOARD,
      3 - Math.ceil(i / 3) + 1,
      ((i - 1) % 3) + 1,
      1,
      1,
      i.toString(),
      i.toString(),
      {},
    );

  createButton(NUMBER_KEYBOARD, 4, 1, 1, 2, "0", "0", {});

  createButton(NUMBER_KEYBOARD, 1, 4, 1, 1, "⌫", KeyboardSpecialKeys.Back);
  if (negative) createButton(NUMBER_KEYBOARD, 2, 4, 1, 1, "-", "-", {});
  if (plus) createButton(NUMBER_KEYBOARD, 3, 4, 1, 1, "+", "+", {});
  if (decimal) createButton(NUMBER_KEYBOARD, 4, 3, 1, 1, ".", ".", {});
  createButton(NUMBER_KEYBOARD, 4, 4, 1, 1, "🗙", KeyboardSpecialKeys.Close, {});

  return NUMBER_KEYBOARD;
}

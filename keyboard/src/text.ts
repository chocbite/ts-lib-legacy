import { createButton, KeyboardSpecialKeys } from "./shared";

const TEXT_KEYBOARD = document.createElement("div");
TEXT_KEYBOARD.className = "text-keyboard";
TEXT_KEYBOARD.addEventListener("mousedown", (e) => e.preventDefault());

export function createTextKeyboard() {
  if (TEXT_KEYBOARD.childElementCount > 0) return TEXT_KEYBOARD;

  const r1_sym = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].forEach((k, i) =>
    createButton(TEXT_KEYBOARD, 1, i + 1, 1, 1, k, k, {
      shift: [k.toUpperCase(), k.toUpperCase()],
      sym: [r1_sym[i], r1_sym[i]],
    }),
  );
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].forEach((k, i) =>
    createButton(TEXT_KEYBOARD, 2, i + 1, 1, 1, k, k, {
      shift: [k.toUpperCase(), k.toUpperCase()],
    }),
  );
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"].forEach((k, i) =>
    createButton(TEXT_KEYBOARD, 3, i + 1, 1, 1, k, k, {
      shift: [k.toUpperCase(), k.toUpperCase()],
    }),
  );
  ["z", "x", "c", "v", "b", "n", "m"].forEach((k, i) =>
    createButton(TEXT_KEYBOARD, 4, i + 3, 1, 1, k, k, {
      shift: [k.toUpperCase(), k.toUpperCase()],
    }),
  );

  createButton(TEXT_KEYBOARD, 1, 11, 1, 1, "⌫", KeyboardSpecialKeys.Back);
  createButton(TEXT_KEYBOARD, 3, 11, 1, 1, "⏎", KeyboardSpecialKeys.Enter);
  createButton(TEXT_KEYBOARD, 4, 1, 1, 2, "Shift", "Layer:Shift");
  createButton(TEXT_KEYBOARD, 5, 1, 1, 1, "@!", "Layer:Sym");
  createButton(TEXT_KEYBOARD, 5, 3, 1, 1, ",", ",");
  createButton(TEXT_KEYBOARD, 5, 4, 1, 5, "Space", " ");
  createButton(TEXT_KEYBOARD, 5, 9, 1, 1, ".", ".");
  createButton(TEXT_KEYBOARD, 5, 11, 1, 1, "🗙", KeyboardSpecialKeys.Close);

  return TEXT_KEYBOARD;
}

import "./index.scss";
import { Keyboard } from "./keyboard";
import { NUMBER_RATIONAL_KEYBOARD } from "./number";
import { TEXT_KEYBOARD } from "./text";
import { KeyboardConfig, KeyboardType } from "./types";

export { KeyboardType } from "./types";

/**Opens the on-screen keyboard for the specified element with the given mode and returns a function to close it */
export function keyboard_open(
  element: HTMLElement,
  mode: KeyboardType | Keyboard | KeyboardConfig,
): () => void {
  const keyboard =
    mode instanceof Keyboard
      ? mode
      : typeof mode === "object"
        ? new Keyboard(mode)
        : mode === KeyboardType.Text
          ? TEXT_KEYBOARD
          : mode === KeyboardType.NumberRational
            ? NUMBER_RATIONAL_KEYBOARD
            : TEXT_KEYBOARD;

  keyboard.open(element);

  return () => {
    keyboard.close();
  };
}

export function keyboard_create(config: KeyboardConfig): Keyboard {
  return new Keyboard(config);
}

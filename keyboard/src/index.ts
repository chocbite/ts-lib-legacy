import "./index.scss";
import { Keyboard } from "./keyboard";
import {
  NUMBER_INTEGER_KEYBOARD,
  NUMBER_RATIONAL_KEYBOARD,
  NUMBER_RATIONAL_POSITIVE_KEYBOARD,
  NUMBER_WHOLE_KEYBOARD,
  PHONE_KEYBOARD,
} from "./number";
import { TEXT_KEYBOARD } from "./text";
import { KeyboardConfig, KeyboardType } from "./types";

export { KeyboardType } from "./types";

const KEYBOARDS: Record<KeyboardType, Keyboard> = {
  [KeyboardType.Text]: TEXT_KEYBOARD,
  [KeyboardType.NumberWhole]: NUMBER_WHOLE_KEYBOARD,
  [KeyboardType.NumberInteger]: NUMBER_INTEGER_KEYBOARD,
  [KeyboardType.NumberRationalPositive]: NUMBER_RATIONAL_POSITIVE_KEYBOARD,
  [KeyboardType.NumberRational]: NUMBER_RATIONAL_KEYBOARD,
  [KeyboardType.Phone]: PHONE_KEYBOARD,
};

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
        : KEYBOARDS[mode];

  keyboard.open(element);

  return () => {
    keyboard.close();
  };
}

export function keyboard_create(config: KeyboardConfig): Keyboard {
  return new Keyboard(config);
}

import { keyboard_type } from "./helpers";
import "./index.scss";
import { Keyboard } from "./keyboard";
import {
  NUMBER_INTEGER_KEYBOARD,
  NUMBER_RATIONAL_KEYBOARD,
  NUMBER_RATIONAL_POSITIVE_KEYBOARD,
  NUMBER_WHOLE_KEYBOARD,
  PHONE_KEYBOARD,
} from "./number";
import { VIRTUAL_KEYBOARD } from "./settings";
import { TEXT_KEYBOARD } from "./text";
import { KeyboardConfig, KeyboardType } from "./types";

export { VIRTUAL_KEYBOARD } from "./settings";
export { KeyboardType } from "./types";

const KEYBOARDS: Record<KeyboardType, Keyboard> = {
  [KeyboardType.Text]: TEXT_KEYBOARD,
  [KeyboardType.NumberWhole]: NUMBER_WHOLE_KEYBOARD,
  [KeyboardType.NumberInteger]: NUMBER_INTEGER_KEYBOARD,
  [KeyboardType.NumberRationalPositive]: NUMBER_RATIONAL_POSITIVE_KEYBOARD,
  [KeyboardType.NumberRational]: NUMBER_RATIONAL_KEYBOARD,
  [KeyboardType.Phone]: PHONE_KEYBOARD,
};

/**Opens the on-screen keyboard for the specified element with the given mode and returns a function to close it
 * @param element The HTML element to attach the keyboard to.
 * @param mode The keyboard mode, which can be a predefined type, a custom keyboard instance, or a keyboard configuration.
 * @returns A function that closes the keyboard when called. */
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

/** Attaches automatic virtual-keyboard handling to a document and returns a cleanup function. */
export function keyboard_attach(
  document: Document = window.document,
): () => void {
  let close: (() => void) | undefined;

  const close_keyboard = () => {
    close?.();
    close = undefined;
  };
  const open_keyboard = (element: HTMLElement) => {
    const type = keyboard_type(element);
    if (!type || !VIRTUAL_KEYBOARD.ok()) return;
    close_keyboard();
    close = keyboard_open(element, type);
  };
  const on_focus = (event: FocusEvent) => {
    if (event.target instanceof HTMLElement) open_keyboard(event.target);
  };
  const on_virtual_keyboard_change = (value: { value: boolean }) => {
    if (!value.value) {
      close_keyboard();
      return;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement) open_keyboard(active);
  };

  document.addEventListener("focusin", on_focus);
  VIRTUAL_KEYBOARD.sub(on_virtual_keyboard_change, true);

  return () => {
    document.removeEventListener("focusin", on_focus);
    VIRTUAL_KEYBOARD.unsub(on_virtual_keyboard_change);
    close_keyboard();
  };
}

/** Creates a new on-screen keyboard instance with the specified configuration */
export function keyboard_create(config: KeyboardConfig): Keyboard {
  return new Keyboard(config);
}

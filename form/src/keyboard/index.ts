import "./index.scss";
import { show_keyboard } from "./shared";
import { createTextKeyboard } from "./text";
import { KeyboardMode } from "./types";

/**Opens the on-screen keyboard for the specified element with the given mode and returns a function to close it */
export function keyboard_open(
  element: HTMLElement,
  mode: KeyboardMode,
): () => void {
  const keyboard =
    typeof mode === "object"
      ? (mode as HTMLElement)
      : mode === "text"
        ? createTextKeyboard()
        : null;

  show_keyboard(element, keyboard);

  return () => {
    console.warn("Keyboard closed");
  };
}

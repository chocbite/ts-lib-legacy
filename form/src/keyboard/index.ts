import "./index.scss";
import { Keyboard } from "./keyboard";
import { TEXT_KEYBOARD } from "./text";
import { KeyboardMode } from "./types";

/**Opens the on-screen keyboard for the specified element with the given mode and returns a function to close it */
export function keyboard_open(
  element: HTMLElement,
  mode: KeyboardMode,
): () => void {
  const keyboard =
    typeof mode === "object"
      ? new Keyboard(mode)
      : mode === "text"
        ? TEXT_KEYBOARD
        : null;

  keyboard!.open(element);

  return () => {
    keyboard!.close();
  };
}

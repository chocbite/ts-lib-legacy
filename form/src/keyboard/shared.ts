import state from "@chocbite/ts-lib-state";
import { KeyboardSpecialKeys } from "./types";

const KEYBOARD_CONTAINER = document.createElement("div");
KEYBOARD_CONTAINER.id = "keyboard-container";
KEYBOARD_CONTAINER.addEventListener("mousedown", (e) => e.preventDefault());

let keyboard_element: HTMLElement | null = null;

export function show_keyboard(element: HTMLElement, keyboard: HTMLElement) {
  keyboard_element = element;
  layer_select.write("default");
  KEYBOARD_CONTAINER.replaceChildren(keyboard);
  element.ownerDocument.documentElement.appendChild(KEYBOARD_CONTAINER);
  const listener = (e: PointerEvent) => {
    if (e.target === element || KEYBOARD_CONTAINER.contains(e.target as Node))
      return;
    element.ownerDocument.removeEventListener("pointerdown", listener, {
      capture: true,
    });
    close_keyboard();
  };
  element.ownerDocument.addEventListener("pointerdown", listener, {
    capture: true,
  });
}

function close_keyboard() {
  KEYBOARD_CONTAINER.remove();
}

const layer_select = state.ok_w("default");

export function executeKey(key: string) {
  if (key.length === 0) close_keyboard();
  else if (key.length === 1) {
    if (keyboard_element) {
      const start = keyboard_element.selectionStart ?? 0;
      const end = keyboard_element.selectionEnd ?? 0;
      const value = keyboard_element.value;
      keyboard_element.value = value.slice(0, start) + key + value.slice(end);
      keyboard_element.setSelectionRange(start + 1, start + 1);
    }
  } else if (key.includes("layer")) {
    const layer_name = key.split(":")[1];
    if (layer_name === layer_select.ok()) layer_select.write("default");
    else layer_select.write(layer_name);
  } else if (key === KeyboardSpecialKeys.Close) close_keyboard();
}

layer_select.sub(console.warn);

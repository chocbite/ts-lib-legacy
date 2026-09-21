import { createTextKeyboard } from "./text";

const KEYBOARD_CONTAINER = document.createElement("div");
KEYBOARD_CONTAINER.id = "keyboard-container";
KEYBOARD_CONTAINER.addEventListener("mousedown", (e) => e.preventDefault());

let keyboard_element: HTMLElement | null = null;

export function showKeyboard(element: HTMLElement) {
  keyboard_element = element;
  setLayer("default");
  KEYBOARD_CONTAINER.replaceChildren(createTextKeyboard());
  element.ownerDocument.documentElement.appendChild(KEYBOARD_CONTAINER);
  const listener = (e: PointerEvent) => {
    if (e.target === element || KEYBOARD_CONTAINER.contains(e.target as Node))
      return;
    element.ownerDocument.removeEventListener("pointerdown", listener, {
      capture: true,
    });
    closeKeyboard();
  };
  element.ownerDocument.addEventListener("pointerdown", listener, {
    capture: true,
  });
}

function closeKeyboard() {
  KEYBOARD_CONTAINER.remove();
}

export const KeyboardSpecialKeys = {
  Close: "close",
  Back: "back",
  Enter: "enter",
} as const;
export type KeyboardSpecialKeys =
  (typeof KeyboardSpecialKeys)[keyof typeof KeyboardSpecialKeys];

export function executeKey(key: string) {
  if (key.length === 0) closeKeyboard();
  else if (key.length === 1) {
    if (keyboard_element) {
      const start = keyboard_element.selectionStart ?? 0;
      const end = keyboard_element.selectionEnd ?? 0;
      const value = keyboard_element.value;
      keyboard_element.value = value.slice(0, start) + key + value.slice(end);
      keyboard_element.setSelectionRange(start + 1, start + 1);
    }
  } else if (key === KeyboardSpecialKeys.Close) closeKeyboard();
}

let layer = "default";
export function setLayer(newLayer: string) {
  KEYBOARD_CONTAINER.classList.remove(`layer-${layer}`);
  layer = newLayer;
  KEYBOARD_CONTAINER.classList.add(`layer-${newLayer}`);
}

export function createButton(
  board: HTMLElement,
  row: number,
  column: number,
  rspan: number,
  cspan: number,
  text: string,
  key: string,
  layers?: { [key: string]: [string, string] },
) {
  const BUTTON = board.appendChild(document.createElement("button"));
  BUTTON.textContent = text;
  BUTTON.addEventListener("mousedown", (e) => e.preventDefault());
  BUTTON.addEventListener("click", () =>
    executeKey(layer === "default" ? key : (layers?.[layer]?.[0] ?? "")),
  );
  BUTTON.style.gridRow = row.toString();
  BUTTON.style.gridColumn = column.toString();
  BUTTON.style.gridRowEnd = `${row + rspan}`;
  BUTTON.style.gridColumnEnd = `${column + cspan}`;
  return BUTTON;
}

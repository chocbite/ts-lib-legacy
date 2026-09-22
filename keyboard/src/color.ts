import { define_element } from "@chocbite/ts-lib-base";
import { KeyboardBase } from "./base";

const COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
] as const;

export class Keyboard_Color extends KeyboardBase {
  static element_name(): string {
    return "keyboard-color";
  }

  #input?: HTMLInputElement;
  #swatches: HTMLButtonElement[] = [];
  #on_input = () => this.#update_selection();

  constructor() {
    super();
    this.classList.add("keyboard-color");

    const container = this.appendChild(document.createElement("div"));
    container.className = "keyboard-color-content";
    const title = container.appendChild(document.createElement("span"));
    title.textContent = "Select color";
    const swatches = container.appendChild(document.createElement("div"));
    swatches.className = "keyboard-color-swatches";

    COLORS.forEach((color) => {
      const swatch = swatches.appendChild(document.createElement("button"));
      swatch.type = "button";
      swatch.title = color;
      swatch.ariaLabel = color;
      swatch.style.backgroundColor = color;
      swatch.addEventListener("click", () => this.#select(color));
      this.#swatches.push(swatch);
    });
  }

  open(element: HTMLElement): void {
    if (!(element instanceof HTMLInputElement) || element.type !== "color")
      return;
    this.#input?.removeEventListener("input", this.#on_input);
    this.#input = element;
    this.#input.addEventListener("input", this.#on_input);
    this.#update_selection();
    super.open(element);
  }

  close(): void {
    this.#input?.removeEventListener("input", this.#on_input);
    this.#input = undefined;
    super.close();
  }

  #select(color: string): void {
    const input = this.#input;
    if (!input || input.value === color) return;
    input.value = color;
    this.#update_selection();
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  #update_selection(): void {
    const value = this.#input?.value.toLowerCase();
    this.#swatches.forEach((swatch) => {
      swatch.toggleAttribute("active", swatch.title === value);
    });
  }
}
define_element(Keyboard_Color);

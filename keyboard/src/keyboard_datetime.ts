import { define_element } from "@chocbite/ts-lib-base";
import { KeyboardBase } from "./base";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function date_value(date: Date): string {
  return [
    date.getFullYear().toString().padStart(4, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
}

function date_from_value(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date_value(date) === value ? date : undefined;
}

export class Keyboard_DateTime extends KeyboardBase {
  #input?: HTMLInputElement;
  #view = new Date();
  #changed = false;

  static element_name(): string {
    return "keyboard-datetime";
  }

  static element_name_space(): string {
    return "onscreen-keyboard";
  }

  constructor() {
    super();
    this.classList.add("keyboard-datetime");
    this.addEventListener("mousedown", (event) => event.preventDefault());
  }

  open(element: HTMLElement): void {
    if (!(element instanceof HTMLInputElement) || element.type !== "date") return;

    this.#input = element;
    this.#view = date_from_value(element.value) ?? new Date();
    this.#view.setDate(1);
    this.#changed = false;
    this.#render();
    super.open(element);
  }

  close(): void {
    if (this.elem && this.#changed)
      this.elem.dispatchEvent(new Event("change", { bubbles: true }));
    this.#input = undefined;
    this.#changed = false;
    super.close();
  }

  #render(): void {
    const header = document.createElement("div");
    header.className = "keyboard-datetime-header";
    header.append(
      this.#button("‹", () => this.#move_month(-1)),
      Object.assign(document.createElement("strong"), {
        textContent: `${MONTHS[this.#view.getMonth()]} ${this.#view.getFullYear()}`,
      }),
      this.#button("›", () => this.#move_month(1)),
    );

    const calendar = document.createElement("div");
    calendar.className = "keyboard-datetime-calendar";
    WEEKDAYS.forEach((day) => {
      const label = document.createElement("span");
      label.textContent = day;
      calendar.appendChild(label);
    });

    const first_day = new Date(this.#view.getFullYear(), this.#view.getMonth(), 1);
    const start = new Date(first_day);
    start.setDate(1 - first_day.getDay());
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const button = this.#button(date.getDate().toString(), () =>
        this.#select_date(date),
      );
      button.disabled = !this.#date_allowed(date);
      if (date.getMonth() !== this.#view.getMonth()) button.classList.add("outside");
      if (date_value(date) === this.#input?.value) button.classList.add("selected");
      calendar.appendChild(button);
    }

    const container = document.createElement("div");
    container.append(header, calendar);
    this.replaceChildren(container);
  }

  #button(text: string, click: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.addEventListener("click", click);
    return button;
  }

  #move_month(offset: number): void {
    this.#view.setMonth(this.#view.getMonth() + offset, 1);
    this.#render();
  }

  #date_allowed(date: Date): boolean {
    const value = date_value(date);
    const input = this.#input;
    return !!input && (!input.min || value >= input.min) && (!input.max || value <= input.max);
  }

  #select_date(date: Date): void {
    const input = this.#input;
    if (!input || !this.#date_allowed(date)) return;
    const value = date_value(date);
    if (input.value !== value) {
      input.value = value;
      this.#changed = true;
      input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
    this.close();
  }
}
define_element(Keyboard_DateTime);

export const DATETIME_KEYBOARD = new Keyboard_DateTime();

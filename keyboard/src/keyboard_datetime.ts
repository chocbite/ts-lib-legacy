import { define_element } from "@chocbite/ts-lib-base";
import { KeyboardBase } from "./base";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DATE_TYPES = ["date", "datetime-local", "month", "time", "week"];

function date_value(date: Date): string {
  return `${date.getFullYear().toString().padStart(4, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

function date_from_value(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date_value(date) === match[0] ? date : undefined;
}

function week_value(date: Date): string {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const year = utc.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((utc.getTime() - start.getTime()) / 86400000 + 1) / 7);
  return `${year}-W${week.toString().padStart(2, "0")}`;
}

export class Keyboard_DateTime extends KeyboardBase {
  #input?: HTMLInputElement;
  #view = new Date();
  #changed = false;
  #hour_group = 0;
  #minute_group = 0;

  static element_name(): string { return "keyboard-datetime"; }
  static element_name_space(): string { return "onscreen-keyboard"; }

  constructor() {
    super();
    this.classList.add("keyboard-datetime");
    this.addEventListener("mousedown", (event) => event.preventDefault());
  }

  open(element: HTMLElement): void {
    if (!(element instanceof HTMLInputElement) || !DATE_TYPES.includes(element.type)) return;
    this.#input = element;
    this.#view = date_from_value(element.value) ?? new Date();
    this.#view.setDate(1);
    const time = element.value.match(/T?(\d{2}):(\d{2})/) ?? [];
    this.#hour_group = Math.floor(Number(time[1] ?? 0) / 4);
    this.#minute_group = Math.floor(Number(time[2] ?? 0) / 10);
    this.#changed = false;
    this.#render();
    super.open(element);
  }

  close(): void {
    if (this.elem && this.#changed) this.elem.dispatchEvent(new Event("change", { bubbles: true }));
    this.#input = undefined;
    this.#changed = false;
    super.close();
  }

  #render(): void {
    const container = document.createElement("div");
    const type = this.#input?.type;
    if (type === "datetime-local")
      container.className = "keyboard-datetime-local";
    if (type === "month") container.appendChild(this.#month_picker());
    else if (type === "time") container.appendChild(this.#time_picker());
    else {
      container.appendChild(type === "week" ? this.#week_picker() : this.#calendar());
      if (type === "datetime-local") container.appendChild(this.#time_picker());
    }
    this.replaceChildren(container);
  }

  #calendar(): HTMLElement {
    const picker = document.createElement("div");
    const header = document.createElement("div");
    header.className = "keyboard-datetime-header";
    header.append(
      this.#button("‹", () => this.#move_month(-1)),
      Object.assign(document.createElement("strong"), { textContent: `${MONTHS[this.#view.getMonth()]} ${this.#view.getFullYear()}` }),
      this.#button("›", () => this.#move_month(1)),
      this.#button("🗙", () => this.close()),
    );
    const calendar = document.createElement("div");
    calendar.className = "keyboard-datetime-calendar";
    WEEKDAYS.forEach((day) => calendar.append(Object.assign(document.createElement("span"), { textContent: day })));
    const first = new Date(this.#view.getFullYear(), this.#view.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const value = this.#input?.type === "week" ? week_value(date) : date_value(date);
      const button = this.#button(date.getDate().toString(), () => this.#select_date(date));
      button.disabled = !this.#value_allowed(value);
      if (date.getMonth() !== this.#view.getMonth()) button.classList.add("outside");
      if (value === this.#input?.value) button.classList.add("selected");
      calendar.append(button);
    }
    picker.append(header, calendar);
    return picker;
  }

  #month_picker(): HTMLElement {
    const picker = document.createElement("div");
    const header = document.createElement("div");
    header.className = "keyboard-datetime-header";
    header.append(
      this.#button("‹", () => this.#move_year(-1)),
      Object.assign(document.createElement("strong"), {
        textContent: this.#view.getFullYear().toString(),
      }),
      this.#button("›", () => this.#move_year(1)),
      this.#button("🗙", () => this.close()),
    );
    const months = document.createElement("div");
    months.className = "keyboard-datetime-months";
    MONTHS.forEach((month, index) => {
      const value = `${this.#view.getFullYear()}-${(index + 1).toString().padStart(2, "0")}`;
      const button = this.#button(month.slice(0, 3), () => { this.#set_value(value); this.close(); });
      button.disabled = !this.#value_allowed(value);
      if (value === this.#input?.value) button.classList.add("selected");
      months.append(button);
    });
    picker.append(header, months);
    return picker;
  }

  #week_picker(): HTMLElement {
    const picker = document.createElement("div");
    const header = document.createElement("div");
    header.className = "keyboard-datetime-header";
    header.append(
      this.#button("‹", () => this.#move_month(-1)),
      Object.assign(document.createElement("strong"), { textContent: `${MONTHS[this.#view.getMonth()]} ${this.#view.getFullYear()}` }),
      this.#button("›", () => this.#move_month(1)),
      this.#button("🗙", () => this.close()),
    );
    const weeks = document.createElement("div");
    weeks.className = "keyboard-datetime-weeks";
    const first = new Date(this.#view.getFullYear(), this.#view.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    for (let index = 0; index < 6; index += 1) {
      const monday = new Date(start);
      monday.setDate(start.getDate() + index * 7);
      const value = week_value(monday);
      const row = document.createElement("div");
      row.className = "keyboard-datetime-week";
      const button = this.#button(`W${value.slice(-2)}`, () => {
        this.#set_value(value);
        this.close();
      });
      button.disabled = !this.#value_allowed(value);
      if (value === this.#input?.value) button.classList.add("selected");
      const dates = document.createElement("div");
      dates.className = "keyboard-datetime-week-dates";
      for (let day = 0; day < 7; day += 1) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + day);
        const label = document.createElement("span");
        label.textContent = date.getDate().toString();
        if (date.getMonth() !== this.#view.getMonth()) label.classList.add("outside");
        dates.append(label);
      }
      row.append(button, dates);
      weeks.append(row);
    }
    picker.append(header, weeks);
    return picker;
  }

  #time_picker(): HTMLElement {
    const controls = document.createElement("div");
    controls.className = "keyboard-datetime-time";
    const hours = document.createElement("div");
    hours.className = "keyboard-datetime-time-column";
    for (let group = 0; group < 6; group += 1) {
      const start = group * 4;
      const button = this.#button(`${start}-${start + 3}`, () => {
        this.#hour_group = group;
        this.#render();
      });
      if (group === this.#hour_group) button.classList.add("selected");
      hours.append(button);
    }

    const hour_values = document.createElement("div");
    hour_values.className = "keyboard-datetime-time-column";
    for (let hour = this.#hour_group * 4; hour < this.#hour_group * 4 + 4; hour += 1) {
      hour_values.append(this.#button(hour.toString().padStart(2, "0"), () => this.#set_time(hour, this.#time_parts()[1])));
    }

    const minute_groups = document.createElement("div");
    minute_groups.className = "keyboard-datetime-time-column";
    for (let group = 0; group < 6; group += 1) {
      const start = group * 10;
      const button = this.#button(`${start.toString().padStart(2, "0")}-${(start + 9).toString().padStart(2, "0")}`, () => {
        this.#minute_group = group;
        this.#render();
      });
      if (group === this.#minute_group) button.classList.add("selected");
      minute_groups.append(button);
    }

    const minute_values_left = document.createElement("div");
    minute_values_left.className = "keyboard-datetime-time-column";
    const minute_values_right = document.createElement("div");
    minute_values_right.className = "keyboard-datetime-time-column";
    for (let offset = 0; offset < 10; offset += 1) {
      const minute = this.#minute_group * 10 + offset;
      const button = this.#button(minute.toString().padStart(2, "0"), () => this.#set_time(this.#time_parts()[0], minute));
      (offset < 5 ? minute_values_left : minute_values_right).append(button);
    }
    controls.append(hours, hour_values, minute_groups, minute_values_left, minute_values_right);
    return controls;
  }

  #time_parts(): [number, number] {
    const time = this.#input?.value.match(/T?(\d{2}):(\d{2})/) ?? [];
    return [Number(time[1] ?? 0), Number(time[2] ?? 0)];
  }

  #set_time(hour: number, minute: number): void {
    const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    if (this.#input?.type === "time") this.#set_value(time);
    else this.#set_value(`${date_value(this.#selected_date())}T${time}`);
  }

  #selected_date(): Date {
    return date_from_value(this.#input?.value ?? "") ?? new Date(this.#view);
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

  #move_year(offset: number): void {
    this.#view.setFullYear(this.#view.getFullYear() + offset, 0, 1);
    this.#render();
  }

  #select_date(date: Date): void {
    const type = this.#input?.type;
    if (type === "week") {
      this.#set_value(week_value(date));
      return this.close();
    }
    const value = type === "datetime-local"
      ? `${date_value(date)}T${this.#input?.value.match(/T(\d{2}:\d{2})/)?.[1] ?? "00:00"}`
      : date_value(date);
    this.#set_value(value);
    if (type === "date") this.close();
  }

  #value_allowed(value: string): boolean {
    const input = this.#input;
    if (!input) return false;
    const candidate = input.ownerDocument.createElement("input");
    candidate.type = input.type;
    candidate.min = input.min;
    candidate.max = input.max;
    candidate.step = input.step;
    candidate.value = value;
    return candidate.value === value && candidate.checkValidity();
  }

  #set_value(value: string): void {
    const input = this.#input;
    if (!input || !this.#value_allowed(value) || input.value === value) return;
    input.value = value;
    this.#changed = true;
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  }
}
define_element(Keyboard_DateTime);

export const DATETIME_KEYBOARD = new Keyboard_DateTime();

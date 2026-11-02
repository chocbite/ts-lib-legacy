import { Base, define_element } from "@chocbite/ts-lib-base";
import type { WidgetBase } from "./widget";

/**Viewport showing a fixed size page of widgets
 * The page is scaled to fit inside the viewport element while keeping its aspect ratio, and centered
 * width and height are the size of the page in viewport units, not the size of the element*/
export class Viewport extends Base {
  /**Returns the name used to define the element */
  static element_name() {
    return "viewport";
  }
  /**Returns the namespace override for the element*/
  static element_name_space() {
    return "viewport";
  }

  #page: HTMLDivElement = this.appendChild(document.createElement("div"));
  #canvas_width: number = 1920;
  #canvas_height: number = 1080;
  #scale: number = 1;
  #widgets: readonly WidgetBase[] = [];

  constructor() {
    super();
    this.style.display = "block";
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.#page.style.position = "absolute";
    this.#page.style.left = "0px";
    this.#page.style.top = "0px";
    this.#page.style.overflow = "hidden";
    this.#page.style.transformOrigin = "0 0";
    this.#page.style.width = this.#canvas_width + "px";
    this.#page.style.height = this.#canvas_height + "px";
    this.attach_to_resize_observer();
  }

  /**Sets the width of the page */
  set canvas_width(width: number) {
    this.#canvas_width = width;
    this.#page.style.width = width + "px";
    this.#update_scale(this.actual_size);
  }
  /**Returns the width of the page */
  get canvas_width(): number {
    return this.#canvas_width;
  }

  /**Sets the height of the page */
  set canvas_height(height: number) {
    this.#canvas_height = height;
    this.#page.style.height = height + "px";
    this.#update_scale(this.actual_size);
  }
  /**Returns the height of the page */
  get canvas_height(): number {
    return this.#canvas_height;
  }

  /**Returns the current scale from page units to screen pixels */
  get scale(): number {
    return this.#scale;
  }

  /**Sets the widgets on the page, the array order is the drawing order with the last widget on top
   * Widgets already on the page are kept in place, so they are only reconnected if their order changes */
  set widgets(widgets: readonly WidgetBase[]) {
    const keep = new Set(widgets);
    for (const widget of this.#widgets)
      if (!keep.has(widget) && widget.parentElement === this.#page)
        widget.remove();
    for (let i = 0; i < widgets.length; i++) {
      const current = this.#page.children[i];
      if (current !== widgets[i])
        this.#page.insertBefore(widgets[i], current ?? null);
    }
    this.#widgets = widgets;
  }
  /**Returns the widgets on the page */
  get widgets(): readonly WidgetBase[] {
    return this.#widgets;
  }

  protected on_resize(rect: { width: number; height: number }): void {
    this.#update_scale(rect);
  }

  #update_scale(rect: { width: number; height: number }) {
    if (this.#canvas_width <= 0 || this.#canvas_height <= 0) return;
    this.#scale = Math.min(
      rect.width / this.#canvas_width,
      rect.height / this.#canvas_height,
    );
    const offset_x = (rect.width - this.#canvas_width * this.#scale) / 2;
    const offset_y = (rect.height - this.#canvas_height * this.#scale) / 2;
    this.#page.style.transform = `translate(${offset_x}px, ${offset_y}px) scale(${this.#scale})`;
  }
}
define_element(Viewport);

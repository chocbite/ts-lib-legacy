import { Base, define_element } from "@chocbite/ts-lib-base";
import type { Page } from "./page";

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 20;
/**Zoom factor per wheel pixel */
const WHEEL_ZOOM_SPEED = 0.002;
/**Screen pixels panned per wheel pixel */
const WHEEL_PAN_SPEED = 0.5;
/**Pixels per line, for wheel events reported in lines */
const WHEEL_LINE_HEIGHT = 16;
/**Speed multiplier for wheel zoom and pan while alt is held */
const WHEEL_SLOW = 0.1;
const CHECKERBOARD =
  "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 20px 20px";

/**Viewport showing a page of widgets
 * The page is scaled to fit inside the viewport element while keeping its aspect ratio, and centered
 *
 * When edit is true the page can be zoomed and panned, and a checkerboard is shown behind it
 * Vertical wheel zooms toward the cursor, horizontal wheel pans horizontally
 * Ctrl + vertical wheel pans vertically
 * Holding alt makes wheel zoom and pan 10 times slower
 * Two finger touch pinch zooms and pans, middle mouse drag pans*/
export class Viewport extends Base {
  /**Returns the name used to define the element */
  static element_name() {
    return "viewport";
  }
  /**Returns the namespace override for the element*/
  static element_name_space() {
    return "viewport";
  }

  #background: HTMLDivElement = this.appendChild(
    document.createElement("div"),
  );
  #container: HTMLDivElement = this.appendChild(document.createElement("div"));
  #page: Page | undefined;
  #page_observer = new ResizeObserver(() => {
    this.#update_view();
  });
  #scale: number = 1;
  #fit_x: number = 0;
  #fit_y: number = 0;
  #edit: boolean = false;
  #zoom: number = 1;
  #pan_x: number = 0;
  #pan_y: number = 0;
  #touches = new Map<number, { x: number; y: number }>();
  #middle_id: number | undefined;
  #middle_last = { x: 0, y: 0 };

  constructor() {
    super();
    this.style.display = "block";
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.#background.style.position = "absolute";
    this.#background.style.inset = "0";
    this.#background.style.background = CHECKERBOARD;
    this.#background.style.display = "none";
    this.#container.style.position = "absolute";
    this.#container.style.left = "0px";
    this.#container.style.top = "0px";
    this.#container.style.transformOrigin = "0 0";
    this.attach_to_resize_observer();
  }

  /**Sets the page shown in the viewport */
  set page(page: Page | undefined) {
    if (this.#page === page) return;
    if (this.#page) {
      this.#page_observer.unobserve(this.#page);
      if (this.#page.parentElement === this.#container) this.#page.remove();
    }
    this.#page = page;
    if (page) {
      this.#container.appendChild(page);
      this.#page_observer.observe(page);
    }
    this.#update_view();
  }
  /**Returns the page shown in the viewport */
  get page(): Page | undefined {
    return this.#page;
  }

  /**Sets edit mode, which enables zooming and panning and shows a checkerboard background
   * Leaving edit mode resets the view to fit the page */
  set edit(edit: boolean) {
    if (this.#edit === edit) return;
    this.#edit = edit;
    this.#background.style.display = edit ? "" : "none";
    this.style.touchAction = edit ? "none" : "";
    if (edit) {
      this.addEventListener("wheel", this.#on_wheel, { passive: false });
      this.addEventListener("pointerdown", this.#on_pointer_down);
      this.addEventListener("pointermove", this.#on_pointer_move);
      this.addEventListener("pointerup", this.#on_pointer_up);
      this.addEventListener("pointercancel", this.#on_pointer_up);
      this.addEventListener("mousedown", this.#on_mouse_down);
    } else {
      this.removeEventListener("wheel", this.#on_wheel);
      this.removeEventListener("pointerdown", this.#on_pointer_down);
      this.removeEventListener("pointermove", this.#on_pointer_move);
      this.removeEventListener("pointerup", this.#on_pointer_up);
      this.removeEventListener("pointercancel", this.#on_pointer_up);
      this.removeEventListener("mousedown", this.#on_mouse_down);
      this.#touches.clear();
      this.#middle_id = undefined;
      this.#zoom = 1;
      this.#pan_x = 0;
      this.#pan_y = 0;
      this.#update_view();
    }
  }
  /**Returns whether edit mode is enabled */
  get edit(): boolean {
    return this.#edit;
  }

  /**Returns the current scale from page units to screen pixels */
  get scale(): number {
    return this.#scale;
  }

  protected on_resize(): void {
    this.#update_view();
  }

  #update_view() {
    if (!this.#page) return;
    const width = this.#page.width;
    const height = this.#page.height;
    if (width <= 0 || height <= 0) return;
    const rect = this.actual_size;
    const fit = Math.min(rect.width / width, rect.height / height);
    this.#fit_x = (rect.width - width * fit) / 2;
    this.#fit_y = (rect.height - height * fit) / 2;
    this.#scale = fit * this.#zoom;
    this.#container.style.transform = `translate(${this.#fit_x + this.#pan_x}px, ${this.#fit_y + this.#pan_y}px) scale(${this.#scale})`;
  }

  /**Zooms by the factor, keeping the given point in viewport coordinates in place */
  #zoom_at(x: number, y: number, factor: number) {
    const zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, this.#zoom * factor));
    const ratio = zoom / this.#zoom;
    this.#pan_x += (x - this.#fit_x - this.#pan_x) * (1 - ratio);
    this.#pan_y += (y - this.#fit_y - this.#pan_y) * (1 - ratio);
    this.#zoom = zoom;
  }

  /**Returns the position of the event in viewport coordinates */
  #local(e: MouseEvent): { x: number; y: number } {
    const rect = this.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  /**Returns center and distance of the first two touches */
  #pinch(): { x: number; y: number; distance: number } | undefined {
    if (this.#touches.size < 2) return undefined;
    const [a, b] = this.#touches.values();
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
      distance: Math.hypot(a.x - b.x, a.y - b.y),
    };
  }

  #on_wheel = (e: WheelEvent) => {
    e.preventDefault();
    const unit =
      e.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? WHEEL_LINE_HEIGHT
        : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? this.actual_size.height
          : 1;
    const delta_x = e.deltaX * unit;
    const delta_y = e.deltaY * unit;
    const speed = e.altKey ? WHEEL_SLOW : 1;
    this.#pan_x -= delta_x * speed * WHEEL_PAN_SPEED;
    if (e.ctrlKey) this.#pan_y -= delta_y * speed * WHEEL_PAN_SPEED;
    else if (delta_y !== 0) {
      const point = this.#local(e);
      this.#zoom_at(
        point.x,
        point.y,
        Math.exp(-delta_y * WHEEL_ZOOM_SPEED * speed),
      );
    }
    this.#update_view();
  };

  #on_pointer_down = (e: PointerEvent) => {
    if (e.pointerType === "touch") {
      this.#touches.set(e.pointerId, this.#local(e));
      this.setPointerCapture(e.pointerId);
    } else if (e.button === 1) {
      e.preventDefault();
      this.#middle_id = e.pointerId;
      this.#middle_last = this.#local(e);
      this.setPointerCapture(e.pointerId);
    }
  };

  #on_pointer_move = (e: PointerEvent) => {
    if (this.#touches.has(e.pointerId)) {
      const before = this.#pinch();
      this.#touches.set(e.pointerId, this.#local(e));
      const after = this.#pinch();
      if (!before || !after || before.distance <= 0) return;
      this.#pan_x += after.x - before.x;
      this.#pan_y += after.y - before.y;
      this.#zoom_at(after.x, after.y, after.distance / before.distance);
      this.#update_view();
    } else if (e.pointerId === this.#middle_id) {
      const point = this.#local(e);
      this.#pan_x += point.x - this.#middle_last.x;
      this.#pan_y += point.y - this.#middle_last.y;
      this.#middle_last = point;
      this.#update_view();
    }
  };

  #on_pointer_up = (e: PointerEvent) => {
    this.#touches.delete(e.pointerId);
    if (e.pointerId === this.#middle_id) this.#middle_id = undefined;
  };

  /**Prevents the browser autoscroll on middle mouse button */
  #on_mouse_down = (e: MouseEvent) => {
    if (e.button === 1) e.preventDefault();
  };
}
define_element(Viewport);

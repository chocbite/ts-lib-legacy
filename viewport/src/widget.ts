import { Base } from "@chocbite/ts-lib-base";

/**Shared class for widgets placed at a fixed position in a viewport
 * Position and size are in viewport units (px before any viewport scaling)
 * Rotation is in degrees clockwise around the center of the widget
 *
 * Widgets declare their original size, which is the size their content is designed for
 * When stretch is true, the content is laid out at the original size and scaled to the width and height of the widget
 * When stretch is false, the content is laid out at the width and height of the widget*/
export abstract class WidgetBase extends Base {
  /**Returns the name used to define the element, Abstract classes should return @abstract@ */
  static element_name() {
    return "@abstract@";
  }
  /**Returns the namespace override for the element*/
  static element_name_space() {
    return "viewport";
  }

  #x: number = 0;
  #y: number = 0;
  #width: number | undefined;
  #height: number | undefined;
  #rotation: number = 0;

  constructor() {
    super();
    this.style.position = "absolute";
    this.style.boxSizing = "border-box";
    this.style.transformOrigin = "0 0";
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.#update();
  }

  /**Returns the width the content of the widget is designed for */
  abstract get original_width(): number;
  /**Returns the height the content of the widget is designed for */
  abstract get original_height(): number;

  /**Returns whether the content of the widget is stretched from the original size to the width and height
   * Override to return false for widgets that should lay out their content at the actual size, like text */
  get stretch(): boolean {
    return true;
  }

  /**Sets the x position of the left edge of the widget */
  set x(x: number) {
    this.#x = x;
    this.#update();
  }
  /**Returns the x position of the left edge of the widget */
  get x(): number {
    return this.#x;
  }

  /**Sets the y position of the top edge of the widget */
  set y(y: number) {
    this.#y = y;
    this.#update();
  }
  /**Returns the y position of the top edge of the widget */
  get y(): number {
    return this.#y;
  }

  /**Sets the width of the widget, defaults to the original width */
  set width(width: number) {
    this.#width = width;
    this.#update();
  }
  /**Returns the width of the widget */
  get width(): number {
    return this.#width ?? this.original_width;
  }

  /**Sets the height of the widget, defaults to the original height */
  set height(height: number) {
    this.#height = height;
    this.#update();
  }
  /**Returns the height of the widget */
  get height(): number {
    return this.#height ?? this.original_height;
  }

  /**Sets the rotation of the widget in degrees, rotating clockwise around the center of the widget */
  set rotation(rotation: number) {
    this.#rotation = rotation;
    this.#update();
  }
  /**Returns the rotation of the widget in degrees */
  get rotation(): number {
    return this.#rotation;
  }

  #update() {
    const width = this.width;
    const height = this.height;
    const layout_width = this.stretch ? this.original_width : width;
    const layout_height = this.stretch ? this.original_height : height;
    const scale_x = layout_width > 0 ? width / layout_width : 1;
    const scale_y = layout_height > 0 ? height / layout_height : 1;
    this.style.left = this.#x + "px";
    this.style.top = this.#y + "px";
    this.style.width = layout_width + "px";
    this.style.height = layout_height + "px";
    //Scale the layout box to the widget size, then rotate around the center of the widget size
    this.style.transform = `translate(${width / 2}px, ${height / 2}px) rotate(${this.#rotation}deg) translate(${-width / 2}px, ${-height / 2}px) scale(${scale_x}, ${scale_y})`;
  }
}

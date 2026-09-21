import { Base, define_element } from "@chocbite/ts-lib-base";
import { executeKey } from "./shared";
import { KeyboardConfig, KeyboardLayerConfig } from "./types";

class KeyboardKey extends Base {
  static element_name(): string {
    return "key";
  }

  static element_name_space(): string {
    return "onscreen-keyboard";
  }

  constructor(
    text: string,
    key: string,
    ri: number,
    col_count: number,
    rows: number,
    cols: number,
  ) {
    super();

    this.textContent = text;
    this.style.gridRow = (ri + 1).toString();
    this.style.gridColumn = (col_count + 1).toString();
    this.style.gridRowEnd = `${ri + 1 + rows}`;
    this.style.gridColumnEnd = `${col_count + 1 + cols}`;
    this.onclick = () => executeKey(key);
    if (key.includes("layer")) {
    }
  }
}
define_element(KeyboardKey);

class KeyboardLayer extends Base {
  static element_name(): string {
    return "layer";
  }

  static element_name_space(): string {
    return "onscreen-keyboard";
  }

  constructor(name: string, config: KeyboardLayerConfig) {
    super();
    if (config.max_width) this.style.maxWidth = config.max_width + "rem";
    this.addEventListener("mousedown", (e) => e.preventDefault());

    let highest_col_count = 0;
    let highest_row = 0;
    config.keys.forEach((r, i) => {
      let col_count = 0;
      let highest_row_in_layer = 0;
      const ri = i * (config.key_rows ?? 1);
      r.forEach((k) => {
        if (typeof k === "number") {
          col_count += k;
          return;
        }
        const {
          text,
          rows = config.key_rows ?? 1,
          cols = config.key_cols ?? 1,
        } = k;
        this.appendChild(
          new KeyboardKey(text, k.key ?? text, ri, col_count, rows, cols),
        );
        col_count += cols;
        highest_row_in_layer = Math.max(highest_row_in_layer, ri + rows);
      });
      highest_col_count = Math.max(highest_col_count, col_count);
      highest_row = Math.max(highest_row, highest_row_in_layer);
    });
    this.style.gridTemplateColumns = "repeat(" + highest_col_count + ", 1fr)";
    const row_height = 3 / (config.key_rows ?? 1);
    const row_max = 40 / highest_row;
    this.style.gridTemplateRows =
      "repeat(" +
      highest_row +
      ", min(" +
      row_height +
      "rem, " +
      row_max +
      "vh))";
  }
}
define_element(KeyboardLayer);

/**
 * Creates a keyboard layout based on the provided layers.
 * @param keyboard - The keyboard layers configuration. */
export function keyboard_creator(keyboard: KeyboardConfig): HTMLDivElement {
  const container = document.createElement("div");
  container.addEventListener("mousedown", (e) => e.preventDefault());

  container.classList.add("keyboard");
  const layer_map: Record<string, KeyboardLayer> = {};
  [
    ["default", keyboard.default] as [string, KeyboardLayerConfig],
    ...(keyboard.layers ? Object.entries(keyboard.layers) : []),
  ].forEach((l) => {
    const [layer_name, layer_config] = l;
    const layer = new KeyboardLayer(layer_name, layer_config);
    layer_map[layer_name] = layer;
  });

  container.appendChild(layer_map["default"]);

  return container;
}

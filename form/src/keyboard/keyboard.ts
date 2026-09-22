import { Base, define_element } from "@chocbite/ts-lib-base";
import { some } from "@chocbite/ts-lib-result";
import state from "@chocbite/ts-lib-state";
import {
  KeyboardConfig,
  KeyboardLayerConfig,
  KeyboardSpecialKeys,
} from "./types";

class KeyboardKey extends Base {
  static element_name(): string {
    return "key";
  }

  static element_name_space(): string {
    return "onscreen-keyboard";
  }

  constructor(
    keyboard: Keyboard,
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
    this.onclick = () => keyboard.execute_key(key);
    if (key.includes("layer")) {
      const layer_name = key.split(":")[1];
      this.attach_state_ROA_to_attribute_map("active", keyboard.layer, (v) =>
        some(v === layer_name ? "true" : "false"),
      );
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

  constructor(keyboard: Keyboard, name: string, config: KeyboardLayerConfig) {
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
          new KeyboardKey(
            keyboard,
            text,
            k.key ?? text,
            ri,
            col_count,
            rows,
            cols,
          ),
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

const KEO = {
  ctrlKey: true,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  repeat: false,
  bubbles: true,
  cancelable: true,
};
const IEO = {
  bubbles: true,
};

export class Keyboard extends Base {
  static element_name(): string {
    return "keyboard";
  }

  static element_name_space(): string {
    return "onscreen-keyboard";
  }

  #layer = state.ok_w("default");
  readonly layer = this.#layer.read_only;
  #e?: HTMLElement;

  constructor(config: KeyboardConfig) {
    super();
    const container = this.appendChild(document.createElement("div"));
    this.addEventListener("mousedown", (e) => e.preventDefault());

    this.classList.add("keyboard");
    const layer_map: Record<string, KeyboardLayer> = {};
    [
      ["default", config.default] as [string, KeyboardLayerConfig],
      ...(config.layers ? Object.entries(config.layers) : []),
    ].forEach((l) => {
      const [layer_name, layer_config] = l;
      const layer = new KeyboardLayer(this, layer_name, layer_config);
      layer_map[layer_name] = layer;
    });

    this.attach_state(this.#layer, (v) => {
      container.replaceChildren(layer_map[v.value] ?? layer_map["default"]);
    });
  }

  #listener = (e: PointerEvent) => {
    if (e.target === this || this.contains(e.target as Node)) return;
    if (this.#e && (e.target === this.#e || this.#e.contains(e.target as Node)))
      return;
    this.close();
  };

  protected connectedCallback(): void {
    super.connectedCallback();
    this.#e?.ownerDocument.addEventListener("pointerdown", this.#listener, {
      capture: true,
    });
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#e?.ownerDocument.removeEventListener("pointerdown", this.#listener, {
      capture: true,
    });
  }

  open(element: HTMLElement): void {
    this.#e = element;
    this.#e.ownerDocument.documentElement.appendChild(this);
    this.#layer.write("default");
  }

  close(): void {
    this.remove();
  }

  #dis_keydown(opts?: KeyboardEventInit): boolean {
    return (
      this.#e?.dispatchEvent(
        new KeyboardEvent("keydown", { ...KEO, ...opts }),
      ) ?? false
    );
  }
  #dis_keypress(opts?: KeyboardEventInit): boolean {
    return (
      this.#e?.dispatchEvent(
        new KeyboardEvent("keypress", { ...KEO, ...opts }),
      ) ?? false
    );
  }
  #dis_keyup(opts?: KeyboardEventInit): boolean {
    return (
      this.#e?.dispatchEvent(new KeyboardEvent("keyup", { ...KEO, ...opts })) ??
      false
    );
  }
  #dis_input(opts?: InputEventInit): boolean {
    return (
      this.#e?.dispatchEvent(
        new InputEvent("input", { ...IEO, cancelable: false, ...opts }),
      ) ?? false
    );
  }
  #dis_beforeinput(opts?: InputEventInit): boolean {
    return (
      this.#e?.dispatchEvent(
        new InputEvent("beforeinput", { ...IEO, cancelable: true, ...opts }),
      ) ?? false
    );
  }

  execute_key(key: string): void {
    if (!this.#e) return this.close();
    if (key.length === 0) this.close();
    else if (key.length === 1) {
      const canceled = !(
        this.#dis_keydown({ key, code: "Key" + key.toUpperCase() }) &&
        this.#dis_keypress({ key, code: "Key" + key.toUpperCase() }) &&
        this.#dis_beforeinput({ data: key, inputType: "insertText" }) &&
        this.#dis_input({ data: key, inputType: "insertText" }) &&
        this.#dis_keyup({ key, code: "Key" + key.toUpperCase() })
      );

      if (canceled) return;
    } else if (key.includes("layer")) {
      const layer_name = key.split(":")[1];
      if (layer_name === this.#layer.ok()) this.#layer.write("default");
      else this.#layer.write(layer_name);
    } else if (key === KeyboardSpecialKeys.Close) this.close();
    else if (key === KeyboardSpecialKeys.Enter) this.close();
    else if (key === KeyboardSpecialKeys.Backspace) {
      this.#dis_keydown({ key, code: "Backspace" });
      this.#dis_beforeinput({ data: key, inputType: "deleteContentBackward" });
      this.#dis_keypress({ key, code: "Backspace" });
    } else if (key === KeyboardSpecialKeys.Escape) {
      this.#dis_keydown({ key: "Escape", code: "Escape" });
      this.#dis_keyup({ key: "Escape", code: "Escape" });
    } else if (key === KeyboardSpecialKeys.Left) {
      this.#dis_keydown({ key: "ArrowLeft", code: "ArrowLeft" });
      this.#dis_keyup({ key: "ArrowLeft", code: "ArrowLeft" });
    } else if (key === KeyboardSpecialKeys.Right) {
      this.#dis_keydown({ key: "ArrowRight", code: "ArrowRight" });
      this.#dis_keyup({ key: "ArrowRight", code: "ArrowRight" });
    }
  }
}
define_element(Keyboard);

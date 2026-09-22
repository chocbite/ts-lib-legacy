import { Base } from "@chocbite/ts-lib-base";

export abstract class KeyboardBase extends Base {
  static element_name(): string {
    return "@abstract@";
  }

  static element_name_space(): string {
    return "onscreen-keyboard";
  }

  protected elem?: HTMLElement;

  constructor() {
    super();
    this.addEventListener("mousedown", (e) => e.preventDefault());
  }

  #listener = (e: PointerEvent) => {
    if (e.target === this || this.contains(e.target as Node)) return;
    if (
      this.elem &&
      (e.target === this.elem || this.elem.contains(e.target as Node))
    )
      return;
    this.close();
  };

  protected connectedCallback(): void {
    super.connectedCallback();
    this.elem?.ownerDocument.addEventListener("pointerdown", this.#listener, {
      capture: true,
    });
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.elem?.ownerDocument.removeEventListener(
      "pointerdown",
      this.#listener,
      {
        capture: true,
      },
    );
  }

  open(element: HTMLElement): void {
    this.elem = element;
    this.elem.ownerDocument.documentElement.appendChild(this);
  }

  close(): void {
    this.remove();
  }
}

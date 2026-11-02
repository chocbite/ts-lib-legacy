import { define_element } from "@chocbite/ts-lib-base";
import { Page } from "./page";
import { Viewport } from "./viewport";
import { WidgetBase } from "./widget";

/**Simple colored box with a label, used to try out the viewport
 * Does not stretch, so the text keeps its size when the box is resized */
class TrialBox extends WidgetBase {
  static element_name() {
    return "trialbox";
  }

  constructor(color: string, text: string) {
    super();
    this.style.background = color;
    this.style.display = "flex";
    this.style.alignItems = "center";
    this.style.justifyContent = "center";
    this.style.fontFamily = "sans-serif";
    this.style.color = "white";
    this.textContent = text;
  }

  get original_width(): number {
    return this.width;
  }
  get original_height(): number {
    return this.height;
  }
}
define_element(TrialBox);

/**Simple 64x64 graphic, used to try out stretching of widgets */
class TrialGraphic extends WidgetBase {
  static element_name() {
    return "trialgraphic";
  }

  constructor(color: string) {
    super();
    const circle = this.appendChild(document.createElement("div"));
    circle.style.boxSizing = "border-box";
    circle.style.width = "64px";
    circle.style.height = "64px";
    circle.style.borderRadius = "50%";
    circle.style.border = "4px solid black";
    circle.style.background = color;
    circle.style.display = "flex";
    circle.style.alignItems = "center";
    circle.style.justifyContent = "center";
    circle.style.fontFamily = "sans-serif";
    circle.style.fontSize = "24px";
    circle.textContent = "A";
  }

  get original_width(): number {
    return 64;
  }
  get original_height(): number {
    return 64;
  }
}
define_element(TrialGraphic);

document.body.style.margin = "0";
document.body.style.background = "#222";

const page = new Page().opts({ width: 800, height: 600 });
const viewport = new Viewport().opts({ page });
viewport.style.width = "100vw";
viewport.style.height = "100vh";
document.body.appendChild(viewport);

const edit_button = document.body.appendChild(document.createElement("button"));
edit_button.style.position = "fixed";
edit_button.style.left = "10px";
edit_button.style.top = "10px";
edit_button.textContent = "Edit: off";
edit_button.onclick = () => {
  viewport.edit = !viewport.edit;
  edit_button.textContent = viewport.edit ? "Edit: on" : "Edit: off";
};

const rotating = new TrialGraphic("#c0392b").opts({
  x: 600,
  y: 100,
  width: 128,
  height: 64,
});

page.widgets = [
  new TrialBox("#ecf0f1", "").opts({ x: 0, y: 0, width: 800, height: 600 }),
  new TrialBox("#2980b9", "Small box").opts({
    x: 20,
    y: 20,
    width: 160,
    height: 80,
  }),
  new TrialBox("#27ae60", "Wide box, text not stretched").opts({
    x: 20,
    y: 120,
    width: 400,
    height: 40,
  }),
  new TrialBox("#8e44ad", "Rotated 45").opts({
    x: 20,
    y: 220,
    width: 160,
    height: 80,
    rotation: 45,
  }),
  new TrialGraphic("#f1c40f").opts({ x: 300, y: 300, width: 64, height: 64 }),
  new TrialGraphic("#f1c40f").opts({ x: 400, y: 300, width: 128, height: 64 }),
  new TrialGraphic("#f1c40f").opts({ x: 560, y: 300, width: 64, height: 128 }),
  new TrialGraphic("#f1c40f").opts({
    x: 300,
    y: 450,
    width: 256,
    height: 64,
    rotation: 30,
  }),
  rotating,
];

const spin = (time: number) => {
  rotating.rotation = (time / 20) % 360;
  requestAnimationFrame(spin);
};
requestAnimationFrame(spin);

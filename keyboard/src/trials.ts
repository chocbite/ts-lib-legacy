import { keyboard_open, KeyboardType } from ".";

const textarea = document.createElement("textarea");
document.body.appendChild(textarea);
textarea.addEventListener("keydown", (e) => console.warn("keydown", e));
textarea.addEventListener("keyup", (e) => console.warn("keyup", e));
textarea.addEventListener("keypress", (e) => console.warn("keypress", e));
textarea.addEventListener("beforeinput", (e) => console.warn("beforeinput", e));
textarea.addEventListener("input", (e) => console.warn("input", e));
textarea.onfocus = () => keyboard_open(textarea, KeyboardType.NumberRational);

const input = document.createElement("input");
document.body.appendChild(input);
input.addEventListener("keydown", (e) => console.warn("keydown", e));
input.addEventListener("keyup", (e) => console.warn("keyup", e));
input.addEventListener("keypress", (e) => console.warn("keypress", e));
input.addEventListener("beforeinput", (e) => console.warn("beforeinput", e));
input.addEventListener("input", (e) => console.warn("input", e));
input.onfocus = () => keyboard_open(input, KeyboardType.Text);

const contentedit = document.createElement("div");
contentedit.contentEditable = "true";
contentedit.style.backgroundColor = "lightgray";
document.body.appendChild(contentedit);
contentedit.addEventListener("keydown", (e) => console.warn("keydown", e));
contentedit.addEventListener("keyup", (e) => console.warn("keyup", e));
contentedit.addEventListener("keypress", (e) => console.warn("keypress", e));
contentedit.addEventListener("beforeinput", (e) =>
  console.warn("beforeinput", e),
);
contentedit.addEventListener("input", (e) => console.warn("input", e));
contentedit.onfocus = () => keyboard_open(contentedit, KeyboardType.Text);

import { showKeyboard } from ".";

const INPUT_BOX = document.body.appendChild(document.createElement("div"));

for (let i = 0; i < 1000; i++) {
  const input = document.createElement("input");
  INPUT_BOX.appendChild(input);
  input.addEventListener("pointerdown", () => {
    showKeyboard(input);
  });
}

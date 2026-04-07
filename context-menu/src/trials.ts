import ctm from ".";

document.body.style.height = "100vh";
document.body.style.margin = "0";

ctm.attach(
  document.body,
  ctm.menu([
    ctm.line("Remove", () => console.warn("Removed!")),
    ctm.line("Add New Row", () => console.warn("Added New Row!")),
    ctm.line("Empty", () => console.warn("Emptied!")),
  ]),
);

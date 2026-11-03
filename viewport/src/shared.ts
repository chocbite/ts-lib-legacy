import { GREY } from "@chocbite/ts-lib-colors";
import { theme_init_variable_root } from "@chocbite/ts-lib-theme";

const theme_root = theme_init_variable_root(
  "viewport",
  "Viewport",
  "Theme variables for viewports and pages",
);

//       _____ ____  _      ____  _____   _____
//      / ____/ __ \| |    / __ \|  __ \ / ____|
//     | |   | |  | | |   | |  | | |__) | (___
//     | |   | |  | | |   | |  | |  _  / \___ \
//     | |___| |__| | |___| |__| | | \ \ ____) |
//      \_____\____/|______\____/|_|  \_\_____/
const colors = theme_root.make_sub_group(
  "colors",
  "Colors",
  "Colors used in viewports",
);
colors.make_variable(
  "background",
  "Background Color",
  "Color of the viewport around the page",
  GREY["300"],
  GREY["900"],
  "Color",
  undefined,
);
colors.make_variable(
  "pageBackground",
  "Page Background Color",
  "Color of the page behind the widgets",
  GREY["50"],
  GREY["800"],
  "Color",
  undefined,
);

//      ______ _____ _____ _______
//     |  ____|  __ \_   _|__   __|
//     | |__  | |  | || |    | |
//     |  __| | |  | || |    | |
//     | |____| |__| || |_   | |
//     |______|_____/_____|  |_|
const edit = theme_root.make_sub_group(
  "edit",
  "Edit",
  "Settings for viewports in edit mode",
);
edit.make_variable(
  "checker1",
  "Checkerboard First Color",
  "First color of the checkerboard shown behind the page in edit mode",
  GREY["300"],
  GREY["600"],
  "Color",
  undefined,
);
edit.make_variable(
  "checker2",
  "Checkerboard Second Color",
  "Second color of the checkerboard shown behind the page in edit mode",
  GREY["200"],
  GREY["700"],
  "Color",
  undefined,
);
edit.make_variable(
  "checkerSize",
  "Checkerboard Square Size",
  "Size of one square of the checkerboard shown behind the page in edit mode",
  "0.625rem",
  "0.625rem",
  "Length",
  { min: 0.1, max: 10 },
);

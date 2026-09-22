import { GREY } from "@chocbite/ts-lib-colors";
import { theme_init_variable_root } from "@chocbite/ts-lib-theme";

const theme_root = theme_init_variable_root(
  "keyboard",
  "Virtual Keyboard",
  "Theme variables for the virtual keyboard",
);

//#################################################################################3
//#################################################################################3
//       _____ ____  _      ____  _____   _____
//      / ____/ __ \| |    / __ \|  __ \ / ____|
//     | |   | |  | | |   | |  | | |__) | (___
//     | |   | |  | | |   | |  | |  _  / \___ \
//     | |___| |__| | |___| |__| | | \ \ ____) |
//      \_____\____/|______\____/|_|  \_\_____/
const colors = theme_root.make_sub_group(
  "colors",
  "Colors",
  "Colors used in the virtual keyboard",
);

colors.make_variable(
  "background",
  "Background Color",
  "",
  GREY["700"],
  GREY["300"],
  "Color",
  undefined,
);
colors.make_variable(
  "normal",
  "Normal Text Color",
  "Normal text color in form elements",
  GREY["800"],
  GREY["200"],
  "Color",
  undefined,
);
colors.make_variable(
  "selected",
  "Selected Text Color",
  "Selected text color in form elements",
  GREY["900"],
  GREY["50"],
  "Color",
  undefined,
);
colors.make_variable(
  "unselected",
  "Unselected Text Color",
  "Unselected text color in form elements",
  GREY["600"],
  GREY["400"],
  "Color",
  undefined,
);

import {
  array_from_range,
  IPAddress,
  IPVersion,
} from "@chocbite/ts-lib-common";
import {
  material_av_add_to_queue_rounded,
  material_av_remove_from_queue_rounded,
} from "@chocbite/ts-lib-icons";
import state from "@chocbite/ts-lib-state";
import {
  ANIMATION_LEVEL,
  INPUT_MODE,
  SCALE,
  THEME,
} from "@chocbite/ts-lib-theme";
import form, { FormColors, FormDateTimeType } from ".";

const form_cont = document.createElement("div");
document.body.appendChild(form_cont);
form_cont.style.display = "flex";
form_cont.style.flexDirection = "column";
form_cont.style.flexGrow = "1";
form_cont.style.overflow = "auto";

form_cont.appendChild(
  form.group({
    border: "inset",
    max_height: 16,
    collapsible: true,
    collapsed: true,
    collapse_text: "Theme",
    elements: [
      form.text({ text: "Theme" }),
      form.toggle_button({ value_by_state: THEME }),
      form.text({ text: "Input Mode" }),
      form.toggle_button({ value_by_state: INPUT_MODE }),
      form.text({ text: "Animation Level" }),
      form.toggle_button({ value_by_state: ANIMATION_LEVEL }),
      form.text({ text: "UI Scale" }),
      form.stepper({ value_by_state: SCALE }),
    ],
  }),
);

//      _____         _____ _______          ______  _____  _____
//     |  __ \ /\    / ____/ ____\ \        / / __ \|  __ \|  __ \
//     | |__) /  \  | (___| (___  \ \  /\  / / |  | | |__) | |  | |
//     |  ___/ /\ \  \___ \\___ \  \ \/  \/ /| |  | |  _  /| |  | |
//     | |  / ____ \ ____) |___) |  \  /\  / | |__| | | \ \| |__| |
//     |_| /_/    \_\_____/_____/    \/  \/   \____/|_|  \_\_____/
const password_state = state.ok_w("");
password_state.sub(console.error);
form_cont.appendChild(form.text({ text: "IP Input" }));
form_cont.appendChild(
  form.password_input({
    value_by_state: password_state,
    filter: /[0-9]/,
  }),
);

//      _____ _____    _____ _   _ _____  _    _ _______
//     |_   _|  __ \  |_   _| \ | |  __ \| |  | |__   __|
//       | | | |__) |   | | |  \| | |__) | |  | |  | |
//       | | |  ___/    | | | . ` |  ___/| |  | |  | |
//      _| |_| |       _| |_| |\  | |    | |__| |  | |
//     |_____|_|      |_____|_| \_|_|     \____/   |_|
const ip_state = state.ok_w(new IPAddress("192.168.1.1"));
form_cont.appendChild(form.text({ text: "IP Input" }));
form_cont.appendChild(
  form.ip_input({
    type: IPVersion.V4,
    value_by_state: ip_state,
  }),
);
form_cont.appendChild(form.text({ text: "IP Input" }));
form_cont.appendChild(
  form.ip_input({
    type: IPVersion.V6,
  }),
);

//       _____ ____  _      ____  _____    _____ _   _ _____  _    _ _______
//      / ____/ __ \| |    / __ \|  __ \  |_   _| \ | |  __ \| |  | |__   __|
//     | |   | |  | | |   | |  | | |__) |   | | |  \| | |__) | |  | |  | |
//     | |   | |  | | |   | |  | |  _  /    | | | . ` |  ___/| |  | |  | |
//     | |___| |__| | |___| |__| | | \ \   _| |_| |\  | |    | |__| |  | |
//      \_____\____/|______\____/|_|  \_\ |_____|_| \_|_|     \____/   |_|
const color_state = state.ok_w("#00ff00");
form_cont.appendChild(form.text({ text: "Color Input" }));
form_cont.appendChild(
  form.color_input({
    value_by_state: color_state,
  }),
);
form_cont.appendChild(form.text({ text: "Color Input 2" }));
form_cont.appendChild(
  form.color_input({
    live: true,
    value_by_state: color_state,
  }),
);

//      _____       _______ ______ _______ _____ __  __ ______
//     |  __ \   /\|__   __|  ____|__   __|_   _|  \/  |  ____|
//     | |  | | /  \  | |  | |__     | |    | | | \  / | |__
//     | |  | |/ /\ \ | |  |  __|    | |    | | | |\/| |  __|
//     | |__| / ____ \| |  | |____   | |   _| |_| |  | | |____
//     |_____/_/    \_\_|  |______|  |_|  |_____|_|  |_|______|
const date_time_state = state.ok_w(new Date());
form_cont.appendChild(form.text({ text: "Date Time Input" }));
form_cont.appendChild(
  form.date_time_input({
    type: FormDateTimeType.TIME,
    value_by_state: date_time_state,
  }),
);
form_cont.appendChild(form.text({ text: "Date Time Input" }));
form_cont.appendChild(
  form.date_time_input({
    value_by_state: date_time_state,
  }),
);
form_cont.appendChild(form.text({ text: "Date Time Input" }));
form_cont.appendChild(
  form.date_time_input({
    value: 5000 as number,
  }),
);

//      _______ ________   _________   _____ _   _ _____  _    _ _______
//     |__   __|  ____\ \ / /__   __| |_   _| \ | |  __ \| |  | |__   __|
//        | |  | |__   \ V /   | |      | | |  \| | |__) | |  | |  | |
//        | |  |  __|   > <    | |      | | | . ` |  ___/| |  | |  | |
//        | |  | |____ / . \   | |     _| |_| |\  | |    | |__| |  | |
//        |_|  |______/_/ \_\  |_|    |_____|_| \_|_|     \____/   |_|
const text_state = state.ok_w("");
form_cont.appendChild(form.text({ text: "Text Input" }));
form_cont.appendChild(
  form.input_text({
    placeholder: "Enter text here...",
    max_length: 20,
    max_bytes: 20,
    value_by_state: text_state,
    filter: /[a-zA-Z ]/,
  }),
);
form_cont.appendChild(form.text({ text: "Text Input 2" }));
form_cont.appendChild(
  form.input_text({
    placeholder: "Enter text here...",
    max_length: 20,
    max_bytes: 20,
    value_by_state: text_state,
  }),
);

const multi_line_text_state = state.ok_w("");
form_cont.appendChild(form.text({ text: "Multiline Text Input" }));
form_cont.appendChild(
  form.multiline_text({
    placeholder: "Enter text here...",
    max_length: 20,
    max_bytes: 20,
    value_by_state: multi_line_text_state,
  }),
);

form_cont.appendChild(form.text({ text: "Multiline Text Input2" }));
form_cont.appendChild(
  form.multiline_text({
    placeholder: "Enter text here...",
    max_length: 20,
    max_bytes: 20,
    value_by_state: multi_line_text_state,
  }),
);

//      _   _ _    _ __  __ ____  ______ _____    _____ _   _ _____  _    _ _______
//     | \ | | |  | |  \/  |  _ \|  ____|  __ \  |_   _| \ | |  __ \| |  | |__   __|
//     |  \| | |  | | \  / | |_) | |__  | |__) |   | | |  \| | |__) | |  | |  | |
//     | . ` | |  | | |\/| |  _ <|  __| |  _  /    | | | . ` |  ___/| |  | |  | |
//     | |\  | |__| | |  | | |_) | |____| | \ \   _| |_| |\  | |    | |__| |  | |
//     |_| \_|\____/|_|  |_|____/|______|_|  \_\ |_____|_| \_|_|     \____/   |_|
form_cont.appendChild(form.text({ text: "Number Input" }));
form_cont.appendChild(
  form.input_number({
    unit: "mA",
    min: -100,
    max: 100,
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
);

//       _____ _____   ____  _    _ _____
//      / ____|  __ \ / __ \| |  | |  __ \
//     | |  __| |__) | |  | | |  | | |__) |
//     | | |_ |  _  /| |  | | |  | |  ___/
//     | |__| | | \ \| |__| | |__| | |
//      \_____|_|  \_\\____/ \____/|_|
form_cont.appendChild(form.text({ text: "Group Box" }));
const grouptest = form_cont.appendChild(
  form.group({
    border: "outset",
    max_height: 6,
    elements: [
      form.text({ text: "Button in Group" }),
      form
        .button({
          id: "test",
          text: "Click Me",
        })
        .opts({ access: "r" }),
      form.text({ text: "Button in Group" }),
      form
        .button({
          id: "test2",
          text: "Click Me",
        })
        .opts({ access: "r" }),
      form.text({ text: "Slider in Group" }),
      form.slider({
        id: "slider_in_group",
        unit: "mA",
        min: -100,
        max: 100,
      }),
    ],
  }),
);

grouptest.value = {
  test: true,
  slider_in_group: 50,
};
grouptest.value.map(console.error);

form_cont.appendChild(form.text({ text: "Group Box" }));
form_cont.appendChild(
  form.group({
    border: "outset",
    collapsible: true,
    collapse_text: "Toggle",
    elements: [
      form.text({ text: "Hello inside group!", size: 2 }),
      form.text({ text: "Button in Group" }),
      form.button({ text: "Click Me" }).opts({ access: "r" }),
    ],
  }),
);

form_cont.appendChild(form.text({ text: "Group Box" }));
form_cont.appendChild(
  form.group({
    border: "inset",
    collapsible: true,
    collapsed: true,
    collapse_text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel risus sem. Curabitur a morbi.",
    elements: [
      form.text({ text: "Hello inside group!", size: 2 }),
      form.text({ text: "Button in Group" }),
      form.button({ text: "Click Me" }).opts({ access: "r" }),
    ],
  }),
);

form_cont.appendChild(
  form.text({
    text: "Hello World!",
    size: 2,
  }),
);

const bool = state.ok_w(false);
form_cont.appendChild(form.text({ text: "YOYOYOY" }));
form_cont.appendChild(
  form
    .button({
      id: "test",
      text: "YOYOYOYO",
      icon: material_av_add_to_queue_rounded,
      color: FormColors.Yellow,
    })
    .opts({
      access: "w",
    }),
).value_by_state = bool;

form_cont.appendChild(form.text({ text: "Toggle Me" }));
form_cont.appendChild(form.switch({})).value_by_state = bool;

form_cont.appendChild(
  form.lamp({
    text: "Status Lamp",
    colors: [FormColors.Red, FormColors.Green],
    icon: material_av_add_to_queue_rounded,
  }),
).value_by_state = bool;

//      _____  _____   ____  _____  _____   ______          ___   _
//     |  __ \|  __ \ / __ \|  __ \|  __ \ / __ \ \        / / \ | |
//     | |  | | |__) | |  | | |__) | |  | | |  | \ \  /\  / /|  \| |
//     | |  | |  _  /| |  | |  ___/| |  | | |  | |\ \/  \/ / | . ` |
//     | |__| | | \ \| |__| | |    | |__| | |__| | \  /\  /  | |\  |
//     |_____/|_|  \_\\____/|_|    |_____/ \____/   \/  \/   |_| \_|
const num = state.ok_w(0);
form_cont.appendChild(form.text({ text: "Dropdown" }));
form_cont.appendChild(
  form.dropdown({
    selections: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel risus sem. Curabitur a morbi.",
        value: 2,
        icon: material_av_add_to_queue_rounded,
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel risus sem. Curabitur a morbi.",
        value: 3,
        icon: material_av_remove_from_queue_rounded,
      },
      {
        text: "YPYP",
        value: 6,
        icon: material_av_remove_from_queue_rounded,
      },
    ],
  }),
).value_by_state = num;

form_cont.appendChild(form.text({ text: "Dropdown" }));
form_cont.appendChild(
  form.dropdown({
    default:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel risus sem. Curabitur a morbi.",
    default_icon: material_av_add_to_queue_rounded,
    selections: array_from_range(0, 100, (i) => {
      return {
        value: i,
        text: `Option ${i + 1}`,
        icon: material_av_remove_from_queue_rounded,
      };
    }),
  }),
).value_by_state = num;

form_cont.appendChild(form.text({ text: "Dropdown" }));
form_cont.appendChild(
  form.dropdown({
    default:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel risus sem. Curabitur a morbi.",
    default_icon: material_av_add_to_queue_rounded,
    selections: array_from_range(0, 100, (i) => {
      return {
        value: i,
        text: `Option ${i + 1}`,
      };
    }),
  }),
).value_by_state = num;

//      _______ ____   _____  _____ _      ______   ____  _    _ _______ _______ ____  _   _  _____
//     |__   __/ __ \ / ____|/ ____| |    |  ____| |  _ \| |  | |__   __|__   __/ __ \| \ | |/ ____|
//        | | | |  | | |  __| |  __| |    | |__    | |_) | |  | |  | |     | | | |  | |  \| | (___
//        | | | |  | | | |_ | | |_ | |    |  __|   |  _ <| |  | |  | |     | | | |  | | . ` |\___ \
//        | | | |__| | |__| | |__| | |____| |____  | |_) | |__| |  | |     | | | |__| | |\  |____) |
//        |_|  \____/ \_____|\_____|______|______| |____/ \____/   |_|     |_|  \____/|_| \_|_____/
form_cont.appendChild(form.text({ text: "Toggle Buttons" }));
form_cont.appendChild(
  form.toggle_button({
    selections: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel risus sem. Curabitur a morbi.",
        value: 2,
        icon: material_av_add_to_queue_rounded,
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel risus sem. Curabitur a morbi.",
        value: 3,
        icon: material_av_remove_from_queue_rounded,
      },
      {
        text: "YPYP",
        value: 6,
        icon: material_av_remove_from_queue_rounded,
      },
    ],
  }),
).value_by_state = num;

form_cont.appendChild(form.text({ text: "Toggle Buttons" }));
form_cont.appendChild(
  form.toggle_button({
    selections: array_from_range(0, 5, (i) => {
      return {
        value: i,
        text: `Option ${i + 1}`,
        icon: material_av_remove_from_queue_rounded,
      };
    }),
  }),
).value_by_state = num;

form_cont.appendChild(form.text({ text: "Toggle Buttons" }));
form_cont.appendChild(
  form.toggle_button({
    selections: array_from_range(0, 20, (i) => {
      return {
        value: i,
        text: `Option ${i + 1}`,
      };
    }),
  }),
).value_by_state = num;

//       _____ _      _____ _____  ______ _____
//      / ____| |    |_   _|  __ \|  ____|  __ \
//     | (___ | |      | | | |  | | |__  | |__) |
//      \___ \| |      | | | |  | |  __| |  _  /
//      ____) | |____ _| |_| |__| | |____| | \ \
//     |_____/|______|_____|_____/|______|_|  \_\
const slider_num = state.ok_w(0);
form_cont.appendChild(form.text({ text: "Slider" }));
form_cont.appendChild(
  form.slider({
    unit: "mA",
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
).value_by_state = slider_num;
form_cont.appendChild(form.text({ text: "Slider" }));
form_cont.appendChild(
  form.slider({
    unit: "mA",
    live: true,
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
).value_by_state = slider_num;
form_cont.appendChild(form.text({ text: "Slider" }));
form_cont.appendChild(
  form.slider({
    unit: "mA",
    min: -50,
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
).value_by_state = slider_num;
form_cont.appendChild(form.text({ text: "Slider" }));
form_cont.appendChild(
  form.slider({
    unit: "mA",
    min: -50,
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
    live: true,
  }),
).value_by_state = slider_num;

form_cont.appendChild(form.text({ text: "Slider" }));
form_cont.appendChild(
  form.slider({
    unit: "mA",
    min: -50,
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
    live: true,
  }),
);

//       _____ _______ ______ _____  _____  ______ _____
//      / ____|__   __|  ____|  __ \|  __ \|  ____|  __ \
//     | (___    | |  | |__  | |__) | |__) | |__  | |__) |
//      \___ \   | |  |  __| |  ___/|  ___/|  __| |  _  /
//      ____) |  | |  | |____| |    | |    | |____| | \ \
//     |_____/   |_|  |______|_|    |_|    |______|_|  \_\
const stepper_num = state.ok_w(0);
form_cont.appendChild(form.text({ text: "Stepper" }));
form_cont.appendChild(
  form.stepper({
    unit: "mA",
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
).value_by_state = stepper_num;
form_cont.appendChild(form.text({ text: "Stepper" }));
form_cont.appendChild(
  form.stepper({
    unit: "mA",
    live: true,
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
).value_by_state = stepper_num;
form_cont.appendChild(form.text({ text: "Stepper" }));
form_cont.appendChild(
  form.stepper({
    unit: "mA",
    min: -50,
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
).value_by_state = stepper_num;
form_cont.appendChild(form.text({ text: "Stepper" }));
form_cont.appendChild(
  form.stepper({
    unit: "mA",
    min: -50,
    max: 50,
    step: 0.5,
    start: 0.1,
    decimals: 1,
  }),
);

//      _____  _____   ____   _____ _____  ______  _____ _____
//     |  __ \|  __ \ / __ \ / ____|  __ \|  ____|/ ____/ ____|
//     | |__) | |__) | |  | | |  __| |__) | |__  | (___| (___
//     |  ___/|  _  /| |  | | | |_ |  _  /|  __|  \___ \\___ \
//     | |    | | \ \| |__| | |__| | | \ \| |____ ____) |___) |
//     |_|    |_|  \_\\____/ \_____|_|  \_\______|_____/_____/
form_cont.appendChild(form.text({ text: "Progress" }));
form_cont.appendChild(form.progress({ unit: "mA" })).value_by_state = num;

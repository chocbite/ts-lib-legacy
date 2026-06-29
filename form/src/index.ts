import { FormColors, FormOptions, FormValueOptions } from "./base";
import { form_button, FormButton } from "./boolean/button/button";
import { form_lamp, FormLamp } from "./boolean/lamp/lamp";
import { form_switch, FormSwitch } from "./boolean/switch/switch";
import { form_group, FormGroup } from "./group/group";
import {
  form_group_collapser,
  FormGroupCollapser,
} from "./group/group_collapser";
import { form_list_field, ListFormField } from "./list/list_field";
import {
  form_number_input,
  FormNumberInput,
} from "./number/number_input/number_input";
import { form_progress, FormProgress } from "./number/progress/progress";
import { form_slider, FormSlider } from "./number/slider/slider";
import { form_stepper, FormStepper } from "./number/stepper/stepper";
import { form_dropdown, FormDropdown } from "./selectors/drop_down/drop_down";
import {
  form_toggle_button,
  FormToggleButton,
} from "./selectors/toggle_button/toggle_button";
import { form_spacer, FormSpacer } from "./spacing/spacer";
import { form_color_input, FormColorInput } from "./special/color/color_input";
import {
  form_date_time_input,
  FormDateTimeInput,
  FormDateTimeType,
} from "./special/date_time/date_time_input";
import { form_ip_input, FormIpInput } from "./special/ip/ip_input";
import {
  form_password_input,
  FormPasswordInput,
} from "./special/password/password_input";
import { form_text_input, FormTextInput } from "./text/input/text_input";
import {
  form_text_multiline,
  FormTextMultiline,
} from "./text/multi_line/text_multi_line";
import { form_text, FormText } from "./text/text/text";

/**Form elements with label */
export const form = {
  FormColors,

  //Boolean
  button: form_button,
  switch: form_switch,
  lamp: form_lamp,

  //Group
  group: form_group,
  group_collapser: form_group_collapser,

  //Special
  color_input: form_color_input,
  date_time_input: form_date_time_input,
  FormDateTimeType,
  ip_input: form_ip_input,
  password_input: form_password_input,

  //Number
  progress: form_progress,
  input_number: form_number_input,
  slider: form_slider,
  stepper: form_stepper,

  //Selectors
  dropdown: form_dropdown,
  toggle_button: form_toggle_button,

  //Spacing
  spacer: form_spacer,

  //Text
  text: form_text,
  input_text: form_text_input,
  multiline_text: form_text_multiline,

  //List
  list_field: form_list_field,
};
export default form;

export type {
  FormButton,
  FormColorInput,
  FormDateTimeInput,
  FormDropdown,
  FormGroup,
  FormGroupCollapser,
  FormIpInput,
  FormLamp,
  FormNumberInput,
  FormOptions,
  FormPasswordInput,
  FormProgress,
  FormSlider,
  FormSpacer,
  FormStepper,
  FormSwitch,
  FormText,
  FormTextInput,
  FormTextMultiline,
  FormToggleButton,
  FormValueOptions,
  ListFormField,
};

export { FormColors, FormElement, FormValue, FormValueWrite } from "./base";
export { FormDateTimeType } from "./special/date_time/date_time_input";

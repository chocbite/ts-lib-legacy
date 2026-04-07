import { FormColors } from "./base";
import { form_button } from "./boolean/button/button";
import { form_lamp } from "./boolean/lamp/lamp";
import { form_switch } from "./boolean/switch/switch";
import { form_group } from "./group/group";
import { form_list_field } from "./list/list_field";
import { form_number_input } from "./number/numberInput/number_input";
import { form_progress } from "./number/progress/progress";
import { form_slider } from "./number/slider/slider";
import { form_stepper } from "./number/stepper/stepper";
import { form_dropdown } from "./selectors/drop_down/drop_down";
import { form_toggle_button } from "./selectors/toggle_button/toggle_button";
import { form_spacer } from "./spacing/spacer";
import { form_color_input } from "./special/color/color_input";
import {
  form_date_time_input,
  FormDateTimeType,
} from "./special/date_time/date_time_input";
import { form_ip_input } from "./special/ip/ip_input";
import { form_password_input } from "./special/password/password_input";
import { form_text_input } from "./text/input/text_input";
import { form_text_multiline } from "./text/multiLine/text_multi_line";
import { form_text } from "./text/text/text";

/**Form elements with label */
export const form = {
  FormColors,

  //Boolean
  button: form_button,
  switch: form_switch,
  lamp: form_lamp,
  //Group
  group: form_group,

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

export { FormColors } from "./base";
export { FormDateTimeType } from "./special/date_time/date_time_input";

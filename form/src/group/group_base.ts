import { AccessTypes } from "@chocbite/ts-lib-base";
import { err, ok, Option, Result } from "@chocbite/ts-lib-result";
import { FormValue, FormValueWrite } from "../base";
import "./group_base.scss";

/**Different border styles for the component group*/
export const FormGroupBorderStyle = {
  None: "none",
  Inset: "inset",
  Outset: "outset",
  Line: "line",
} as const;
export type FormGroupBorderStyle =
  (typeof FormGroupBorderStyle)[keyof typeof FormGroupBorderStyle];

export type GroupExtractVals<Arr extends any[]> = Arr extends [
  infer Head,
  ...infer Tail,
]
  ? Head extends FormValue<infer T, infer ID>
    ? [FormValue<T, ID>, ...GroupExtractVals<Tail>]
    : [...GroupExtractVals<Tail>]
  : [];

export type GroupToKeyVal<Arr extends FormValue<any, any>[]> = {
  [K in Arr[number] as K["form_id"]]: K extends FormValue<infer T, any>
    ? T
    : never;
};

export abstract class FormGroupBase<
  RT extends object,
  ID extends string | undefined,
> extends FormValueWrite<RT, ID> {
  static element_name() {
    return "@abstract@";
  }
  static element_name_space(): string {
    return "form";
  }

  protected value_elements: Map<string, FormValueWrite<any, any>> = new Map();

  /**This places the group at an absolute position in one of the corners of the container*/
  set border(border: FormGroupBorderStyle | undefined) {
    this.classList.remove(
      FormGroupBorderStyle.Inset,
      FormGroupBorderStyle.Outset,
    );
    if (border && border !== FormGroupBorderStyle.None)
      this.classList.add(border);
  }

  set max_height(height: number | undefined) {
    this.style.setProperty("--max_height", height ? height + "rem" : "none");
    if (height) this.classList.add("max_height");
    else this.classList.remove("max_height");
  }

  set embed(embed: boolean) {
    if (embed) this.classList.add("embed");
    else this.classList.remove("embed");
  }

  set value(val: RT) {
    super.value = val;
  }

  /**Returns value of the component*/
  get value(): Result<RT, string> {
    if (this._state) return err("State based component");
    const result: RT = {} as RT;
    for (const [key, comp] of this.value_elements) {
      const val = comp.value;
      if (val.err) return err("Component with id " + key + " has no value");
      result[key as keyof RT] = val.value as RT[keyof RT];
    }
    return ok(result);
  }

  /**Returns partial value of the component, only containing components with values*/
  get value_partial(): Result<Partial<RT>, string> {
    if (this._state) return err("State based component");
    const result: Partial<RT> = {};
    for (const [key, comp] of this.value_elements) {
      const val = comp.value;
      if (val.err) continue;
      result[key as keyof RT] = val.value as RT[keyof RT];
    }
    return ok(result);
  }

  protected new_value(val: RT): void {
    for (const key in val)
      if (this.value_elements.has(key))
        this.value_elements.get(key)!.value = val[key as keyof RT];
  }

  protected clear_value(): void {
    for (const comp of this.value_elements.values()) comp.clear();
  }

  protected new_error(err: string): void {
    console.error(err);
  }

  protected clear_error(): void {}

  protected state_related(_related: Option<{}>): void {}

  protected on_access(access: AccessTypes): void {
    switch (access) {
      case AccessTypes.Read: {
        this.tabIndex = 0;
        this.onfocus = () => {
          document.body.focus();
        };
        break;
      }
      case AccessTypes.Write: {
        this.removeAttribute("tabIndex");
        this.onfocus = null;
        break;
      }
    }
  }
}

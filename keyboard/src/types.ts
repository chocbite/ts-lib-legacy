export const KeyboardSpecialKeys = {
  Close: "close",
} as const;
export type KeyboardSpecialKeys =
  (typeof KeyboardSpecialKeys)[keyof typeof KeyboardSpecialKeys];

export const KeyboardBaseLayers = {
  Default: "default",
  Shift: "shift",
} as const;
export type KeyboardBaseLayers =
  (typeof KeyboardBaseLayers)[keyof typeof KeyboardBaseLayers];

export const KeyboardTypes = {
  /**Text input type */
  Text: "text",
  /**Whole number input type, eg. 0, 1, 2 ...*/
  NumberWhole: "number_whole",
  /**Integer number input type, eg. -2, -1, 0, 1, 2 ... */
  NumberInteger: "number_integer",
  /**Positive rational number input type, eg. 0.5, 1.2 ... */
  NumberRationalPositive: "number_rational_positive",
  /**Rational number input type, eg. -2.5, -1.1, 0.5, 1.2 ... */
  NumberRational: "number_rational",
  /**Phone number input type, eg. +1 234 567 890 */
  Phone: "phone",
} as const;
export type KeyboardTypes = (typeof KeyboardTypes)[keyof typeof KeyboardTypes];

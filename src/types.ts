export type ExpForm = string | HTMLFormElement;
export type ExpControl = string | FormControl;
export type ExpControls = string | FormControl[];

export type FormControl =
  | HTMLSelectElement
  | HTMLInputElement
  | HTMLTextAreaElement;

export interface NativeValidatorOptions {
  required: boolean;
  pattern: boolean;
  overflow: boolean;
  underflow: boolean;
  step: boolean;
  long: boolean;
  short: boolean;
  type: boolean;
}

export interface ValidityInfo {
  valid: boolean;
  native: ValidityState;
  user: ValidityResult[];
}

export interface ValidityResult {
  name: string;
  valid: boolean;
}

export interface ItemOptions {
  native?: boolean | Partial<NativeValidatorOptions>;
  rule?: any;
  [key: string]: any;
}

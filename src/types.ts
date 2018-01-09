import { Rule } from './rule';

export type RuleClass = new (...args: any[]) => Rule;

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
  el: FormControl;
  type: string;
  value: string | undefined;
  prev: string | undefined;
  valid: boolean;
  custom: {
    [key: string]: ValidityResult;
  };
}

export interface ValidityResult {
  valid: boolean;
  [key: string]: any;
}

export interface ItemConf {
  el: FormControl;
  events: string[];
  wait: number;
}

export interface ItemOptions {
  native?: boolean | Partial<NativeValidatorOptions>;
  [key: string]: any;
}

export interface ValliConf {
  form: HTMLFormElement;
  controls: FormControl[];
  attrName?: string;
  events?: string[];
  wait?: number;
}

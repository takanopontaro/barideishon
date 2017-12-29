import { getValue } from '../toolbelt';
import { FormControl } from '../types';
import { Rule } from '../rule';

export interface Options {
  partner: string;
  begin?: boolean;
  equal?: boolean;
}

export class Within extends Rule {
  name = 'within';

  private partner: FormControl;
  private begin: FormControl;
  private end: FormControl;
  private equal: boolean;

  constructor(el: FormControl, options: Options) {
    super(el);
    this.partner = <FormControl>document.querySelector(options.partner);
    this.begin = options.begin ? this.el : this.partner;
    this.end = options.begin ? this.partner : this.el;
    this.equal = !!options.equal;
  }

  private mismatch(el: FormControl) {
    if (el instanceof HTMLInputElement) {
      const value = getValue(el);
      if (value === undefined || !el.pattern) {
        return false;
      }
      return !new RegExp(el.pattern).test(value);
    }
    return false;
  }

  validate() {
    const begin = getValue(this.begin);
    const end = getValue(this.end);
    if (
      !begin ||
      !end ||
      this.mismatch(this.begin) ||
      this.mismatch(this.end)
    ) {
      return false;
    }
    const b = new Date(begin);
    const e = new Date(end);
    return this.equal ? e >= b : e > b;
  }
}

import { getValue } from '../toolbelt';
import { FormControl, ValidityResult } from '../types';
import { Rule } from '../rule';

export interface Options {
  partner: string;
  start?: boolean;
  equal?: boolean;
  [key: string]: any;
}

export class Within extends Rule {
  name = 'within';

  private startEl: FormControl;
  private endEl: FormControl;
  private incEqual: boolean;

  constructor(el: FormControl, options: Options) {
    super(el, options);
    const { partner, start, equal } = options;
    const partnerEl = <FormControl>document.querySelector(partner);
    this.startEl = start ? this.el : partnerEl;
    this.endEl = start ? partnerEl : this.el;
    this.incEqual = !!equal;
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
    const start = getValue(this.startEl);
    const end = getValue(this.endEl);
    if (
      !start ||
      !end ||
      this.mismatch(this.startEl) ||
      this.mismatch(this.endEl)
    ) {
      this.result.valid = false;
    } else {
      const b = new Date(start);
      const e = new Date(end);
      this.result.valid = this.incEqual ? e >= b : e > b;
    }
    return this.result;
  }
}

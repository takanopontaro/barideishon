import { getValue } from '../toolbelt';
import { FormControl, ValidityResult } from '../types';
import { Rule } from '../rule';

export interface Options {
  partner: string;
  begin?: boolean;
  equal?: boolean;
  [key: string]: any;
}

export class Within extends Rule {
  name = 'within';

  private beginEl: FormControl;
  private endEl: FormControl;
  private incEqual: boolean;

  constructor(el: FormControl, options: Options) {
    super(el, options);
    const { partner, begin, equal } = options;
    const partnerEl = <FormControl>document.querySelector(partner);
    this.beginEl = begin ? this.el : partnerEl;
    this.endEl = begin ? partnerEl : this.el;
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
    const begin = getValue(this.beginEl);
    const end = getValue(this.endEl);
    if (
      !begin ||
      !end ||
      this.mismatch(this.beginEl) ||
      this.mismatch(this.endEl)
    ) {
      this.result.valid = false;
    } else {
      const b = new Date(begin);
      const e = new Date(end);
      this.result.valid = this.incEqual ? e >= b : e > b;
    }
    return this.result;
  }
}

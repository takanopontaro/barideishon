import { getValue } from '../toolbelt';
import { FormControl, ValidityResult } from '../types';
import { Rule } from '../rule';

export interface Options {
  partner: string;
  [key: string]: any;
}

export class Equal extends Rule {
  name = 'equal';

  private partnerEl: FormControl;

  constructor(el: FormControl, options: Options) {
    super(el, options);
    this.partnerEl = <FormControl>document.querySelector(options.partner);
  }

  validate() {
    this.result.valid = getValue(this.el) === getValue(this.partnerEl);
    return this.result;
  }
}

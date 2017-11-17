import { FormControl } from '../types';
import { Exp, Rule } from '../rule';

class Within extends Rule {
  name = 'within';

  private partner: FormControl;
  private begin: FormControl;
  private end: FormControl;

  constructor(el: Exp, partner: Exp, begin = false, private equal = false) {
    super();
    this.el = this.getNode(el);
    this.partner = this.getNode(partner);
    this.begin = begin ? this.el : this.partner;
    this.end = begin ? this.partner : this.el;
  }

  mismatch(control: FormControl) {
    if (control instanceof HTMLInputElement) {
      const value = this.getValue(control);
      if (value === null || !control.pattern) {
        return false;
      }
      return !new RegExp(control.pattern).test(value);
    }
    return false;
  }

  validate() {
    const begin = this.getValue(this.begin);
    const end = this.getValue(this.end);
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

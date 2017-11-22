import { ExpControl, FormControl } from '../types';
import { Rule } from '../rule';
import { Item } from '../item';

export interface Options {
  partner: ExpControl;
  begin?: boolean;
  equal?: boolean;
}

export class Within extends Rule {
  name = 'within';

  private partner: FormControl;
  private begin: FormControl;
  private end: FormControl;
  private equal: boolean;

  constructor(exp: ExpControl, options: Options) {
    super(exp);
    const node = Item.getNode(options.partner);
    if (node === null || !Item.isFormControl(node)) {
      throw new Error();
    }
    this.partner = <FormControl>node;
    this.begin = options.begin ? this.el : this.partner;
    this.end = options.begin ? this.partner : this.el;
    this.equal = !!options.equal;
  }

  private mismatch(control: FormControl) {
    if (control instanceof HTMLInputElement) {
      const value = Item.getValue(control);
      if (value === null || !control.pattern) {
        return false;
      }
      return !new RegExp(control.pattern).test(value);
    }
    return false;
  }

  validate() {
    const begin = Item.getValue(this.begin);
    const end = Item.getValue(this.end);
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

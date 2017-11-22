import { ExpControl, FormControl } from '../types';
import { Rule } from '../rule';
import { Item } from '../item';

export interface Options {
  partner: ExpControl;
}

export class Equal extends Rule {
  name = 'equal';

  private partner: FormControl;

  constructor(exp: ExpControl, options: Options) {
    super(exp);
    const node = Item.getNode(options.partner);
    if (node === null || !Item.isFormControl(node)) {
      throw new Error();
    }
    this.partner = <FormControl>node;
  }

  validate() {
    return Item.getValue(this.el) === Item.getValue(this.partner);
  }
}

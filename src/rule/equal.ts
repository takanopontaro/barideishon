import { ExpControl, FormControl } from '../types';
import { Rule } from '../rule';
import { Item } from '../item';

export interface Options {
  partner: ExpControl;
}

export class Equal extends Rule {
  name = 'equal';

  private partner: FormControl;

  constructor(el: ExpControl, options: Options) {
    super(el);
    const node = Item.getNode(options.partner);
    if (!node) {
      throw new Error('cannot find an element');
    }
    this.partner = node;
  }

  validate() {
    return Item.getValue(this.el) === Item.getValue(this.partner);
  }
}

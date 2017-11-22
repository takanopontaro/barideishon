import { ExpControl, FormControl } from './types';
import { Item } from './item';

export class Rule {
  name: string;

  protected el: FormControl;

  constructor(exp: ExpControl) {
    const node = Item.getNode(exp);
    if (node === null) {
      throw new Error('cannot find the element');
    }
    this.el = node;
  }

  validate(): boolean {
    return false;
  }
}

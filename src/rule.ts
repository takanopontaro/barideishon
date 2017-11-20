import { ExpControl, FormControl } from './types';
import { Item } from './item';

export class Rule {
  name: string;

  protected el: FormControl;

  constructor(el: ExpControl) {
    const node = Item.getNode(el);
    if (!node) {
      throw new Error('cannot find an element');
    }
    this.el = node;
  }

  validate(): boolean {
    return false;
  }
}

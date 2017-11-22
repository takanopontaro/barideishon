import { ExpControl, FormControl } from './types';
import { Item } from './item';

export class Rule {
  name: string;

  protected el: FormControl;

  constructor(exp: ExpControl) {
    const node = Item.getNode(exp);
    if (node === null || !Item.isFormControl(node)) {
      throw new Error();
    }
    this.el = <FormControl>node;
  }

  validate(): boolean {
    return false;
  }
}

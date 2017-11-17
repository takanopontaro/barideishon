import { FormControl } from '../types';
import { Exp, Rule } from '../rule';

class Equal extends Rule {
  name = 'equal';

  private partner: FormControl;

  constructor(el: Exp, partner: Exp) {
    super();
    this.el = this.getNode(el);
    this.partner = this.getNode(partner);
  }

  validate() {
    return this.getValue(this.el) === this.getValue(this.partner);
  }
}
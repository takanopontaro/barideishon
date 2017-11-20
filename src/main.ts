import {
  ExpForm,
  ExpControl,
  ExpControls,
  FormControl,
  ValidityInfo,
} from './types';

import { RuleManager } from './rule-manager';
import { Item } from './item';
import { Rule } from './rule';

export class Valli {
  private form: HTMLFormElement;
  private items: Item[];
  private events = ['change', 'keyup'];

  static addRule(ruleClass: any) {
    RuleManager.add(ruleClass);
  }

  constructor(form: ExpForm, controls: ExpControls) {
    const nodes = Item.getNodes(controls);
    if (nodes.length === 0) {
      return;
    }
    Array.from(nodes).forEach(node => {
      const el = <FormControl>node;
      const data = el.getAttribute('data-valli');
      const options = data ? eval(`(${data})`) : null;
      const item = new Item(el, options);
      this.items.push(item);
      item.bind(this.events);
    });
    if (typeof form === 'string') {
      this.form = <HTMLFormElement>document.querySelector(form);
    } else {
      this.form = form;
    }
    this.form.noValidate = true;
    this.validate();
  }

  validate() {
    this.items.forEach(item => item.validate());
  }
}

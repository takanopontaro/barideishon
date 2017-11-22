import {
  RuleClass,
  ExpForm,
  ExpControl,
  ExpControls,
  FormControl,
  ValidityInfo,
} from './types';

import { RuleManager } from './rule-manager';
import { Rule } from './rule';
import { Item } from './item';

export class Valli {
  events = ['input'];

  private form: HTMLFormElement;
  private items: Item[] = [];

  static addRule(ruleClass: RuleClass) {
    RuleManager.add(ruleClass);
  }

  constructor(expForm: ExpForm, expControls: ExpControls) {
    const nodes = Item.getNodes(expControls);
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
    if (typeof expForm === 'string') {
      const el = document.querySelector<HTMLFormElement>(expForm);
      if (el === null) {
        throw new Error('cannot find the element');
      }
      this.form = el;
    } else {
      this.form = expForm;
    }
    this.form.noValidate = true;
    this.validate();
  }

  validate() {
    this.items.forEach(item => item.validate());
  }
}

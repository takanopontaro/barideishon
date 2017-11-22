import {
  RuleClass,
  ExpForm,
  ExpControl,
  ExpControls,
  FormControl,
  ValidityInfo,
  ItemOptions,
} from './types';

import { RuleManager } from './rule-manager';
import { Rule } from './rule';
import { Item } from './item';

export class Valli {
  events = ['change', 'input'];

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
    this.initItems(nodes);
    if (typeof expForm === 'string') {
      const el = document.querySelector(expForm);
      if (el === null) {
        throw new Error();
      }
      this.form = <HTMLFormElement>el;
    } else {
      this.form = expForm;
    }
    this.form.noValidate = true;
  }

  private initItems(nodes: Element[]) {
    nodes.forEach(node => {
      const el = <FormControl>node;
      const data = el.getAttribute('data-valli');
      const item = data ? new Item(el, eval(`(${data})`)) : new Item(el);
      this.items.push(item);
    });
  }

  bind() {
    this.items.forEach(item => item.bind(this.events));
    return this;
  }

  unbind() {
    this.items.forEach(item => item.unbind());
    return this;
  }

  getItem(el: Element): Item | undefined {
    return this.items.find(item => item.el === el);
  }

  validate(dryRun = false) {
    return this.items.map(item => item.validate(dryRun));
  }
}

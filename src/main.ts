import { RuleClass, FormControl, ValidityInfo, ItemOptions } from './types';

import { RuleManager } from './rule-manager';
import { Rule } from './rule';
import { Item } from './item';

export class Valli {
  customDataName = 'data-valli';
  events = ['change', 'input'];

  private items: Item[] = [];

  static addRule(ruleClass: RuleClass) {
    RuleManager.add(ruleClass);
  }

  constructor(private form: HTMLFormElement, controls: FormControl[]) {
    this.form.noValidate = true;
    controls.forEach(el => {
      const options = this.getOptions(el);
      const item = options ? new Item(el, options) : new Item(el);
      this.items.push(item);
    });
  }

  private getOptions(el: FormControl): ItemOptions | undefined {
    const data = el.getAttribute(this.customDataName);
    if (data === null || !data.trim()) {
      return;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return;
    }
  }

  bind() {
    this.items.forEach(item => item.bind(this.events));
    return this;
  }

  unbind() {
    this.items.forEach(item => item.unbind(this.events));
    return this;
  }

  getItem(el: FormControl): Item | undefined {
    return this.items.find(item => item.el === el);
  }

  validate(dryRun = false) {
    return this.items.map(item => item.validate(dryRun));
  }
}

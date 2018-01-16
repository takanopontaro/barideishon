import {
  RuleClass,
  FormControl,
  ValidityInfo,
  ItemConf,
  ItemOptions,
  ValliConf,
} from './types';

import { RuleManager } from './rule-manager';
import { Rule } from './rule';
import { Item } from './item';

export class Valli {
  private items: Item[] = [];

  static Rule = Rule;

  static addRule(ruleClass: RuleClass) {
    RuleManager.add(ruleClass);
  }

  constructor({
    form,
    controls,
    attrName = 'data-valli',
    events = ['change', 'input', 'paste', 'cut', 'drop'],
    wait = 100,
  }: ValliConf) {
    form.noValidate = true;
    controls.forEach(el => {
      const conf: ItemConf = { el, events, wait };
      const options = this.getOptions(el, attrName);
      const item = options ? new Item(conf, options) : new Item(conf);
      this.items.push(item);
    });
  }

  private getOptions(
    el: FormControl,
    attrName: string
  ): ItemOptions | undefined {
    const data = el.getAttribute(attrName);
    if (data === null || !data.trim()) {
      return;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return;
    }
  }

  destroy() {
    this.items.forEach(item => item.destroy());
    return this;
  }

  getItem(el: FormControl): Item | undefined {
    return this.items.find(item => item.el === el);
  }

  get valid() {
    return this.validate(true).every(info => info.valid);
  }

  validate(dryRun = false) {
    return this.items.map(item => item.validate(dryRun));
  }
}

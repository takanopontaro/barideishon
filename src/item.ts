import {
  FormControl,
  NativeValidatorOptions,
  ValidityInfo,
  ValidityResult,
  ItemConf,
  ItemOptions,
} from './types';

import { getValue } from './toolbelt';
import { RuleManager } from './rule-manager';
import { Rule } from './rule';
import mapValues from 'lodash-es/mapValues';
import debounce from 'lodash-es/debounce';
import every from 'lodash-es/every';

export class Item {
  el: FormControl;
  destroy: () => void;

  private nativeValidatorOptions: NativeValidatorOptions = {
    required: true,
    pattern: true,
    overflow: true,
    underflow: true,
    step: true,
    long: true,
    short: true,
    type: true,
  };

  private value: string | undefined;
  private rules: Rule[] = [];
  private params: { [key: string]: any } = {};

  constructor({ el, events, wait }: ItemConf, options?: ItemOptions) {
    this.el = el;
    this.value = getValue(el);
    this.destroy = this.bind(events, wait);
    if (!options) {
      return;
    }
    if (typeof options.native === 'boolean') {
      mapValues(this.nativeValidatorOptions, () => options.native);
    } else if (typeof options.native === 'object') {
      Object.assign(this.nativeValidatorOptions, options.native);
    }
    Object.keys(options).forEach(key => {
      if (key === 'native') {
        return;
      }
      const ruleClass = RuleManager.get(key);
      if (!ruleClass) {
        this.params[key] = options[key];
        return;
      }
      this.rules.push(new ruleClass(el, options[key]));
    });
  }

  private handler(ev: Event) {
    this.validate(false, ev.type);
  }

  private get nativeValidity() {
    const {
      valueMissing,
      patternMismatch,
      rangeOverflow,
      rangeUnderflow,
      stepMismatch,
      tooLong,
      tooShort,
      typeMismatch,
    } = this.el.validity;

    const {
      required,
      pattern,
      overflow,
      underflow,
      step,
      long,
      short,
      type,
    } = this.nativeValidatorOptions;

    return !(
      (required && valueMissing) ||
      (pattern && patternMismatch) ||
      (overflow && rangeOverflow) ||
      (underflow && rangeUnderflow) ||
      (step && stepMismatch) ||
      (long && tooLong) ||
      (short && tooShort) ||
      (type && typeMismatch)
    );
  }

  private bind(events: string[], wait: number): () => void {
    const handler = this.handler.bind(this);
    const listener = wait > 0 ? debounce(handler, wait) : handler;
    events.forEach(ev => this.el.addEventListener(ev, listener, false));
    return () => {
      events.forEach(ev => this.el.removeEventListener(ev, listener, false));
      delete this.destroy;
    };
  }

  validate(dryRun = false, type = '') {
    const info: ValidityInfo = {
      el: this.el,
      type,
      value: getValue(this.el),
      prev: this.value,
      valid: false,
      params: this.params,
      custom: this.rules.reduce((acc: any, rule) => {
        acc[rule.name] = rule.validate();
        return acc;
      }, {}),
    };
    info.valid = this.nativeValidity && every(info.custom, 'valid');
    this.value = info.value;
    if (!dryRun) {
      const event = new CustomEvent('valli', {
        bubbles: true,
        cancelable: true,
        detail: info,
      });
      this.el.dispatchEvent(event);
    }
    return info;
  }
}

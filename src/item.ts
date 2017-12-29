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
import { mapValues, debounce } from 'lodash-es';

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
    if (options.rule) {
      Object.keys(options.rule).forEach(key => {
        const ruleClass = RuleManager.get(key);
        this.rules.push(new ruleClass(el, options.rule[key]));
      });
    }
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
    const listener = debounce(this.handler.bind(this), wait);
    events.forEach(ev => this.el.addEventListener(ev, listener, false));
    return () => {
      events.forEach(ev => this.el.removeEventListener(ev, listener, false));
      delete this.destroy;
    };
  }

  validate(dryRun = false, type = '') {
    const info: ValidityInfo = {
      type,
      value: getValue(this.el),
      prev: this.value,
      valid: false,
      native: this.el.validity,
      custom: this.rules.map(rule => ({
        name: rule.name,
        valid: rule.validate(),
      })),
    };
    info.valid = this.nativeValidity && info.custom.every(r => r.valid);
    this.value = info.value;
    if (!dryRun) {
      const event = new CustomEvent('valli', {
        bubbles: true,
        cancelable: true,
        detail: { ...info, el: this.el },
      });
      this.el.dispatchEvent(event);
    }
    return info;
  }
}

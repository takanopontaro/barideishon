import {
  FormControl,
  NativeValidatorOptions,
  ValidityInfo,
  ValidityResult,
  ItemOptions,
} from './types';

import { RuleManager } from './rule-manager';
import { Rule } from './rule';
import { mapValues } from 'lodash-es';

export class Item {
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

  private dirty = false;
  private rules: Rule[] = [];
  private listener = () => {
    this.dirty = true;
    this.validate();
  };

  constructor(public el: FormControl, options?: ItemOptions) {
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

  bind(events: string[]) {
    events.forEach(ev => this.el.addEventListener(ev, this.listener, false));
  }

  unbind(events: string[]) {
    events.forEach(ev => this.el.removeEventListener(ev, this.listener, false));
  }

  validate(dryRun = false) {
    const info: ValidityInfo = {
      dirty: this.dirty,
      valid: false,
      native: this.el.validity,
      custom: this.rules.map(rule => ({
        name: rule.name,
        valid: rule.validate(),
      })),
    };
    info.valid = this.nativeValidity && info.custom.every(r => r.valid);
    if (!dryRun) {
      const event = new CustomEvent('valli', {
        bubbles: true,
        cancelable: true,
        detail: { el: this.el, info },
      });
      this.el.dispatchEvent(event);
    }
    return info;
  }
}

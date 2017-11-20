import {
  FormControl,
  ExpControl,
  ExpControls,
  NativeValidatorOptions,
  ValidityInfo,
  ValidityResult,
  ItemOptions,
} from './types';

import { RuleManager } from './rule-manager';
import { Rule } from './rule';

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
  private events: string[] = [];

  static getNode(exp: ExpControl): FormControl | null {
    if (typeof exp === 'string') {
      const nodes = Item.getNodes(exp);
      return nodes.length > 0 ? nodes[0] : null;
    }
    return exp;
  }

  static getNodes(exp: ExpControls): FormControl[] {
    if (typeof exp === 'string') {
      const nodes = document.querySelectorAll(exp);
      return <FormControl[]>Array.from(nodes);
    }
    return exp;
  }

  static getValue(control: FormControl): string | null {
    if (control instanceof HTMLSelectElement) {
      return control.options[control.selectedIndex].value;
    }
    if (control instanceof HTMLTextAreaElement) {
      return control.value;
    }
    if (control instanceof HTMLInputElement) {
      if (control.type === 'radio') {
        const selector = `input[type="radio"][name="${control.name}"]`;
        const nodes = Array.from(document.querySelectorAll(selector));
        const found = (<HTMLInputElement[]>nodes).find(el => el.checked);
        return found ? found.value : null;
      }
      if (control.type === 'checkbox') {
        return control.checked ? control.value : null;
      }
      return control.value;
    }
    throw new Error();
  }

  constructor(private el: FormControl, options?: ItemOptions) {
    if (!options) {
      return;
    }
    if (typeof options.native === 'boolean') {
      Object.keys(this.nativeValidatorOptions).forEach(
        key => ((<any>this.nativeValidatorOptions)[key] = options.native)
      );
    }
    if (typeof options.native === 'object') {
      Object.assign(this.nativeValidatorOptions, options.native);
    }
    if (typeof options.rule !== 'undefined') {
      for (const key in options.rule) {
        if (options.rule.hasOwnProperty(key)) {
          const ruleClass = RuleManager.get(key);
          this.rules.push(new ruleClass(el, options.rule[key]));
        }
      }
    }
  }

  get nativeValidity() {
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
    this.events = Array.from(events);
    this.events.forEach(ev => {
      this.el.addEventListener(ev, this.validate, false);
    });
  }

  unbind() {
    this.events.forEach(ev => {
      this.el.removeEventListener(ev, this.validate, false);
    });
    this.events.length = 0;
  }

  validate() {
    const info: ValidityInfo = {
      valid: false,
      native: this.el.validity,
      user: this.rules.map(rule => ({
        name: rule.name,
        valid: rule.validate(),
      })),
    };
    info.valid = this.nativeValidity && info.user.every(r => r.valid);
    if (this.events.length > 0) {
      const event = new CustomEvent('valli', {
        detail: { el: this.el, info },
      });
      this.el.dispatchEvent(event);
    }
    return info;
  }
}

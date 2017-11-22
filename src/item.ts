declare var window: any;

(() => {
  if (typeof window.CustomEvent === 'function') {
    return;
  }
  function CustomEvent(event: any, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const ev = document.createEvent('CustomEvent');
    ev.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return ev;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

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
  private listener: () => void;

  static isFormControl(el: Element): boolean {
    return (
      el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLTextAreaElement
    );
  }

  static getNode(exp: ExpControl): Element | null {
    if (exp instanceof Element) {
      return exp;
    }
    return document.querySelector(exp);
  }

  static getNodes(exp: ExpControls): Element[] {
    const nodes =
      typeof exp === 'string' ? document.querySelectorAll(exp) : exp;
    return Array.from(nodes);
  }

  static getValue(control: FormControl): string | null {
    if (control instanceof HTMLSelectElement) {
      return control.options[control.selectedIndex].value;
    }
    if (control instanceof HTMLTextAreaElement) {
      return control.value;
    }
    if (control.type === 'radio') {
      const selector = `input[type="radio"][name="${control.name}"]`;
      const nodes = document.querySelectorAll<HTMLInputElement>(selector);
      if (nodes.length === 0) {
        throw new Error();
      }
      const found = Array.from(nodes).find(node => node.checked);
      return found ? found.value : null;
    }
    if (control.type === 'checkbox') {
      return control.checked ? control.value : null;
    }
    return control.value;
  }

  constructor(public el: FormControl, options?: ItemOptions) {
    this.listener = () => {
      this.dirty = true;
      this.validate();
    };
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
    this.events = Array.from(events);
    this.events.forEach(ev => {
      this.el.addEventListener(ev, this.listener, false);
    });
  }

  unbind() {
    this.events.forEach(ev => {
      this.el.removeEventListener(ev, this.listener, false);
    });
    this.events.length = 0;
  }

  validate(dryRun = false) {
    const info: ValidityInfo = {
      dirty: this.dirty,
      valid: false,
      native: this.el.validity,
      user: this.rules.map(rule => ({
        name: rule.name,
        valid: rule.validate(),
      })),
    };
    info.valid = this.nativeValidity && info.user.every(r => r.valid);
    if (!dryRun && this.events.length > 0) {
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

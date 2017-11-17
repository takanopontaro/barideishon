import {
  FormControl,
  NativeValidatorOptions,
  ValidityInfo,
  ValidityResult,
  ItemOptions,
} from './types';
import { Rule } from './rule';

class Item {
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

  constructor(private el: FormControl, options?: ItemOptions) {
    if (options && typeof options.native === 'boolean') {
      Object.keys(this.nativeValidatorOptions).forEach(
        key => ((<any>this.nativeValidatorOptions)[key] = options.native)
      );
    }
    if (options && typeof options.native === 'object') {
      Object.assign(this.nativeValidatorOptions, options.native);
    }
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
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
    return info;
  }
}

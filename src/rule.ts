import { FormControl, ValidityResult } from './types';

export interface Options {
  [key: string]: any;
}

export class Rule {
  name: string;

  protected result: ValidityResult;

  constructor(protected el: FormControl, options: Options) {
    this.result = {
      valid: false,
      ...options,
    };
  }

  validate(): ValidityResult {
    return this.result;
  }
}

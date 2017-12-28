import { FormControl } from './types';

export class Rule {
  name: string;

  constructor(protected el: FormControl) {}

  validate() {
    return false;
  }
}

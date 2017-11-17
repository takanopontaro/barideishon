import { FormControl } from './types';

export type Exp = string | FormControl;

export class Rule {
  name: string;

  protected el: FormControl;

  validate(): boolean {
    return false;
  }

  getNode(exp: Exp): FormControl {
    if (typeof exp === 'string') {
      const el = document.querySelector(exp);
      if (el === null) {
        throw new Error();
      }
      return el as FormControl;
    }
    return exp;
  }

  getValue(control: FormControl): string | null {
    if (control instanceof HTMLSelectElement) {
      return control.options[control.selectedIndex].value;
    }
    if (control instanceof HTMLTextAreaElement) {
      return control.value;
    }
    if (control instanceof HTMLInputElement) {
      if (control.type === 'radio') {
        const nodes = Array.from(
          document.querySelectorAll(
            `input[type="radio"][name="${control.name}"]`
          )
        ) as HTMLInputElement[];
        const found = nodes.find(el => el.checked);
        return found ? found.value : null;
      }
      if (control.type === 'checkbox') {
        return control.checked ? control.value : null;
      }
      return control.value;
    }
    throw new Error();
  }
}

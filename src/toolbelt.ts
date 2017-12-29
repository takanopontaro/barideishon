import { FormControl } from './types';

export function getValue(el: FormControl): string | undefined {
  if (el instanceof HTMLSelectElement) {
    return el.options[el.selectedIndex].value;
  }
  if (el instanceof HTMLTextAreaElement) {
    return el.value;
  }
  if (el.type === 'checkbox') {
    return el.checked ? el.value : undefined;
  }
  if (el.type === 'radio') {
    const selector = `input[type="radio"][name="${el.name}"]`;
    const nodes = document.querySelectorAll<HTMLInputElement>(selector);
    const checked = Array.from(nodes).find(node => node.checked);
    return checked ? checked.value : undefined;
  }
  return el.value;
}

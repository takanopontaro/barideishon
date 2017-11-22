import { Valli } from '../src/main';

const btn: any = document.querySelector('button[type="submit"]');
const form: any = document.querySelector('form');
const inputs: any[] = Array.from(document.querySelectorAll('input'));

form.addEventListener(
  'valli',
  (ev: CustomEvent) => {
    if (!ev.detail.info.dirty) {
      return false;
    }
    btn.style.borderColor = ev.detail.info.valid ? 'black' : 'red';
  },
  false
);

inputs.forEach(el => {
  el.addEventListener(
    'valli',
    (ev: CustomEvent) => {
      if (!ev.detail.info.dirty) {
        return false;
      }
      ev.detail.el.style.borderColor = ev.detail.info.valid ? 'black' : 'red';
    },
    false
  );
});

const valli = new Valli('form', 'input').bind();
valli.validate();
// valli.getItem(inputs[0]).validate();

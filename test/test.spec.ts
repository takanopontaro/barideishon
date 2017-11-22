import { Valli } from '../src/main';

const valli = new Valli('form', 'input');

const btn = document.querySelector<HTMLButtonElement>('button[type="submit"]');

document.querySelector('form').addEventListener(
  'valli',
  (e: CustomEvent) => {
    btn.style.borderColor = e.detail.info.valid ? 'black' : 'red';
  },
  false
);

document.querySelectorAll('input').forEach(el => {
  el.addEventListener(
    'valli',
    (e: CustomEvent) => {
      e.detail.el.style.borderColor = e.detail.info.valid ? 'black' : 'red';
    },
    false
  );
});

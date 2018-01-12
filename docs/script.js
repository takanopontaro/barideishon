const form = document.querySelector('form');
const controls = Array.from(document.querySelectorAll('input'));
const button = document.querySelector('button');

const valli = new Valli({ form, controls });

function getErrorMsg(el) {
  const {
    patternMismatch,
    tooLong,
    tooShort,
    typeMismatch,
    valueMissing,
  } = el.validity;
  const messages = [];
  if (patternMismatch) {
    messages.push('pattern');
  }
  if (tooLong) {
    messages.push('lenth - long');
  }
  if (tooShort) {
    messages.push('lenth - short');
  }
  if (typeMismatch) {
    messages.push('type');
  }
  if (valueMissing) {
    messages.push('required');
  }
  return messages.join('<br>');
}

function handleError(validityInfo) {
  const { prev, value, valid, el, custom, params } = validityInfo;
  const customRules = Object.keys(custom);
  if (prev === value) {
    return;
  }
  if (valid) {
    el.classList.remove('error');
  } else {
    el.classList.add('error');
  }
  if (customRules.length === 0) {
    const err = document.querySelector(params.err);
    err.innerHTML = valid ? '' : 'Violation: ' + getErrorMsg(el);
    return;
  }
  customRules.forEach(rule => {
    const { valid, partner, err } = custom[rule];
    const partnerEl = document.querySelector(partner);
    const errEl = document.querySelector(err);
    if (valid) {
      errEl.innerHTML = '';
      if (partnerEl) {
        partnerEl.classList.remove('error');
      }
    } else {
      errEl.innerHTML = 'Violation: ' + rule;
    }
  });
}

form.addEventListener(
  'valli',
  ev => {
    handleError(ev.detail);
    button.disabled = !valli.valid;
  },
  false
);

valli.validate();

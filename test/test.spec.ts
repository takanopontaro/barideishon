declare var describe: any;
declare var it: any;
declare var chai: any;

import { Valli, FormControl, ValidityInfo, ValliConf, getValue } from '../src/';
import * as $ from 'jquery';

function getValliConf(formId: string, extra?: any): ValliConf {
  const form = $(formId)[0] as HTMLFormElement;
  const controls = $('input', form).get() as FormControl[];
  return { form, controls, ...extra };
}

function checkValidity(valli: Valli, dom: HTMLElement, expected: boolean) {
  const info = valli.validate(true).find(({ el }) => el === dom)!;
  chai.assert.equal(info.valid, expected);
}

class Match extends Valli.Rule {
  private text: string;

  constructor(el: FormControl, options: any) {
    super(el, options);
    this.text = options.text;
  }

  validate() {
    this.result.valid = getValue(this.el) === this.text;
    return this.result;
  }
}

Valli.addRule('match', Match);

describe('Native Rule', () => {
  const conf = getValliConf('#native-form');
  const valli = new Valli(conf);
  describe('Required (just in case)', () => {
    it('should be valid when the value exists', () => {
      const $el1 = $('#native-1');
      const $el2 = $('#native-2');
      checkValidity(valli, $el1[0], false);
      checkValidity(valli, $el2[0], false);
      $el1.val('valli');
      $el2.prop('checked', true);
      checkValidity(valli, $el1[0], true);
      checkValidity(valli, $el2[0], true);
    });
  });
  describe('All', () => {
    it('Actually no need to test', () => {
      chai.assert.equal(true, true);
    });
  });
});

describe('Builtin Rule', () => {
  const conf = getValliConf('#builtin-form');
  const valli = new Valli(conf);
  describe('Equal', () => {
    it('should be valid when the two values are equal', () => {
      const $el1 = $('#builtin-equal-1');
      const $el2 = $('#builtin-equal-2');
      $el1.val('valli');

      $el2.val('foo');
      checkValidity(valli, $el1[0], false);
      checkValidity(valli, $el2[0], false);

      $el2.val('valli');
      checkValidity(valli, $el1[0], true);
      checkValidity(valli, $el2[0], true);
    });
  });
  describe('Different', () => {
    it('should be valid when the two values are not equal', () => {
      const $el1 = $('#builtin-different-1');
      const $el2 = $('#builtin-different-2');
      $el1.val('valli@example.com');

      $el2.val('valli@example.org');
      checkValidity(valli, $el2[0], true);

      $el2.val('valli@example.com');
      checkValidity(valli, $el2[0], false);
    });
  });
  describe('Within', () => {
    it('should be valid when the two values are corresponding range of dates', () => {
      const $el1 = $('#builtin-within-1');
      const $el2 = $('#builtin-within-2');

      $el1.val('2017/12/30');
      $el2.val('2017/12/31');
      checkValidity(valli, $el1[0], true);
      checkValidity(valli, $el2[0], true);

      $el1.val('2017/12/31');
      $el2.val('2017/12/30');
      checkValidity(valli, $el1[0], false);
      checkValidity(valli, $el2[0], false);

      $el1.val('2017/1/1');
      $el2.val('foo');
      checkValidity(valli, $el1[0], false);
      checkValidity(valli, $el2[0], false);
    });
  });
});

describe('Custom Rule', () => {
  const conf = getValliConf('#custom-form');
  const valli = new Valli(conf);
  describe('Match', () => {
    it('should be valid when the value is `valli`', () => {
      const $el = $('#custom-match');

      $el.val('foo');
      checkValidity(valli, $el[0], false);

      $el.val('valli');
      checkValidity(valli, $el[0], true);
    });
  });
});

describe('API', () => {
  const conf = getValliConf('#api-form', { attrName: 'data-custom-valli' });
  describe('Attribute name', () => {
    it('should be able to change', () => {
      const valli = new Valli(conf);

      const $el1 = $('#api-equal-1');
      const $el2 = $('#api-equal-2');
      $el1.val('valli');

      $el2.val('foo');
      checkValidity(valli, $el1[0], false);
      checkValidity(valli, $el2[0], false);

      $el2.val('valli');
      checkValidity(valli, $el1[0], true);
      checkValidity(valli, $el2[0], true);

      valli.destroy();
    });
  });
  describe('Debounce', () => {
    const $el = $('#api-wait');
    const $form = $('#api-form');
    let callCount = 0;
    $form.on('valli', () => callCount++);
    it('should be available by default (100ms)', (done: any) => {
      const valli = new Valli(conf);
      $el[0].dispatchEvent(new Event('change'));
      $el[0].dispatchEvent(new Event('change'));
      $el[0].dispatchEvent(new Event('change'));
      setTimeout(() => {
        valli.destroy();
        chai.assert.equal(callCount, 1);
        done();
      }, 150);
    });
    it('wait should be able to change', (done: any) => {
      callCount = 0;
      const valli = new Valli({ ...conf, wait: 0 });
      $el[0].dispatchEvent(new Event('change'));
      $el[0].dispatchEvent(new Event('change'));
      $el[0].dispatchEvent(new Event('change'));
      setTimeout(() => {
        valli.destroy();
        $form.off('valli');
        chai.assert.equal(callCount, 3);
        done();
      }, 150);
    });
  });
  describe('Custom parameters', () => {
    it('should be passed to the event object', (done: any) => {
      const valli = new Valli(conf);
      const $el = $('#api-equal-1');
      $el.on('valli', ({ originalEvent }) => {
        valli.destroy();
        $el.off('valli');
        const info: ValidityInfo = (<CustomEvent>originalEvent).detail;
        chai.assert.equal(info.custom.equal.foo, 'bar');
        done();
      });
      $el[0].dispatchEvent(new Event('change'));
    });
  });
  describe('Native validator', () => {
    it('should be able to disable', (done: any) => {
      const valli = new Valli(conf);
      const $el = $('#api-native');
      $el.on('valli', ({ originalEvent }) => {
        valli.destroy();
        $el.off('valli');
        const info: ValidityInfo = (<CustomEvent>originalEvent).detail;
        chai.assert.equal(info.el.validity.typeMismatch, true);
        chai.assert.equal(info.el.validity.valueMissing, false);
        chai.assert.equal(info.valid, true);
        done();
      });
      $el.val('invalid@email@address');
      $el[0].dispatchEvent(new Event('change'));
    });
  });
});

export class Barideishon {
  private items: Item[];
  event: {
    validate: 'validation';
    change: 'change';
    keyup: 'keyup';
  };
  selector: '.g-input:not([data-validation="false"]), input:checkbox';
  class: { error: 'g-input-err'; dirty: 'g-input-dirty' };

  constructor() {}

  convertStringToObject(str: string) {
    const obj = {};
    if (str && /:/.test(str)) {
      str
        .trim()
        .match(/[^,\s]+?\s*:[^,]+/g)
        .forEach(s => {
          const kv: any[] = s.trim().split(/\s*:\s*/);
          switch (true) {
            case /^[+-]?\d+\.?\d*$/.test(kv[1]):
              kv[1] = +kv[1];
              break;
            case kv[1] === 'true':
              kv[1] = true;
              break;
            case kv[1] === 'false':
              kv[1] = false;
              break;
            // no default
          }
          obj[kv[0]] = kv[1];
        });
    }
    return obj;
  }

  init() {
    var event = Validation.event.validate;
    var $form = $(this);
    var $buttons = $('[type="submit"]', $form);
    $form[0].noValidate = true;
    $form
      .on(event, function(e, isValid) {
        $buttons.prop('disabled', !isValid);
      })
      .trigger(event, [$form[0].checkValidity()]);
    $(Validation.selector, this).each(function() {
      Validation.on(this, $form[0]);
    });
  }

  addItem(el) {
    this.items.push(new Item(el));
  }

  dryRun(form, elements) {
    var isValid = elements.every(function(el) {
      return Validation.validate(el).ok;
    });
    $(form).trigger(Validation.event.validate, isValid);
  }

  validate() {}

  callback(el, form) {
    var $el = $(el);
    var elements = $(Validation.selector, form).get();
    var custom = Validation.getCustom(el);
    var $errorEl = custom.err ? $(custom.err) : $(el).prev('.g-form_err');
    return function(e, sideEffect) {
      var res = Validation.validate(el);
      $errorEl.empty();
      $el.removeClass(Validation.class.error);
      if (!sideEffect) {
        $el.addClass(Validation.class.dirty);
      }
      if (!sideEffect && custom.equal) {
        $(custom.equal).trigger(Validation.event.keyup, [true]);
      }
      if (!sideEffect && custom.range) {
        $(custom.range).trigger(Validation.event.keyup, [true]);
      }
      if (
        $el.hasClass(Validation.class.dirty) &&
        !res.ok &&
        !(custom.shadow && res.type === 'equal')
      ) {
        $errorEl.html(res.message);
        $el.addClass(Validation.class.error);
      }
      Validation.dryRun(form, elements);
    };
  }

  on(el, form) {
    $(el).on(
      Validation.event.keyup + ' ' + Validation.event.change,
      _.debounce(Validation.callback(el, form), 300, { leading: true })
    );
  }
}

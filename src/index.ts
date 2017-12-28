export { Valli } from './main';

export {
  RuleClass,
  FormControl,
  NativeValidatorOptions,
  ValidityInfo,
  ValidityResult,
  ItemOptions,
} from './types';

declare var window: any;

(() => {
  if (typeof window.CustomEvent === 'function') {
    return;
  }
  function CustomEvent(event: any, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const ev = document.createEvent('CustomEvent');
    ev.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return ev;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

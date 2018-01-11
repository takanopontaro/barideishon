var form = document.querySelector('form');
var controls = Array.prototype.slice.call(document.querySelectorAll('input'));
var button = document.querySelector('button');

var valli = new Valli({ form: form, controls: controls });

form.addEventListener('valli', function (ev) {
  var el = ev.detail.el;
  var valid = ev.detail.valid;
  el.style.background = valid ? '' : '#fcc';
  button.disabled = !valli.valid;
}, false);

function printValue(slider, id) {
  document.querySelector(id).value = slider.value;
}

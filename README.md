# Valli

Valli is an unobtrusive validator. It's designed on the basis of event-driven architecture with the help of HTML5.

## Installation

```shell
yarn add valli
# or "npm i valli"
```

- [cdn](https://unpkg.com/valli/umd/valli.min.js)

## Usage

```html
<form>
  <input type="email" required>
  <input type="text" pattern="^\w+$">
  <button>submit</button>
</form>
```

```js
import { Valli } from 'Valli';

const form = document.querySelector('form');
const controls = Array.from(document.querySelectorAll('input'));
const button = document.querySelector('button');

const valli = new Valli({ form, controls });

form.addEventListener('valli', ev => {
  const { el, valid } = ev.detail;
  el.style.background = valid ? '' : '#fcc';
  button.disabled = !valli.valid;
}, false);
```

## See also

- [API](docs/api.md)
- [DEMO](http://jsbin.com/cafabob/edit?html,js,output)

import * as $ from 'jquery';
import { Valli, FormControl } from '../src/';

const form = $('form')[0] as HTMLFormElement;
const controls = $('input', form).get() as FormControl[];

$(form).on('valli', ({ originalEvent }) => {
  const data = (<CustomEvent>originalEvent).detail;
  console.log(data);
});

const valli = new Valli({ form, controls });
valli.validate();

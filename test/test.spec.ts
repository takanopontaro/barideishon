Barideishon.init('form.j-validation');

// pattern="^\\d{4}/\\d{2}/\\d{2}$" data-validation="type:date,err:#range,range:#date1,attribute:開始日,date:終了日"

new Item('.g-input');
new Item('.g-input', { native: false });
new Item('.g-input', {
  native: {
    type: false,
  },
});
new Item('.g-input', {
  native: false,
  user: [
    new Equal('.g-input', '#hoge'),
    new Different('.g-input', '#hoge'),
    new Within('.g-input', '#hoge', true),
  ],
});

$('.g-input')
  .on('invalid', e => console.log(e))
  .on('invalid:native', e => console.log(e))
  .on('invalid:native:required', e => console.log(e))
  .on('invalid:native:pattern', e => console.log(e))
  .on('invalid:native:overflow', e => console.log(e))
  .on('invalid:native:underflow', e => console.log(e))
  .on('invalid:native:step', e => console.log(e))
  .on('invalid:native:long', e => console.log(e))
  .on('invalid:native:short', e => console.log(e))
  .on('invalid:native:type', e => console.log(e))
  .on('invalid:user:equal', e => console.log(e))
  .on('invalid:user:different', e => console.log(e))
  .on('invalid:user:within', e => console.log(e));

$('form').on('invalid', e => console.log(e));

const co  = require('co');
const gsm = require('..');

const modem = new gsm.Modem(
  '/dev/tty.usbserial'
);

modem.on('error', err => {
  console.log(err);
});

modem.on('message', message => {
  // console.log(message);
});

modem.on('open', () => {
  console.log('Ready!');
});

modem.on('+CRING', (type) => {
  console.log('RING!', type);
});

modem.on('+CLIP', (number) => {
  console.log('Incoming call:', number);
});

modem.open(() => {

co(function*(){

  console.log(yield modem.reset());

});

});


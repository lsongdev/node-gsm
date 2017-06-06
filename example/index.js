const gsm = require('..');

const modem = new gsm.Modem(
  '/dev/tty.usbserial'
);

modem.on('error', err => {
	console.log(err);
});

modem.on('message', message => {
	console.log(message);
});

modem.open(() => {
	console.log('Ready!');
	// modem.send('ATZ');
	modem.send('ATI');
	modem.send('ATI');
	// modem.flush();
})
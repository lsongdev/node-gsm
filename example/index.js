const co  = require('co');
const gsm = require('..');

const modem = new gsm.Modem(
  '/dev/tty.usbserial'
);

var timer = null;

modem.on('error', err => {
	console.log(err);
});

// modem.on('message', message => {
// 	console.log(message);
// });

modem.open(() => {

	co(function*(){

		console.log('Ready!');
		console.log(yield modem.send('ATZ'));
		console.log(yield modem.send('ATZ'));
		console.log(yield modem.send('ATI'));
		console.log(yield modem.test('CMGF'));
		console.log(yield modem.set('CMGF', 4));
		console.log(yield modem.get('CSQ'));

	});
})
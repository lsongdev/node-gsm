const gsm = require('..');

const modem = new gsm.Modem({
  port: '/dev/tty.usbserial'
});

gsm.test('CMGF').then(() => {
  
  gsm.exec('CMGF').then(res => {
  	console.log(res);
  });

});

gsm.get('CMXX').then(value => {
	console.log(value);
});

gsm.set('CMXX', 1).then(res => {

});

gsm.write('xxx');
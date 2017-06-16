
const gsm = require('gsm2');

const modem = new gsm.Modem(
  '/dev/tty.usbserial'
);

const network = new gsm.GPRS(modem);

yield network.init();

const request = network.request({
  method: 'get',
  url   : 'http://api.lsong.org'
}, response => {
  // stream
  console.log(response);
});

request.send();
const co  = require('co');
const gsm = require('..');

const modem = new gsm.Modem(
  '/dev/tty.usbserial', {
    retry: 1000
  }
);

modem.open(() => co(function*(){
    
  const network = new gsm.GPRS(modem);

  yield network.init();

  // const request = network.request({
  //   method: 'get',
  //   url   : 'http://api.lsong.org'
  // }, response => {
  //   // stream
  //   console.log(response);
  // }).send();

}));

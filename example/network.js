const gsm = require('..');

const modem = new gsm.Modem(
  '/dev/tty.usbserial', {
    retry: 1000
  }
);

const network = new gsm.Network(modem);

(async () => {

  await network.init();
  
  network.request({
    hostname: 'lsong.org',
    method: 'GET',
    path: '/'
  }, (err, res) => {
    console.log(err, res);
  });


})();
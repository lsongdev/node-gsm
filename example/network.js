import { GPRS } from "../index.js";

const network = new GPRS(
  '/dev/tty.usbserial', {
    retry: 1000
  }
);

(async () => {

  await network.init();
  
  const res = await network.request({
    hostname: 'lsong.org',
    method: 'GET',
    path: '/'
  });
  console.log(res);

})();
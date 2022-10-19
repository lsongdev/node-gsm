"use strict";
const async = require('async');
const { SerialPort } = require('serialport');
/**
 * [Modem description]
 * @param {[type]} options [description]
 */
class Modem extends SerialPort {
  constructor(port, options) {
    Object.assign(options, {
      retry: 0,
      timeout: 5000,
      dataBits: 8,
      stopBits: 1,
      baudRate: 115200,
      autoOpen: false
    }, options);
    super({
      path: port,
      ...options
    });
    this.options = options;
    var output = '';
    var regexp = /(\r?(.+)\r)?\r\n(.+)\r\n$/;
    this.on('data', chunk => {
      output += chunk;
      if (/>/.test(output)) {
        this.emit('message', output);
        output = '';
        return;
      }
      if (regexp.test(output)) {
        var m = regexp.exec(output);
        this.emit('message', m[3], m);
        output = '';
      }
    }).on('message', message => {
      var p = message.split(/:\s?/);
      if (p.length === 2) this.emit(p[0], p[1]);
    });
    this.queue = async.queue((task, done) => {
      // Syntax:
      // AT<command ...><CR>
      this.write(task.data + '\r', () => this.drain());
      function onMessage(message) {
        clearInterval(this.retry);
        clearTimeout(this.timeout);
        if (/ERROR/.test(message)) {
          task.reject(message);
        } else {
          task.accept(message);
        }
        this.removeListener('message', onMessage);
        done();
      }
      this.on('message', onMessage);
      // to temporary disable timeout use: null, 0, false
      if ((task.timeout !== undefined ? task.timeout : this.options.timeout)) {
        this.timeout = setTimeout(() => {
          clearInterval(this.retry);
          task.reject(new Error('Timeout exceeded'));
          this.removeListener('message', onMessage);
          done();
        }, +(task.timeout || this.options.timeout));
      }
      // to temporary disable retry use: null, 0, false
      if ((task.retry !== undefined ? task.retry : this.options.retry)) {
        this.retry = setInterval(() => {
          this.write(task.data + '\r', () => this.drain());
        }, +(task.retry || this.options.retry));
      }
    });
  }
  send(data, options) {
    var command = Object.assign({ data }, options || {});
    command.promise = new Promise((accept, reject) => {
      command.accept = accept;
      command.reject = reject;
    });
    this.queue.push(command);
    return command.promise;
  }
  test(cmd) {
    return this.send(`AT+${cmd}?`);
  }
  exec(cmd) {
    return this.send(`AT+${cmd}`);
  }
  get(name) {
    return this.send(`AT+${name}=?`);
  }
  set(name, value, options) {
    return this.send(`AT+${name}=${value}`, options);
  }
  reset() {
    return this.send('ATZ');
  }
  save() {
    return this.send('AT&W');
  }
  factory() {
    return this.send('AT&F');
  }
  clock() {
    return this.test('CCLK');
  }
  debug(n = 0) {
    return this.set('CMEE', n);
  }
  echo(n = 0) {
    return this.exec('ATE' + n);
  }
  id() {
    return this.send('ATI');
  }
  sn() {
    // TODO:
  }
  imsi() {
    return this.test('CIMI').then(isOK => isOK && this.exec('CIMI'));
  }
  model() {
    return this.test('CGMM').then(isOK => isOK && this.exec('CGMM'))
  }
  version() {
    // AT+CGMR
    return this.test('GMR').then(isOK => isOK && this.exec('GMR'))
  }
  manufacturer() {
    // AT+CGMI
    return this.test('GMI').then(isOK => isOK && this.exec('GMI'))
  }
  signal_strength() {
    return this.test('CSQ').then(() => {
      // this.get('CSQ').then(res => {
      //   return res.match(/\+CSQ:\s(.+)/)[1];
      // });
      return this.exec('CSQ').then(res => {
        res = res.match(/\+CSQ:\s*(.+)/);
        res = res[1].split(',');
        return {
          rssi: res[0],
          ber: res[1]
        };
      })
    });
  }
  dial(number) {
    return this.send(`ATD${number};`);
  }
  hangup() {
    return this.send('ATH');
  }
}

module.exports = Modem;

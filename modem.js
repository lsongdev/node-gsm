"use strict";
const util         = require('util');
const async        = require('async');
const {SerialPort} = require('serialport');
/**
 * [Modem description]
 * @param {[type]} options [description]
 */
function Modem(port, options){
  if(!(this instanceof Modem))
    return new Modem(port, options);
  var defaults = {
    retry   : 0,
    timeout : 5000,
    dataBits: 8,
    stopBits: 1,
    baudRate: 115200,
    autoOpen: false
  };
  for(var k in options)
    defaults[k] = options[k];
  this.options = defaults;
  
  Object.assign(this, new SerialPort({
    path: port,
    ...this.options
  }));
  
  var output = '';
  var regexp = /(\r?(.+)\r)?\r\n(.+)\r\n$/;
  this.on('data', chunk => {
    output += chunk;
    if(/>/.test(output)){
      this.emit('message', output);
      output = '';
      return;
    }
    if(regexp.test(output)){
      var m = regexp.exec(output);
      this.emit('message', m[3], m);
      output = '';
    }
  }).on('message', message => {
    var p = message.split(/:\s?/);
    if(p.length === 2) this.emit(p[0], p[1]);
  });
  this.queue = async.queue((task, done) => {
    // Syntax:
    // AT<command ...><CR>
    this.write(task.data + '\r', ()=>this.drain());
    function onMessage(message){
      clearInterval(this.retry);
      clearTimeout(this.timeout);
      if(/ERROR/.test(message)){
        task.reject(message);
      }else{
        task.accept(message);
      }
      this.removeListener('message', onMessage);
      done();
    }
    this.on('message', onMessage);
    // to temporary disable timeout use: null, 0, false
    if((task.timeout !== undefined ? task.timeout : this.options.timeout)){
      this.timeout = setTimeout(() => {
        clearInterval(this.retry);
        task.reject(new Error('Timeout exceeded'));
        this.removeListener('message', onMessage);
        done();
      }, +(task.timeout || this.options.timeout));
    }
    // to temporary disable retry use: null, 0, false
    if((task.retry !== undefined ? task.retry : this.options.retry)){
      this.retry = setInterval(() => {
        this.write(task.data + '\r', ()=>this.drain());
      }, +(task.retry || this.options.retry));
    }
  });
  return this;
};

util.inherits(Modem, SerialPort);

Modem.prototype.send = function(data, options){
  var command = Object.assign({ data }, options || {});
  command.promise = new Promise((accept, reject) => {
    command.accept = accept;
    command.reject = reject;
  });
  this.queue.push(command);
  return command.promise;
};

Modem.prototype.test = function(cmd){
  return this.send(`AT+${cmd}?`);
};

Modem.prototype.exec = function(cmd){
  return this.send(`AT+${cmd}`);
};

Modem.prototype.get = function(name){
  return this.send(`AT+${name}=?`);
};

Modem.prototype.set = function(name, value, options){
  return this.send(`AT+${name}=${value}`, options);
};

Modem.prototype.id = function() {
  return this.send('ATI');
};

Modem.prototype.sn = function() {
  
};

Modem.prototype.imsi = function() {
  return this.test('CIMI').then(isOK => {
    return this.exec('CIMI');
  })
};

Modem.prototype.model = function() {
  return this.test('CGMM').then(isOK => {
    return this.exec('CGMM');
  })
};

Modem.prototype.version = function() {
  // AT+CGMR
  return this.test('GMR').then(isOK => {
    return this.exec('GMR');
  })
};

Modem.prototype.manufacturer = function() {
  // AT+CGMI
  return this.test('GMI').then(isOK => {
    return this.exec('GMI');
  })
};

Modem.prototype.clock = function() {
  return this.test('CCLK');
};

Modem.prototype.signal_strength = function() {
  return this.test('CSQ').then(() => {
    // this.get('CSQ').then(res => {
    //   return res.match(/\+CSQ:\s(.+)/)[1];
    // });
    return this.exec('CSQ').then(res => {
      res = res.match(/\+CSQ:\s*(.+)/);
      res = res[1].split(',');
      return {
        rssi: res[0],
        ber : res[1]        
      };
    })
  });
};

Modem.prototype.sms_center = function() {
  return this.test('CSCA');
};

Modem.prototype.sms_mode = function(mode) {
  return this.set('CMGF', mode || 0);
};

Modem.prototype.sms_list = function(mode) {
  return this.get('CMGL').then(str => {
    return /\((.+)\)/.exec(str)[1]
      .split(',')
      .map(s => s.replace(/["']/g, ''));
  }).then(modes => {
    return this.set('CMGL', modes[ mode || 0 ]);
  });
};

Modem.prototype.sms_read = function(index){
  return this.set('CMGR', index);
}

Modem.prototype.sms_send = function(number, content) {
  // temporary disable retry.
  return this.set('CMGS', `"${number}"`, { retry: 0 }).then(x => {
    return this.send(content + '\u001a');
  });
};

Modem.prototype.sms_delete = function(index){
  return this.set('CMGD', index);
}

Modem.prototype.debug = function(n){
  return this.set('CMEE', n | 0);
};

Modem.prototype.dial = function(number, mgsm) {
  return this.send(`ATD${number};`);
};

Modem.prototype.hangup = function() {
  return this.send('ATH');
};

Modem.prototype.echo = function(n){
  return this.exec('ATE' + (n | 0));
};

Modem.prototype.reset = function(value) {
  return this.send('ATZ');
};

Modem.prototype.save = function(n){
  return this.send('AT&W');
};

Modem.prototype.factory = function() {
  return this.send('AT&F');
};

module.exports = Modem;

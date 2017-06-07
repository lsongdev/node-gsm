"use strict";
const util         = require('util');
const async        = require('async');
const EventEmitter = require('events');
const SerialPort   = require('serialport');
const PDU          = require('./pdu');
/**
 * [Modem description]
 * @param {[type]} options [description]
 */
function Modem(port, options){
  const self = this;
  if(!(this instanceof Modem))
    return new Modem(port, options);
  var defaults = {
    dataBits: 8,
    stopBits: 1,
    baudRate: 9600,
    autoOpen: false
  };
  for(var k in options)
    defaults[k] = options[k];
  this.options = defaults;
  this.options.parser = SerialPort.parsers.raw;
  SerialPort.call(this, port, this.options);
  var buffer = '';
  var regexp = /(\r?(.+)\r)?\r\n(.+)\r\n$/;
  this.on('data', function(chunk){
    buffer += chunk;
    if(regexp.test(buffer)){
      var m = regexp.exec(buffer);
      var p = m[3].split(/:\s?/);
      self.emit('message', m[3], m);
      if(p.length === 2) this.emit(p[0], p[1]);
      buffer = '';
    }
  });
  this.queue = async.queue(function(task, done){
    self.write(task.data);
    function onMessage(message){
      clearInterval(timer);
      clearTimeout(timeout);
      task.accept(message);
      self.removeListener('message', onMessage);
      done();
    }
    self.on('message', onMessage);
    var timer = setInterval(() => {
      // process.stdout.write('.');
      self.write(task.data);
    }, 500);
    var timeout = setTimeout(() => {
      done();
      clearInterval(timer);
      console.log('timeout');
      task.reject(new Error('timeout'));
      self.removeListener('message', onMessage);
    }, 3000);
  });
  return this;
};

util.inherits(Modem, SerialPort);

Modem.prototype.send = function(data){
  var command = { data: data + '\r' };
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

Modem.prototype.set = function(name, value){
  return this.send(`AT+${name}=${value}`);
};

Modem.prototype.id = function() {
  return this.send('ATI');
};

Modem.prototype.clock = function() {
  return this.test('CCLK');
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

Modem.prototype.signal_strength = function() {
  return this.test('CSQ').then(isOK => {
    this.get('CSQ').then(res => {
      return res.match(/\+CSQ:\s(.+)/)[1];
    });
    return this.exec('CSQ').then(res => {
      res = res.match(/\+CSQ:\s*(.+)/);
      res = res[1].split(',');
      return {
        rssi: res[0],
        ber : res[1]        
      };
    });
  })
};

Modem.prototype.imei = function(value, imei) {
  if(typeof value !== 'undefined'){
    value = [ 
      value, 7, value ? imei : null 
    ].filter(Boolean).join(',');
    return this.set('EGMR', value);
  }
  return this.test('GSN').then(isOK => {
    return this.exec('GSN');
  });
};

Modem.prototype.sms_center = function() {
  return this.test('CSCA');
};

Modem.prototype.sms_list = function() {
  return this.set('CMGL', 4);
};

Modem.prototype.debug = function(n){
  return this.set('CMEE', n | 0);
};

Modem.prototype.dial = function(number, mgsm) {
  return this.send(`ATD${number};`);
};

Modem.prototype.hangup = function() {
  return this.send('ATH');
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
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
    parity: 'none',
    baudRate: 9600,
    autoOpen: false
  };
  for(var k in options)
    defaults[k] = options[k];
  this.options = defaults;
  this.options.parser = SerialPort.parsers.raw;
  SerialPort.call(this, port, this.options);
  var buffer = '';
  this.on('data', function(chunk){
    buffer += chunk;
    var parts = buffer.split(/[\r|\n]/g);
    parts = parts.filter(Boolean);
    var code = parts.slice(-1)[0];
    if(code && (code === 'OK' || ~code.indexOf('ERROR'))){
      this.emit('message', parts);
      buffer = '';
    }
  });
  this.queue = async.queue(function(task, done){
    function onMessage(message){
      clearInterval(timer);
      clearTimeout(timeout);
      task.accept(message);
      self.removeListener('message', onMessage);
      done();
    }
    self.on('message', onMessage);
    var timer = setInterval(() => {
      self.write(task.data + '\r');
    }, 500);
    var timeout = setTimeout(() => {
      done();
      clearInterval(timer);
      console.log('timeout');
      // task.reject(new Error('timeout'));
      self.removeListener('message', onMessage);
    }, 3000);
  });
  return this;
};

util.inherits(Modem, SerialPort);

Modem.prototype.send = function(data){
  var command = { data: data };
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

Modem.prototype.call = function(number, mgsm) {
  return this.send(`ATD${number};`);
};

Modem.prototype.hangup = function() {
  return this.send('ATH');
};

Modem.prototype.imei = function(value, imei) {
  value = [ 
    value, 7, value ? imei : null 
  ].filter(Boolean).join(',');
  return this.set('EGMR', value);
};

Modem.prototype.debug = function(n){
  return this.set('CMEE', n | 0);
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
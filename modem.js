"use strict";
const util         = require('util');
const EventEmitter = require('events');
const SerialPort   = require('serialport');

const PDU          = require('./pdu');
const commands     = require('./commands');
/**
 * [Modem description]
 * @param {[type]} options [description]
 */
function Modem(options){
  if(!(this instanceof Modem))
    return new Modem(options);
  EventEmitter.call(this);
  this.queue = [];
  this.device = new SerialPort(options.port, options);
  this.device.on('data', function(buf){
    console.log(buf.toString());
  });
  return this;
}

util.inherits(Modem, EventEmitter);
/**
 * [open description]
 * @return {[type]} [description]
 */
Modem.prototype.open = function(){
  var self = this;
  this.device.open(function(err){
    console.log('open');
  });
};
/**
 * [write description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Modem.prototype.write = function(data){
  var command = { data };
  command.promise = new Promise((accept, reject) => {
    command.callback = function(err, res){
      if(err) return reject(err);
      accept(res);
    };
  });
  this.queue.push(command);
  return command.promise;
};

Modem.prototype.test = function(cmd){
  return this.write(`AT+${cmd}?`);
};

Modem.prototype.exec = function(cmd){
  return this.write(`AT+${cmd}`);
};

Modem.prototype.get = function(name){
  return this.write(`AT+${name}=?`);
};

Modem.prototype.set = function(name, value){
  return this.write(`AT+${name}=${value}`);
};

Modem.prototype.call = function(number, mgsm) {
  return this.write(`ATD${number};`);
};

Modem.prototype.hangup = function() {
  return this.write('ATH');
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
  return this.write('ATZ');
};

Modem.prototype.save = function(n){
  return this.write('AT&W');
};

Modem.prototype.factory = function() {
  return this.write('AT&F');
};

module.exports = Modem;
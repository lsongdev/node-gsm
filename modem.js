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
  
  if(typeof(options)!='object')options={
	port: options
  };
  this.port = new SerialPort(options.port, { 
    autoOpen: false,
    baudrate: options.baudrate || 115200
  });
  this.port.on('data', function(buf){
    console.log(buf.toString());
  });
}

util.inherits(Modem, EventEmitter);

/**
 * [open description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
Modem.prototype.open = function(){
  var self = this;
  this.port.open(function(err){
    console.log('open');
    self.command(commands.AT);
    // self.command(commands.ATZ);
    // self.echo(!true);
    // self.mode();
    // self.command(commands.ATQ, 0);
    // self.command(commands.GMR);
    // self.command('AT+CSCS?');
    setTimeout(function(){
      self.command(commands.CMGR);
    }, 5000);
  });
};
/**
 * [command description]
 * @param  {[type]} command [description]
 * @return {[type]}         [description]
 *
 * TEST: AT+CXXX=?
 * QUERY: AT+CXXX?
 * SET: AT+CXXX=<...>,[<...>]
 * EXEC: AT+CXXX
 * 
 */
Modem.prototype.command = function(command){
  var args = arguments;
  command = command.replace(/\{(\d+)}/g, function(_, n){
    return args[ +n + 1 ];
  });
  this.port.write(command + commands.CR);
};

Modem.prototype.echo = function(echo){
  echo = echo || false;
  return this.command(commands.ATE, +echo);
};

Modem.prototype.mode = function(mode){
  mode = mode || false;
  return this.command(commands.CMGF, +mode);
};

Modem.prototype.send =
Modem.prototype.sendSMS = function(message, callback){
  if(!(message instanceof PDU)) 
    message = new PDU(message);

  var str = message.toString();
  this.command(commands.SMS_SEND, str);
};

Modem.prototype.getSMS = function(index, callback){

};

Modem.prototype.delSMS = function(index, callback){

};

Modem.prototype.getSignalStrength = function(callback){
  this.command(commands.CSQ, function(res){
    callback(res.value);
  })
};

module.exports = Modem;

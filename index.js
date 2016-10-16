"use strict";

const util         = require('util');
const EventEmitter = require('events');
const PDU          = require('./pdu');
const commands     = require('./commands');

function Modem(options){
  if(!(this instanceof Modem))
    return new Modem(options);

  EventEmitter.call(this);
}

util.inherits(Modem, EventEmitter);


Modem.prototype.open = function(done){
  done(null);
};

Modem.prototype.close = function(done){
  done(null);
};

Modem.prototype.command = function(command, callback){

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
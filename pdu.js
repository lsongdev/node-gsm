
/**
 * [PDU description]
 * @wiki https://en.wikipedia.org/wiki/GSM_03.40
 */
function PDU(){
  this.smsc = '';
  this.smsc_type = SMSC_TYPE.INTL;
};

/**
 * [TPDU_TYPES description]
 * @type {Object}
 * @wiki https://en.wikipedia.org/wiki/GSM_03.40#TPDU_Types
 */
PDU.TPDU_TYPES = {
  DELIVER_REPORT: 0,
  DELIVER       : 0,
  SUBMIT        : 1,
  SUBMIT_REPORT : 1,
  COMMAND       : 2,
  STATUS_REPORT : 2,
  ANY           : 3
};

PDU.prototype.toString = function(){
  // smsc-length
  // smsc-type
  // smsc -> parity-swap
  // sender-length
  // sender-type
  // sender
  // TP-PID
  // TP-DCS
  // TP-SCTS
  // TP-UDL
  // TP-UD
};

/**
 * [swapNibbles description]
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
PDU.swapNibbles = function(x){
  return ((x & 0x0f) << 4) | ((x & 0xf0) >> 4);
};

PDU.parse =
PDU.decode = function(str){
  
};

PDU.encode = function(message, encoding){
  switch(encoding){
    
  };
};

module.exports = PDU;
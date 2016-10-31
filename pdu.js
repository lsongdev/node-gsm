
/**
 * [PDU description]
 * @wiki https://en.wikipedia.org/wiki/GSM_03.40
 *
 * | SCA | PDU-TYPE | MR | DA | PID | DCS | VP | UDL | UD |
 *
 */
function PDU(){
  // PDU-TYPE
  this.type = 0;
  // SCA
  this.smsc = '';
  this.smsc_type = 0;
  // MR
  this.id = 0;
  // DA
  this.destination = '';
  this.description_type = 0;
  // PID
  this.pid = PDU.PID.DEFAULT;
  // DCS
  this.encoding = PDU.DCS.BIT7;
  // VP
  this.period = 173;
  // UD
  this.content = '';
  
};

/**
 * [TPDU_TYPES description]
 * @type {Object}
 * @wiki https://en.wikipedia.org/wiki/GSM_03.40#TPDU_Types
 */
PDU.TYPES = {
  DELIVER_REPORT: 0,
  DELIVER       : 0,
  SUBMIT        : 1,
  SUBMIT_REPORT : 1,
  COMMAND       : 2,
  STATUS_REPORT : 2,
  ANY           : 3
};

/**
 * [DCS description]
 * @type {Object}
 * @wiki https://en.wikipedia.org/wiki/Data_Coding_Scheme
 */
PDU.DCS = {
  BIT7: 0x00
  BIT8: 0x01,
  UCS2: 0x02
};

/**
 * [PID description]
 * @type {Object}
 * @wiki https://en.wikipedia.org/wiki/GSM_03.40#Protocol_Identifier
 */
PDU.PID = {
  DEFAULT: 0X00
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

/**
 * [parse description]
 * @type {[type]}
 */
PDU.parse =
PDU.decode = function(str){
  
};

/**
 * [encode description]
 * @param  {[type]} message  [description]
 * @param  {[type]} encoding [description]
 * @return {[type]}          [description]
 */
PDU.encode = function(message, encoding){
  switch(encoding){
    
  };
};

module.exports = PDU;
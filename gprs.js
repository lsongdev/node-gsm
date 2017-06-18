
function GPRS(modem, options){
  this.modem = modem;
  this.options = options;
  return this;
}

GPRS.prototype.init = function*(){
  console.log(yield this.modem.set('CGREG', 2));
  console.log(yield this.modem.test('CGREG'));
};

GPRS.Request = function(options){

};

GPRS.Response = function(){

};

GPRS.prototype.request = function(options){
  const request = new GPRS.Request(options);
  const response = new Response(this.send(request));
  this.emit('response', response);
  return request;
};

module.exports = GPRS;
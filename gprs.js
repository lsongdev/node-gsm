
function GPRS(modem, options){
  this.device = modem;
  this.options = options;
  return this;
}

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
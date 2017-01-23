const assert = require('assert');
const PDU    = require('../pdu');

describe('PDU', function(){
  
  it('#encode', function(){
    var message = PDU.generate({
      text:'Some text',
      receiver:999999999999, //MSISDN
      encoding:'16bit' //Or 7bit if you're sending an ascii message.
    });
    assert.equal('002100aN810008120053006f006d006500200074006500780074', message[0]);
  });
  
  it('#decode', function(){
    var message = PDU.parse('06918919015000240C9189194238148900003110211052254117CAB03D3C1FCBD3703AA81D5E97E7A079D93D2FBB00');
    assert.equal(message.sender, '989124834198');
  })
  
});
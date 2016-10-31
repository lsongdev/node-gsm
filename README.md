## gsm2 ![NPM version](https://img.shields.io/npm/v/gsm2.svg?style=flat)

gsm modem module for node.js

### Installation

```bash
$ npm i gsm2
```

### Example


```js
const gsm     = require('gsm2');
const Message = require('gsm2/pdu');

const modem = new gsm.Modem('/dev/gsm-modem');

modem.open(function(err){

  modem.on('message', function(message){
    console.log('gsm modem received sms message',message);
  });


  modem.on('ring', function(number){
    cnsole.log('gsm modem have a phone call from %s', number);
  });

  var message = new Message('+8618510100102', 'Hello GSM Modem!');
  modem.sendSMS(message, function(err){
    console.log('gsm modem: message sent!');
  });

  modem.getSMS(function(err, messages){
    console.log(messages);
  });

  modem.delSMS(function(err){
    console.log('all messages was deleted');
  });
  
  modem.call('+8618510100102', function(err){
    //err: busy or hangup
  });

});
```

### API
check this file: `index.js`

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT license
Copyright (c) 2016 lsong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
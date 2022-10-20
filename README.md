## gsm2 ![NPM version](https://img.shields.io/npm/v/gsm2.svg?style=flat)

> GSM Modem module for Node.js

### Installation

```bash
$ npm i gsm2 --save
```

### Example

```js
import * as gsm from 'gsm2';

const modem = new gsm.Modem('/dev/gsm-modem');

modem.on('+CRING', console.log.bind('Ringing'))
modem.on('+CLIP', number => {
  console.log('Incoming Call', number);
})
modem.on('+CMTI', msg => {
  console.log('Incoming Message', msg);
});

modem.open(async () => {

  await modem.reset()
  await modem.sms_mode(1)
  await modem.sms_send(
    '+8618510100102',
    'This is a test from gsm2'
  );

});
```

![sim900](./sim900.jpg)

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

const Modem = require('./modem');

class SMS extends Modem {
  sms_center() {
    return this.test('CSCA');
  }
  sms_mode(mode) {
    return this.set('CMGF', mode || 0);
  }
  sms_list(mode) {
    return this.get('CMGL').then(str => {
      return /\((.+)\)/.exec(str)[1]
        .split(',')
        .map(s => s.replace(/["']/g, ''));
    }).then(modes => {
      return this.set('CMGL', modes[mode || 0]);
    });
  }
  sms_read(index) {
    return this.set('CMGR', index);
  }
  sms_send(number, content) {
    // temporary disable retry.
    return this.set('CMGS', `"${number}"`, { retry: 0 }).then(x => {
      return this.send(content + '\u001a');
    });
  }
  sms_delete(index) {
    return this.set('CMGD', index);
  }
}

module.exports = SMS;
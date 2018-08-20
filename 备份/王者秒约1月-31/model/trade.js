const AV = require('../utils/av-live-query-weapp-min');

class Trade extends AV.Object {
  
  get content() { return this.get('content'); }
  set content(value) { this.set('content', value); }
  
  get title() { return this.get('title'); }
  set title(value) { this.set('title', value); }

  get amount() { return this.get('amount'); }
  set amount(value) { this.set('amount', value); }

  get images() { return this.get('images'); }
  set images(value) { this.set('images', value); }

  get bond() { return this.get('bond'); }
  set bond(value) { this.set('bond', value); }
}

AV.Object.register(Trade, 'Trade');
module.exports = Trade;
const AV = require('../utils/av-live-query-weapp-min');

class Goods extends AV.Object {  

  get title() { return this.get('title'); }
  set title(value) { this.set('title', value); }

  get summary() { return this.get('summary'); }
  set summary(value) { this.set('summary', value); }


  get content() { return this.get('content'); }
  set content(value) { this.set('content', value); }

  get price() { return this.get('price'); }
  set price(value) { this.set('price', value); }

  get images() { return this.get('images'); }
  set images(value) { this.set('images', value); }

  // get targetUser() { return this.get('targetUser'); }
  // set targetUser(value) { this.set('targetUser', value); }


}

AV.Object.register(Goods, 'Goods');
module.exports = Goods;
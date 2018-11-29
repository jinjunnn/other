const AV = require('../utils/av-live-query-weapp-min');

class Item extends AV.Object {
  get name() { return this.get('name'); }
  set name(value) { this.set('name', value); }
  
  get amount() { return this.get('amount'); }
  set amount(value) { this.set('amount', value); }
  
  get subname() { return this.get('subname'); }
  set subname(value) { this.set('subname', value); }
  
  get images1() { return this.get('images1'); }
  set images1(value) { this.set('images1', value); }
  
  get images2() { return this.get('images2'); }
  set images2(value) { this.set('images2', value); }
  
  get images3() { return this.get('images3'); }
  set images3(value) { this.set('images3', value); }
  
  get content() { return this.get('content'); }
  set content(value) { this.set('content', value); }

  get price1() { return this.get('price1'); }
  set price1(value) { this.set('price1', value); }

  get price2() { return this.get('price2'); }
  set price2(value) { this.set('price2', value); }

  get brand() { return this.get('brand'); }
  set brand(value) { this.set('brand', value); }
} 
AV.Object.register(Item);

module.exports = Item;
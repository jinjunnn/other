const AV = require('../utils/av-live-query-weapp-min');

class Article extends AV.Object {

  get address() { return this.get('address'); }
  set address(value) { this.set('address', value); }
  
  get why() { return this.get('why'); }
  set why(value) { this.set('why', value); }
  
  get geo() { return this.get('geo'); }
  set geo(value) { this.set('geo', value); }
  
  get opentime() { return this.get('opentime'); }
  set opentime(value) { this.set('opentime', value); }
  
  get targetTopic() { return this.get('targetTopic'); }
  set targetTopic(value) { this.set('targetTopic', value); }
  
  get likes() { return this.get('likes'); }
  set likes(value) { this.set('likes', value); }
  
  get title() { return this.get('title'); }
  set title(value) { this.set('title', value); }

  get author() { return this.get('author'); }
  set author(value) { this.set('author', value); }

  get summary() { return this.get('summary'); }
  set summary(value) { this.set('summary', value); }

  get cell() { return this.get('cell'); }
  set cell(value) { this.set('cell', value); }

  get what() { return this.get('what'); }
  set what(value) { this.set('what', value); }

  get images() { return this.get('images'); }
  set images(value) { this.set('images', value); }

  // get targetUser() { return this.get('targetUser'); }
  // set targetUser(value) { this.set('targetUser', value); }


}

AV.Object.register(Article, 'Article');
module.exports = Article;
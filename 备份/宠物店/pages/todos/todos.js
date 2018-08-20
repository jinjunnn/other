const AV = require('../../utils/av-live-query-weapp-min');
const Todo = require('../../model/todo');
const bind = require('../../utils/live-query-binding');

Page({
  data: {
    image:'http://ac-gr0ynkgr.clouddn.com/88bd4a64fca2e443ae87.png',
    imgUrls: [
    {
      img:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      text:'香薰精油SPA',
    },
    {
      img:'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      text: '死海盐浴SPA',
    },
    {
      img:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      text:'香薰精油SPA',
    },
    {
      img:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      text:'日本碳酸浴SPA',
    },
    {
      img:'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      text:'宠物洗澡',
    },
    {
      img:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      text:'宠物美容',
    },
    ]

  },

  login: function() {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp());
  },

  fetchTodos: function (user) {

  },
  default(){
    console.log("133")

  },
  onReady: function() {
    this.login().then(this.fetchTodos)
  },

  onUnload: function() {

  },


});
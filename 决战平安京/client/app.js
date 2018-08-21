const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var message = '等你等的人家好辛苦!'

AV.init({
  appId: 'mzynJe5f1W3mtVBuLP2d8sUd-gzGzoHsz',
  appKey: '68uev3gMXwwTVlRzslYJmRQf',
});

  const realtime = new Realtime({
 appId: 'mzynJe5f1W3mtVBuLP2d8sUd-gzGzoHsz',
 appKey: '68uev3gMXwwTVlRzslYJmRQf',
 region: 'cn', 
 noBinary: true,
});

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
        
  },
  onHide: function () {
        var that = this;
        that.liveQueryOrders()
        wx.setTopBarText({
            text: message,
        })
  },

  liveQueryOrders: function () {
    const query = new AV.Query('PlayOrder')
          query.equalTo('targetSeller', AV.Object.createWithoutData('_User', AV.User.current().id))
          query.find()
          query.subscribe().then(function(liveQuery) {
            liveQuery.on('create', function(amendMessage) {
              message = '您新订单，赶紧上车吧！'
        wx.setTopBarText({
            text: message,
        })
            });
          });
  },
  onShow: function () {
    this.login()
    this.getUserInfo()
  },
  amendMessage(){
  },
  login: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp());
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  realtime: realtime,
  globalData: {
    userInfo: null,
  }
})

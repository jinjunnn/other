const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');

AV.init({
  appId: 'JDCDYqroJ8jtvTt4bOCwOI0s-gzGzoHsz',
  appKey: 'PV4UOG8hvGAKn9a0LQjtkwr9',
});

const realtime = new Realtime({
 appId: 'JDCDYqroJ8jtvTt4bOCwOI0s-gzGzoHsz',
 appKey: 'PV4UOG8hvGAKn9a0LQjtkwr9',
 region: 'cn', 
 noBinary: true,
});

App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
        
  },
  onHide: function () {

  },

  onShow: function (options) {
    this.login()

    this.setConfi()
    if (options.referrerInfo) {
        this.setAppId(options.referrerInfo.appId)
    }
  },
  setAppId(appid){
      var query = new AV.Query('AppId');
      query.equalTo('appId', appid);
      query.find().then(function (results) {
          if (results.length) {
                var todo = AV.Object.createWithoutData('AppId',results[0].id);
                todo.increment('times',1);
                todo.save();
          } else {
                var AppId = AV.Object.extend('AppId');
                var appId = new AppId();
                appId.set('times',1);
                appId.set('appId',appid);
                appId.save()
          }
      }, function (error) {
      });
  },
  setConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a6492c61b69e60066f379a7').then(function (confi) {
        that.globalData.confi = confi.attributes

    }, function (error) {
      console.log(error.message)
    }).catch(error => console.error(error.message));
  },

  login: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp()
    ).then(()=>{
        this.getUserInfo()
    });
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
              var nickName = res.userInfo.nickName;
              var avatarUrl = res.userInfo.avatarUrl;
              var city = res.userInfo.city;
              var gender = res.userInfo.gender;
              var province = res.userInfo.province;
              const user = AV.User.current();
              user.set('username', nickName);
              user.set('userImage',avatarUrl);
              user.set('city', city);
              user.set('province',province);
              user.set('gender',gender);      
              user.save().catch(error => console.error(error.message));
        }
      })
    }
  },
  realtime: realtime,
  globalData: {
    userInfo: null,
    confi:null,
  }
})

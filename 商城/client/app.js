const AV = require('./utils/av-live-query-weapp-min');

AV.init({
  appId: 'gR0ynkgR92k5R3utvCRcnTCR-gzGzoHsz',
  appKey: 'e4Iu2fSAjdUeJJ3lCKdMKmm0',
});

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
        
  },
  onHide: function () {

  },

  onShow: function () {
    this.login()
    this.getUserInfo()
    this.setConfi()
  },

  setConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a7e93fd17d00900350e404d').then(function (confi) {
         that.globalData.confi = confi.attributes
    }, function (error) {
      // 异常处理
    });
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
              user.save();
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    confi:null,
  }
})
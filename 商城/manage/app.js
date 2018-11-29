const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;

AV.init({
  appId: 'gR0ynkgR92k5R3utvCRcnTCR-gzGzoHsz',
  appKey: 'e4Iu2fSAjdUeJJ3lCKdMKmm0',
});

  const realtime = new Realtime({
 appId: 'gR0ynkgR92k5R3utvCRcnTCR-gzGzoHsz',
 appKey: 'e4Iu2fSAjdUeJJ3lCKdMKmm0',
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

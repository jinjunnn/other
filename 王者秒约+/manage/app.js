const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;

AV.init({
  appId: 'IGXFL8L08BMSNVGLyGhWr74I-gzGzoHsz',
  appKey: '1WXRohpBow8IhMYlRWUQbqe0',
  masterKey:'e7YCFNPESmWVH6pS4HiUlL4q',
});

  const realtime = new Realtime({
 appId: 'IGXFL8L08BMSNVGLyGhWr74I-gzGzoHsz',
 appKey: '1WXRohpBow8IhMYlRWUQbqe0',
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

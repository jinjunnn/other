const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var referrerInfo = {};

AV.init({
  appId: 'WekN4hEaRUx0bLwhjdWqBIY8-gzGzoHsz',
  appKey: '0NT62qkoVPWSW5BKHyKVEvc1',
});

const realtime = new Realtime({
 appId: 'WekN4hEaRUx0bLwhjdWqBIY8-gzGzoHsz',
 appKey: '0NT62qkoVPWSW5BKHyKVEvc1',
 region: 'cn', 
 noBinary: true,
});

App({
  onLaunch: function (options) {
    console.log(options)
  },
  onHide: function () {

  },

  onShow: function () {
    this.login()
  },

  //获取并记录用户来源
  getUserSource(){

  },

  //设置配置信息
  setConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a6492c61b69e60066f379a7').then(function (confi) {
         that.globalData.confi = confi.attributes
    }, function (error) {
      // 异常处理
    });
  },
  //初始化应用后，登录，如果用户没有注册过，则返回没有没有授权，app.hasLogin用户维护用户的登录状态。
  login: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {

          console.log('用户没有授权')
        } else {
          wx.showToast({
            title: '授权登录中',
            icon: 'loading',
            duration: 5000
          })
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              var code = res.code
              console.log(code)
              wx.getUserInfo({
                withCredentials: true,
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  var paramsJson = {
                    code: code,
                    res: res,
                  }
                  AV.Cloud.run('wxLogin', paramsJson).then(function (data) {

                    AV.User.loginWithAuthDataAndUnionId({
                      uid: data.openid,
                      access_token: data.token,
                    }, 'weapp_old', data.unionid, {
                      unionIdPlatform: 'weixin', // 指定为 weixin 即可通过 unionid 与其他 weixin 平台的帐号打通
                      asMainAccount: false,
                    }).then(function (usr) {

                      that.globalData.userInfo = res.userInfo
                      typeof cb == "function" && cb(that.globalData.userInfo)

                      var nickName = res.userInfo.nickName;
                      var avatarUrl = res.userInfo.avatarUrl;
                      var city = res.userInfo.city;
                      var gender = res.userInfo.gender;
                      var province = res.userInfo.province;

                      var user = AV.Object.createWithoutData('_User', AV.User.current().id);
                      user.set('userName', nickName);
                      user.set('userImage', avatarUrl);
                      user.set('city', city);
                      user.set('province', province);
                      user.set('gender', gender);
                      user.save().then(()=>{
                      that.globalData.hasLogin = true;
                      console.log('用户已登录')
                      }).catch(console.error);
                    }).catch(console.error);
                  }).catch(console.error);
                },
                fail: res => {
                  wx.showLoading({
                    title: '未登录',
                    mask: true,
                  })
                }
              })
            }
          });
        }
      }
    })
  },
  
  realtime: realtime,
  globalData: {
    userInfo: null,
    confi:null,
    hasLogin: false,
  }
})

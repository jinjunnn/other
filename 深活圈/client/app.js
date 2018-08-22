const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var id = 0;
var referrerInfos = {};

AV.init({
  appId: 'ipT6wRgGldHFJhxbhw4WucEM-gzGzoHsz',
  appKey: 'SBxxWirNtNjrHpCvcnIB8ka2',
});


App({
  onLaunch: function (options) {


  },
  onHide: function () {

  },

  onShow: function (options) {
    this.login()
    this.getSettings('5b7aae359f54540031b18cb1')

  },

  getSettings(i){
    var that = this;
    var query = new AV.Query('Setting');
    query.get(i).then(function (settings) {
         console.log(settings)
         that.globalData.settings = settings.attributes;

    }, function (error) {
      // 异常处理
    });
  },

  login: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
            
            console.log('用户没有授权')
        } else{
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
                      console.log(paramsJson)
                      AV.Cloud.run('wxLogin', paramsJson).then(function (data) {

                        AV.User.loginWithAuthDataAndUnionId({
                          uid: data.openid,
                          access_token: data.token,
                        }, 'weapp_shenhuoquan', data.unionid, {
                          unionIdPlatform: 'weixin', // 指定为 weixin 即可通过 unionid 与其他 weixin 平台的帐号打通
                          asMainAccount: false,
                        }).then(function (usr) {

                          that.globalData.userInfo = res.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)

                           const user = AV.User.current();
                           user.set('wxname', res.userInfo.nickName);
                           user.set('userImage', res.userInfo.avatarUrl);
                           user.set('city', res.userInfo.city);
                           user.set('province', res.userInfo.province);
                           user.save().then(() => {
                                
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
  globalData: {
    userInfo: null,
    settings:null,
    hasLogin: false,
  }
})

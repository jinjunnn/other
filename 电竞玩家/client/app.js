const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var id = 0;
var referrerInfos = {};

AV.init({
  appId: 'XFs1iY3eY9dVbuEx08tdhF9w-gzGzoHsz',
  appKey: 'sCc9dE1vu3CRqTCBV8ei4b4m',
});

const realtime = new Realtime({
  appId: 'XFs1iY3eY9dVbuEx08tdhF9w-gzGzoHsz',
  appKey: 'sCc9dE1vu3CRqTCBV8ei4b4m',
  region: 'cn',
  noBinary: true,
});

App({
  onLaunch: function (options) {

  },
  onHide: function () {

  },

  onShow: function (options) {
        wx.checkSession({
          success() {
          },
          fail() {
               this.login();
          }
        });
        this.setConfi()
  },
  setConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a6492c61b69e60066f379a7').then(function (confi) {
         that.globalData.confi = confi.attributes
    }, function (error) {
      // 异常处理
    });
  },
  login: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
            //用户没有授权，所以先到登录页面进行授权登录。放在这里存在的问题是，参数objectId没有传到lottery/detail页面
            // wx.navigateTo({
            //   url: '/pages/user/login/login'
            // })
            console.log('用户没有授权')
        } else {
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId unionId
              var code = res.code
              console.log(code)
              wx.getUserInfo({
                withCredentials: true,
                success: res => {
                  var paramsJson = {
                    code: code,
                    res: res,
                  }
                  console.log(paramsJson)
                  AV.Cloud.run('wxLogin', paramsJson).then(function (data) {
                    console.log(data);
                    AV.User.loginWithAuthDataAndUnionId({
                            access_token: data.token,
                            expires_in: 7200,
                            refresh_token: data.token,
                            openid: data.openid,
                    }, 'weapp_wanjia', data.unionid, {
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

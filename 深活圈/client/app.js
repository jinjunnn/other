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

  },

  // setConfi(){
  //   var that = this;
  //   var query = new AV.Query('Confi');
  //   query.get('5a6492c61b69e60066f379a7').then(function (confi) {
  //        that.globalData.confi = confi.attributes
  //   }, function (error) {
  //     // 异常处理
  //   });
  // },

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
                        console.log('data=')
                        console.log(data)
                        console.log(data.openid)
                        console.log(data.unionid)
                        console.log(data.token)
                        AV.User.loginWithAuthDataAndUnionId({
                          uid: data.openid,
                          access_token: data.token,
                        }, 'weapp_shenhuoquan', data.unionid, {
                          unionIdPlatform: 'weixin', // 指定为 weixin 即可通过 unionid 与其他 weixin 平台的帐号打通
                          asMainAccount: false,
                        }).then(function (usr) {
                          console.log("我是user=")
                          console.log(usr)
                          console.log(res.userInfo)
                          that.globalData.userInfo = res.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)
                          var nickName = res.nickName;
                          var avatarUrl = res.avatarUrl;
                          var city = res.city;
                          var gender = res.gender;
                          var province = res.province;
                          const user = AV.User.current();
                          user.set('username', nickName);
                          user.set('userImage', avatarUrl);
                          user.set('city', city);
                          user.set('province', province);
                          user.set('gender', gender);
                          user.save().then(()=>{
                            that.globalData.hasLogin = true;
                            that.update()
                          });
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
    confi:null,
    hasLogin: false,
  }
})

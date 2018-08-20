var app = getApp()
const {User} = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');
const AV = require('../../../utils/av-live-query-weapp-min');

Page({
  onLoad: function () {
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
  },
  data: {},
  login: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {

          console.log('用户没有授权')
        } else {
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              that.setData({hasLogin : true})
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
                      app.globalData.userInfo = res.userInfo
                      typeof cb == "function" && cb(app.globalData.userInfo)
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
                      user.save().then(() => {
                        app.globalData.hasLogin = true
                        console.log('修改了登录状态为' + app.globalData.hasLogin)
                        wx.navigateBack({
                          delta: 1
                        })
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
  }
})

const {
  User
} = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');
const AV = require('../../../utils/av-live-query-weapp-min');
var app = getApp()

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
          wx.showToast({
            title: '授权登录中',
            icon: 'loading',
            duration: 5000
          })
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              that.setData({
                hasLogin: true
              })
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

                      app.globalData.userInfo = res.userInfo
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
                      user.save().then(() => {
                      app.globalData.hasLogin = true;
                      wx.hideToast()
                      
                      console.log('修改了登录状态为' + app.globalData.hasLogin)
                      wx.navigateBack({
                        delta: 1
                      })
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
  }
})
const { User } = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
const AV = require('../../utils/av-live-query-weapp-min');

var app = getApp()

Page({
  data: {
  },
  onLoad: function() {
    console.log(app.globalData.settings)
    console.log(AV.User.current())
    this.setData({
      settings: app.globalData.settings,
      user: AV.User.current(),

    })
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: './login/login'
      })
    }
  },
  onShow: function () {

  },




  //用户点击授权用户信息页面，授权成功，调用lean注册和登录接口进行登录；授权失败
  onGotUserInfo(e){
    console.log(123)
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

      wx.getSetting({
        success: (res) => {
          
            res.authSetting = {
              "scope.userInfo": true,
              "scope.userLocation": true
            }

        }
      })
  },

  bindHappy(){
        wx.showModal({
          title: '福气值',
          content: '您好，福气值满3480可以兑换348元点券充值一次。',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
  },
  
  bindWealth(){
        wx.showModal({
          title: '财气值',
          content: '您好，每周五的免费抽奖活动中，拥有高财气值的用户可以更容易获得皮肤奖励。',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
  },

  bindSocial(){
        wx.showModal({
          title: '社交值',
          content: '您好，每周六的免费抽奖活动中，拥有高财气值的用户可以更容易获得皮肤奖励。社交值暂未启用，我们的工程师正在紧急开发中。',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
  }

});
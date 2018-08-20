const { User } = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
const AV = require('../../utils/av-live-query-weapp-min');

var app = getApp()

Page({
  data: {
  },
  onLoad: function() {

  },
  onShow: function () {
    common.querySetting( '用户中心','登录用户中心需要获取您的用户名作为登录名。')
    var that = this;
    var query = new AV.Query('_User');
    query.get(User.current().id).then(function (user) {
          that.setData({
            user
          })
    }, function (error) {
      // 异常处理
    });
  },
  setting(){
		wx.openSetting({
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
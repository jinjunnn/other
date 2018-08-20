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
});
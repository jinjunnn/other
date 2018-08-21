const { User } = require('../../utils/av-live-query-weapp-min');
var app = getApp()

Page({
  data: {
  },
  onLoad: function() {
    this.setData({
      user: User.current(),
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
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
const { User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');
var app = getApp();
Page({

  data: {
  
  },

  onLoad: function (options) {
      var that = this;

  },
  login: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp());
  },
  onReady: function () {
    // this.login()
  },

  onShow: function () {

  },

  //这段代码是云引擎操作数据库批量修改数据。
  newId(){
        var paramsJson = {
          id: 100000,
          cl: 'Withdraw'
        };
        AV.Cloud.run('addUserId', paramsJson).then(function(data) {
          console.log(data)
        }, function(err) {
          console.log(data)
        });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
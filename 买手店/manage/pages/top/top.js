const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
Page({

  data: {
  
  },

  onLoad: function (options) {
      var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      console.log(userInfo)
      var nickName = userInfo.nickName;
      var avatarUrl = userInfo.avatarUrl;
      var gender = userInfo.gender;
      var province = userInfo.province;
      var city = userInfo.city;
      const user = AV.User.current();
      // console.log(user)
      user.set('username', nickName);
      user.set('userImage',avatarUrl);
      user.set('gender',gender);
      user.set('province',province);
      user.set('city',city);
      // 保存到云端
      user.save();
    })
  },
  login: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp());
  },
  onReady: function () {
    this.login()
  },

  onShow: function () {

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
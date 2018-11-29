// pages/user/coins/coins.js
const AV = require('../../../utils/av-live-query-weapp-min');
var that = this;
var coins;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var query = new AV.Query('Intergal');
    query.descending('updatedAt');
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    query.equalTo('targetUser', user);
    query.find().then(coinslist => this.setData({
      coinslist
    })).catch(console.error);

  },

  onReady: function () {

  var that = this;


  var query = new AV.Query('_User');
  query.get(AV.User.current().id).then(function (results) {
    that.setData({
      coins:results
    })
  }, function (error) {
    // 异常处理
    console.error(error);
  });
  },

  /**
   * 生命周期函数--监听页面显示
   */
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

  onShareAppMessage: function () {
    return {
      title: '积分可以兑皮肤啦，赶快转发给好友赚取皮肤吧',
      path: '/pages/index/index',
      imageUrl:'https://dn-WekN4hEa.qbox.me/ecd3ebfb2aa6a9bda088.jpeg',
      success: function(res) {
          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res){
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var paramsJson = {
                  user:AV.User.current().id,
                  encryptedData: encryptedData,
                  iv: iv,
                  sessionKey:User.current().attributes.authData.lc_weapp.session_key,
                  }
              Cloud.run('groupId' ,paramsJson)
            }
          })
      }
    }
  }
})
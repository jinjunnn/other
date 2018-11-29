// pages/goods/goods.js
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
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
    common.querySetting( '提醒','需获取您用户基础权限。')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({ title: '大神团'});
          var that = this;
          var query = new AV.Query('Team');
          query.equalTo('display', true);
          query.descending('createdAt');
          query.limit(100);
          query.find().then(teams => this.setData({
            teams
          })).catch(console.error);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  }
})
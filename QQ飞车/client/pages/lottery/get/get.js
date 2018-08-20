const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');

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
      var query = new AV.Query('LotteryGet');
      var user = AV.Object.createWithoutData('Lottery', options.objectId);
      query.equalTo('targetLottery', user);
      query.include('targetUser');
      query.descending('updatedAt')
      query.find()
            .then(comment => this.setData({ 
                   comment: comment.map(commentItem => Object.assign(commentItem.toJSON(), {
                   updatedAt: commentItem.updatedAt.toLocaleString(),
                   }))
            }))
           .catch(console.error);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      common.querySetting( '中奖提醒','我们需获取您用户基础权限。')
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
  onShareAppMessage: function () {
  
  }
})
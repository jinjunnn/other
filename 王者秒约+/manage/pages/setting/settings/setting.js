const AV = require('../../../utils/av-live-query-weapp-min');
var common = require('../../../model/common');
const Order = require('../../../model/order');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');

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
        wx.setNavigationBarTitle({
        title: '系统配置'
      })
  },
  switch1Change: function (e){
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
      var todo = AV.Object.createWithoutData('Confi', '5a6492c61b69e60066f379a7');
      todo.set('lotteryDisplay', e.detail.value);
      todo.save();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
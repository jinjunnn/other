const AV = require('../../../../utils/av-live-query-weapp-min');
const { User } = require('../../../../utils/av-live-query-weapp-min');
const common = require('../../../../model/common');
var app = getApp();
var objectId;
var mode;

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
          var that = this;
         var query = new AV.Query('Master');
          var user = AV.Object.createWithoutData('_User', User.current().id);
          query.equalTo('targetUser', user);
          query.find().then(function (master) {
              that.setData({
                master: master[0],
                customQRCode: app.globalData.confi.custom.QRCode
              })
          }, function (error) {
          });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  submitTapNavToProfile(){
    wx.navigateTo({
        url: '../../../index/detail/detail?objectId='+this.data.master.id
    })

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
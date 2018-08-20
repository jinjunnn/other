// pages/user/feedback/feedback.js
const AV = require('../../../utils/av-live-query-weapp-min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  value:'',
  phoneNumber:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  updateValue({
    detail: {
      value
    }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      value: value
    });
  },
  updateMobilePhoneNumber({
    detail: {
      value
    }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      phoneNumber: value
    });
  },
  bindSubmit() {
  // 声明类型
  var that = this;
  var Feedback = AV.Object.extend('Feedback');
  var business = new Feedback();
  business.set('business',that.data.value);
  business.set('phoneNumber', that.data.phoneNumber)
  business.set('targetUser',AV.User.current());
  business.save().then(function (todo) {
    console.log('objectId is ' + that.data.value + todo.id);
  }, function (error) {
    console.error(error);
  });
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
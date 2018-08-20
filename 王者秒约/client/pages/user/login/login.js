const { User } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');
const AV = require('../../../utils/av-live-query-weapp-min');

var app = getApp();
var returnurl;
var method;

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
    
    returnurl = options.returnurl
    method = options.method
    console.log(method)
    console.log(returnurl)
  },
  onGotUserInfo: function(e) {
    console.log('我是')
    console.log(e.detail.iv)
    if (e.detail.iv) {
          wx.showLoading({
          title: '登录中',
        })
        app.getUserInfo()
        setTimeout(function(){
          wx.hideLoading()
        },2000)
           if (method == 1) {
                  wx.switchTab({
                    url: returnurl
                  }) 
           } else {
                  wx.redirectTo({
                    url: returnurl
                  }) 
           }
  
    } else {

    }

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
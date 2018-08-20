const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();


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
           this.setConfi('5a6492c61b69e60066f379a7')
  
  },

  setConfi(objectId){
    var that = this;
    var query = new AV.Query('Confi');
    query.get(objectId).then(function (confi) {
         that.setData({
          confi:confi.attributes,
        })
    }, function (error) {
      // 异常处理
    });
  },

  //职业代练
  bindShangfen(){
    wx.navigateToMiniProgram({
      appId: "wxc7569f6191eed045",
      path: "/pages/index/dailian/dailian",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })

  },

  //普通陪玩
  bindPeiwan(){
    wx.navigateToMiniProgram({
      appId: "wxc7569f6191eed045",
      path: "pages/index/index",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })

  },

  //皮肤销售
  bindPifu(){
    wx.navigateToMiniProgram({
      appId: "wx4996164e74b59c5c",
      path: "pages/index/index",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })
  },

  //账号交易
  bindZhanghao(){
    wx.navigateToMiniProgram({
      appId: "wx4af5627b21d7b379",
      path: "pages/trade/trade",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })
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
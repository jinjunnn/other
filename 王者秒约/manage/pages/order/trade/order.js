

const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  queryOrder(){
    var query = new AV.Query('TradeRecord');
    query.descending('createdAt');
    query.equalTo('status', false);
    query.include('targetUser');
    query.include('targetTrade');
    query.include('targetSeller');
    query.find().then(order => this.setData({
      order
    })).catch(console.error);
  },
  // bindSubmit(event){
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否支付完成，准备取消订单？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         console.log(event.currentTarget.dataset.user)
  //         var bill = AV.Object.createWithoutData('TradeRecord', event.currentTarget.dataset.user);
  //         bill.set('status', true)
  //         bill.save();
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },

  bindCopyCells(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.user,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            common.showTip('已复制')
          }
        })
      }
    })
  },
  bindCopyWeChatID(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.user,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            common.showTip('已复制')
          }
        })
      }
    })
  },

  onLoad: function (options) {
  
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
      this.queryOrder()
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
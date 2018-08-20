const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  queryOrder(){
    var query = new AV.Query('ExpertOrder');
    query.descending('createdAt');
    query.equalTo('status', '已支付');
    query.include('targetBuyer');
    query.find().then(order => this.setData({
      order
    })).catch(console.error);
  },
  bindSubmit(event){
    wx.showModal({
      title: '提示',
      content: '确认完成订单？',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.user)
          var bill = AV.Object.createWithoutData('ExpertOrder', event.currentTarget.dataset.user);
          bill.set('status', '已完成')
          bill.save();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindConcel(event){
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.id)
          console.log(event.currentTarget.dataset.user)
          console.log(event.currentTarget.dataset.amount)
          var bill = AV.Object.createWithoutData('ExpertOrder', event.currentTarget.dataset.id);
          bill.set('status', '已退款')
          bill.save().then(()=>{
            common.addRecord('用户主动退款',event.currentTarget.dataset.amount,event.currentTarget.dataset.user)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

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
      wx.setNavigationBarTitle({
        title: '职业陪练订单'
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
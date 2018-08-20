const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  queryOrder(){
    var query = new AV.Query('TeamOrder');
    query.descending('createdAt');
    query.equalTo('status', false);
    query.include('targetUser');
    query.find().then(order => this.setData({
      order
    })).catch(console.error);
  },
  bindSubmit(event){
    wx.showModal({
      title: '提示',
      content: '订单已完成，确认订单。',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.user)
          var bill = AV.Object.createWithoutData('TeamOrder', event.currentTarget.dataset.user);
          bill.set('status', true)
          bill.save();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindConcel(event){
    console.log(event.currentTarget.dataset.amount)
    wx.showModal({
      title: '提示',
      content: '用户主动退款。',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.id)
          console.log(event.currentTarget.dataset.amount)
          console.log(event.currentTarget.dataset.user)
          var bill = AV.Object.createWithoutData('TeamOrder', event.currentTarget.dataset.id);
          bill.set('status', true)
          bill.save().then(() => {
              common.addRecord('用户主动退款',event.currentTarget.dataset.amount,event.currentTarget.dataset.user)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({
        title: '职业代练订单'
      })
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
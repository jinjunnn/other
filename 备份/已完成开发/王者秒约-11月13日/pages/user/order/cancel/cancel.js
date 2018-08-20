const AV = require('../../../../utils/av-live-query-weapp-min');
const common = require('../../../../model/common')
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
  this.setData({
    options
  })
  },

  bindSubmit(){
          var coins = Number(this.data.options.price) * Number(this.data.options.times)
          console.log(coins)
          this.amendStasus()
          this.amendCoins(coins)
          this.payRecord(coins)
              wx.navigateBack({
                delta: 1
              })
      
  },
  //修改PlayOrder表的购买状态
  amendStasus(){
          var bill = AV.Object.createWithoutData('PlayOrder', this.data.options.objectId);
          bill.set('status', '已取消');
          bill.set('bindFunction','已取消')
          bill.save();
  },
  //修改钱包金额字段
  amendCoins(coins){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('coins', coins);
          bill.increment('expenses', -coins);
          bill.save();
  },

    //Record表，新增交易记录明细
  payRecord(cost){          
          var Record = AV.Object.extend('Record');
          var updateCoins = new Record();
          updateCoins.set('payFor', '订单取消');
          updateCoins.set('amount',+cost);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {
          }, function (error) {
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
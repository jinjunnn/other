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

  //点击接单
  bindSubmit(event){

    var that = this;
    var bill = AV.Object.createWithoutData('PlayOrder', this.data.options.objectId);
    bill.set('status', '已接单');
    bill.save()
    //业务逻辑
    var amount = this.data.options.price * this.data.options.times;
    that.updateNumberOfOrder(this.data.options.masterid)
    that.payRecord(amount)
    that.amendCoins(amount)
    wx.navigateBack({
      delta: 1
    })    
  },
  //Master表增加接单次数
  updateNumberOfOrder(masterid){
    var numberOfOrder = AV.Object.createWithoutData('Master', masterid);
    numberOfOrder.increment('numberOfOrder', 1);
    numberOfOrder.fetchWhenSave(true);
    numberOfOrder.save();
  },

  //Record表增加一条交易记录

  payRecord(cost){          
          var Record = AV.Object.extend('Record');
          var updateCoins = new Record();
          updateCoins.set('payFor', '接单');
          updateCoins.set('amount',cost);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {
          }, function (error) {
          });
  },

  //修改钱包金额字段
  amendCoins(coins){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('coins', coins);
          bill.increment('incomes',coins)
          bill.save();
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
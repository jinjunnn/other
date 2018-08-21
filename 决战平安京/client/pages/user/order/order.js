// pages/user/order/order.js
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
Page({

  data: {
  
  },

  onLoad: function (options) {
          this.setData({
                      user:AV.User.current().id
                  })
  },
  onReady: function () {
          
  },

  //查询playorder表
  setPlayOrder(){
          var queryBuyer = new AV.Query('PlayOrder');
          queryBuyer.equalTo('targetBuyer', AV.Object.createWithoutData('_User', AV.User.current().id));
          var querySeller = new AV.Query('PlayOrder');
          querySeller.equalTo('targetSeller', AV.Object.createWithoutData('_User', AV.User.current().id));
          var query = AV.Query.or(queryBuyer, querySeller);
          query.include('targetSeller');
          query.include('targetSeller.targetUser');
          query.include('targetBuyer');
          query.include('targetBuyer.targetUser');
          query.descending('createdAt');
          query.find()
               .then(order => this.setData({ 
                   order: order.map(orderItem => Object.assign(orderItem.toJSON(), {
                   createdAt: orderItem.createdAt.toLocaleString(),
                   }))
               }))
  },
  //点击接单
  bindOrderConfirm(event){
    var that = this;
    var bill = AV.Object.createWithoutData('PlayOrder', event.currentTarget.dataset.id);
    bill.set('status', '已接单');
    bill.save()
    //业务逻辑
    var masterid = event.currentTarget.dataset.masterid;
    var amount = event.currentTarget.dataset.amount * event.currentTarget.dataset.times;
    that.updateNumberOfOrder(masterid)
    that.payRecord(amount)
    that.amendCoins(amount)
  },
  bindCopyName(event){
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setPlayOrder()
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
// pages/user/order/order.js
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
  
  },
  //查询playorder表
  setTrade(){
          var query = new AV.Query('Trade');
          query.equalTo('targetUser', AV.Object.createWithoutData('_User', AV.User.current().id));
          query.include('targetUser');
          query.descending('createdAt');
          query.find()
               .then(order => this.setData({ 
                   order: order.map(orderItem => Object.assign(orderItem.toJSON(), {
                   createdAt: orderItem.createdAt.toLocaleString(),
                   }))
               }))
  },
  bindDelete(event){

  },
  bindDownShop(event){
          var bill = AV.Object.createWithoutData('Trade', event.currentTarget.dataset.objectid);
          bill.set('status', 2);
          bill.save();
          this.setTrade()
  },
  bindUpShop(event){
          var bill = AV.Object.createWithoutData('Trade', event.currentTarget.dataset.objectid);
          bill.set('status', 1);
          bill.save();
          this.setTrade()
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
      this.setTrade()
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
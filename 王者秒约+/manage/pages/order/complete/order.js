const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');


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
  //云函数调用批量的发模板消息
  bindUpdateOrderStatus(lotteryNew,lottery){
        var that = this;
        var date = new Date(); 
        date.setDate(date.getDate()-2);
        console.log(date)
        var priorityQuery = new AV.Query('PlayOrder');
        priorityQuery.lessThanOrEqualTo('updatedAt', date);

        var statusQuery = new AV.Query('PlayOrder');
        statusQuery.equalTo('status', '已接单');

        var query = AV.Query.and(priorityQuery, statusQuery);
          query.find().then(function (orders) {
            orders.forEach(function(order) {
              order.set('status', '超时完成');
            })
            return AV.Object.saveAll(orders);
          }, function (error) {
          });


        // var paramsJson = {
        //   dateToday: date,
        //   lotterys: lottery,
        //   lotterysNew: lotteryNew
        // };
        // AV.Cloud.run('sendTemplateMessage', paramsJson).then(function(data) {
        //   console.log(data)
        // }, function(err) {
        //   console.log(data)
        // });
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
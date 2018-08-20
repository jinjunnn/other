const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var page_index = 0;
var page_size = 8;

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
      console.log(Number(options.mode))
      this.setConfi('5a6492c61b69e60066f379a7')
      this.queryLottery(Number(options.mode))
  },
  setConfi(objectId){
    var that = this;
    var query = new AV.Query('Confi');
    query.get(objectId).then(function (confi) {
         console.log(confi.attributes.lotteryDisplay)
         that.setData({confi:confi.attributes.lotteryDisplay})
    }, function (error) {
      // 异常处理
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
  },
  queryLottery(mode){
    var d = new Date()
    var query1 = new AV.Query('Lottery');
    query1.equalTo('displayOrNot', true)
    var query2 = new AV.Query('Lottery');
    query2.equalTo('mode', mode)

    var query = AV.Query.and(query1, query2);

    query.ascending('confi');
    query.limit(page_size);
    query.find().then(goodslist => this.setData({
      goodslist,
      d,
    })).catch(console.error);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  wx.setNavigationBarTitle({ title: '拼团'});
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

  reFrish: function () {
    var query1 = new AV.Query('Lottery');
    query1.equalTo('displayOrNot', true)
    var query2 = new AV.Query('Lottery');
    query2.equalTo('mode', mode)

    var query = AV.Query.and(query1, query2);
    query.ascending('confi');
    query.limit(page_size);
    query.skip(page_index * page_size);
    query.find().then(goodslist => this.setData({
      goodslist : this.data.goodslist.concat(goodslist)
    })).catch(console.error);
  },
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
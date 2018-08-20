const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var that = this;
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
    this.setConfi('5a6492c61b69e60066f379a7')
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
  wx.setNavigationBarTitle({ title: '首页'});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var d = new Date()

    var query = new AV.Query('Lottery');
    query.ascending('confi');
    query.equalTo('displayOrNot', true)
    query.limit(page_size);
    query.find().then(goodslist => this.setData({
      goodslist,
      d,
    })).catch(console.error);
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
  reFrish: function () {

    var query = new AV.Query('Lottery');
    query.ascending('confi');
    query.equalTo('displayOrNot', true)
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
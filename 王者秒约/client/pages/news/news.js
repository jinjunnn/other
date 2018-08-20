const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var that = this;
var page_index = 0;
var page_size = 12;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //查询文章列表
  queryMaster(){
    var query = new AV.Query('News');
    query.descending('createdAt');
    query.limit(page_size);
    query.include('targetUser');
    query.find().then(news => this.setData({
      news
    })).catch(console.error);
  },

    setConfi(objectId){
    var that = this;
    var query = new AV.Query('Confi');
    query.get(objectId).then(function (confi) {
         console.log(confi.attributes.lotteryDisplay)
         that.setData({
          confi:confi.attributes,
        })
    }, function (error) {
      // 异常处理
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryMaster()
    this.setConfi('5a6492c61b69e60066f379a7')

  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log(options)
  
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
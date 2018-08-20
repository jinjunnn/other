const common = require('../../../model/common');
const AV = require('../../../utils/av-live-query-weapp-min');
var app = getApp();
var page_index = 0;
var page_size = 8;
var gameId;

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
    wx.showNavigationBarLoading()
    gameId = Number(options.gameId)
    this.queryTrade(Number(options.gameId))
    wx.hideNavigationBarLoading()
    wx.setNavigationBarTitle({ title: options.gamename});
  },

  queryTrade(game){
          var query1 = new AV.Query('Trade');
          query1.equalTo('status', 3);

          var query2 = new AV.Query('Trade');
          query2.equalTo('game', game);

          var query = AV.Query.and(query1, query2);
          query.descending('createdAt');
          query.limit(page_size);
          query.find().then(teams => this.setData({
            teams
          })).catch(console.error);
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
    page_index = 0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    page_index = 0;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  reFrish(game){
    // 分页
          var query1 = new AV.Query('Trade');
          query1.equalTo('status', 3);
          var query2 = new AV.Query('Trade');
          query2.equalTo('game', game);
          var query = AV.Query.and(query1, query2);
          query.descending('createdAt');
          query.limit(page_size);
          query.skip(page_index * page_size);
          query.find().then(results => this.setData({
            teams : this.data.teams.concat(results)
          })).catch(console.error);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish(gameId);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
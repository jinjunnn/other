const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');
var objectId;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    this.setGame()
  },

  onReady: function () {
  
  },
  setGame(){
        var gamequery = new AV.Query('Game');
        gamequery.addAscending('id');
        gamequery.find().then(games => this.setData({
          games
        })).catch(console.error);
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
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var that = this;
var page_index = 0;

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
      var that = this;
      setTimeout( function(){that.setData({confi:app.globalData.confi})},1000 );  
  },

  settingConfi(){
    var that= this;
    that.setData({
      confi:app.globalData.confi,
    })
  },

  onReady: function () {
    this.queryVideo()

  },

  queryVideo(){
    var query = new AV.Query('Video');
    query.equalTo('display',true);
    query.limit(8);
    query.find().then(topicList => this.setData({
      topicList
    })).catch(console.error);
  },

  tap(event){
          wx.navigateToMiniProgram({
          appId: app.globalData.confi.settings.targetAppId,
          path:  app.globalData.confi.settings.indexPageItemPath,
          success(res) {
          }
        })
  },

  onShow: function () {
    
  },

  onHide: function () {
    page_index = 0;
  },

  onUnload: function () {
    page_index = 0;
  },

  onPullDownRefresh: function () {
      this.queryVideo()
  },

  reFrish: function () {
    var page_size = 8;
    // 分页
    var query = new AV.Query('Video');
    query.equalTo('display',true);
    query.limit(page_size);
    query.skip(page_index * page_size);
    query.find().then(results => this.setData({
      topicList : this.data.topicList.concat(results)
    })).catch(console.error);
  },

  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: this.data.topicList[0].attributes.title,
      imageUrl: this.data.topicList[0].attributes.cover.attributes.url,
      path: '/pages/video/video',
      success: function(res) {
      },
      fail: function(res) {
      }
    }
  }
})
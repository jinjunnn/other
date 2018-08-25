// pages/index/index.js
const AV = require('../../utils/av-live-query-weapp-min');
const bind = require('../../utils/live-query-binding');
var app = getApp()
var that = this;
Page({

  data: {
    topicList: [],
    page_index: 0,
  },
  onLoad: function (options) {

  },
  onReady: function () {
    that = this;
    var query = new AV.Query('Post');
    query.limit(8);
    query.include('targetUser');
    query.find().then(postList => this.setData({
      postList
    })).catch(console.error);
  },

  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  navigator() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },
  reFrish: function () {
    var page_size = 8;
    // 分页
    var topicQuery = new AV.Query('Topic');
    topicQuery.descending('createdAt');
    topicQuery.limit(page_size);
    topicQuery.skip(this.data.page_index * page_size);
    // 查询所有数据
    topicQuery.include('user'); // 关键代码，用 include 告知服务端需要返回的关联属性对应的对象的详细信息，而不仅仅是 objectId
    topicQuery.find().then(results => this.setData({
      topicList: this.data.topicList.concat(results)
    })).catch(console.error);
  },
  onReachBottom: function () {
    this.setData({
      page_index: ++this.data.page_index
    });
    this.reFrish();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
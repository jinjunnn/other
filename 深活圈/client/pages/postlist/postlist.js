// pages/index/index.js
const AV = require('../../utils/av-live-query-weapp-min');
const bind = require('../../utils/live-query-binding');
var app = getApp();
var page_size = 8;
var page_index = 0;
Page({

  data: {
    topicList: [],
    page_index: 0,
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },

  onShow: function () {
    let that = this;
    let query = new AV.Query('Post');
    query.limit(page_size);
    query.descending('createdAt');
    query.include('targetUser');
    query.include('targetTag');
    query.find().then(postList => this.setData({
      postList
    })).catch(console.error);
  },
  onHide: function () {
    page_index = 0;
    console.log(page_index)
  },
  onUnload: function () {
    page_index = 0;
    console.log(page_index)
  },
  onPullDownRefresh: function () {

  },
  navigator() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },
  reFrish: function () {
    let that = this;

    let query = new AV.Query('Post');
    query.limit(page_size);
    query.descending('createdAt');
    query.include('targetUser');
    query.include('targetTag');
    query.skip(page_index * page_size);
    query.find().then(results => this.setData({
      postList: this.data.postList.concat(results)
    })).catch(console.error);

  },
  onReachBottom: function () {
 
    page_index++;
    console.log(page_index)
    this.reFrish();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
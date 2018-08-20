// pages/topic/topic.js
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;
Page({
  tapName: function (event) {
    console.log(event)
  },
  /**
   * 页面的初始数据
   */
  data: {
    topciList: [],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    that = this;
    this.setData({
      title: options.title
    })
  },
  showDetail: function() {
    wx.redirectTo({
      url: 'detail/detail'
    })
  },

  onShareAppMessage: function () {
  
  },
  showNavigationBarLoading: function () {
    wx.showNavigationBarLoading()
  },
  hideNavigationBarLoading: function () {
    wx.hideNavigationBarLoading()
  },
  noneWindows: function () {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
    getList(this);
    getList(this);


    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  toAddDiary: function () {
    that.setData({
      writeDiary: true
    })
  },
})


function getList(t, k) {
  that = t;
  var Topic = Bmob.Object.extend("topic");
  var query = new Bmob.Query(Topic);
  var query1 = new Bmob.Query(Topic);

  //会员模糊查询
  if (k) {
    query.equalTo("title", { "$regex": "" + k + ".*" });
  }

  //普通会员匹配查询
  // query.equalTo("title", k);

  query.descending('createdAt');
  query.include("own")
  // 查询所有数据
  query.limit(that.data.limit);

  var mainQuery = Bmob.Query.or(query, query1);
  mainQuery.find({
    success: function (results) {
      // 循环处理查询到的数据
     // console.log(results);
      that.setData({
        topicList: results
      })
    },
    error: function (error) {
      console.log("查询失败2: " + error.code + " " + error.message);
    }
  });
}





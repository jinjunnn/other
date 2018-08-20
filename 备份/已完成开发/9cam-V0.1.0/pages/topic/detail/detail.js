// pages/index/detail/index.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp();
var that = this;
var topic = null;
Page({
  data: {
   diaryList: [],
   topic:null
  },
  onLoad: function (e) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(e.title)
    topic = e.title;
    var that = this;
    getList(that);
    that.setData({topic:topic})
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
        console.log('成功', res)
        wx.getShareInfo({
          shareTicket: res.shareTickets,
          complete(res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
function getList(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("diary");
  var query = new Bmob.Query(Diary);
  query.equalTo("topic", topic);
  query.descending('createdAt');
  query.include("own")
  var mainQuery = Bmob.Query.or(query);
  mainQuery.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        diaryList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}


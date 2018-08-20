//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;
Page({
  data: {
    diaryList: [],
  },
onLoad: function () {
    that = this;
    wx.showShareMenu({
            withShareTicket: true //要求小程序返回分享目标信息
        })
  },
//onshow函数
  onShow: function () {
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

})

function getList(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("diary");
  var query = new Bmob.Query(Diary);
  var query1 = new Bmob.Query(Diary);

  //会员模糊查询
  if (k) {
    query.equalTo("title", { "$regex": "" + k + ".*" });
    query1.equalTo("content", { "$regex": "" + k + ".*" });
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
// pages/index/detail/index.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that = this;

Page({
  data: {
    rows: {},
  },
  onLoad: function (e) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(e.objectId)
    var objectId = e.objectId;
    var that = this;
    // if (!e.objectId) {
    //   common.showTip("请重新进入", "loading");
    //   return false;
    // }

    var Ad = Bmob.Object.extend("ad");
    var query = new Bmob.Query(Ad);

    query.get(objectId, {
      success: function (result) {
        console.log(result);

        that.setData({
          rows: result,

        })
        // The object was retrieved successfully.        
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
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

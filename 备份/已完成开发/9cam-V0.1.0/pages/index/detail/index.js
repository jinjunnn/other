// pages/index/detail/index.js

var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp();
var that = this;

Page({
  data: {
    rows: {},
    adList:[]
  },
  onLoad: function (e) {
    var that = this;
    getList(this);
    console.log(e.objectId)
    var objectId = e.objectId;
    // if (!e.objectId) {
    //   common.showTip("请重新进入", "loading");
    //   return false;
    // }
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    query.get(objectId, {
      success: function (result) {
        console.log(result);
        that.setData({
          rows: result,
        })      
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
//广告栏目
function getList(t, k) {
  that = t;
  var Ad = Bmob.Object.extend("ad");
  var query = new Bmob.Query(Ad);

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

  var mainQuery = Bmob.Query.or(query);
  mainQuery.find({
    success: function (results) {
      // 循环处理查询到的数据
      // console.log(results);
      that.setData({
        adList: results
      })
    },
    error: function (error) {
      console.log("查询失败2: " + error.code + " " + error.message);
    }
  });
}

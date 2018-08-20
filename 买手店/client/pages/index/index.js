const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var page_index = 0;
var page_size = 5;



var topic = null;

Page({

  data: {
    itemList:[],
  },
  onLoad: function (options) {

  },

  onReady: function () {
this.queryTopic()
  },

  queryTopic(){
    var that = this;
    var query = new AV.Query('Topic');
    query.limit(page_size);
    query.include('targetUser');
    query.find().then(function (topicList) {
        for (var i = 0; i < topicList.length; i++) {
           that.queryItem(topicList[i])
        }
  }, function (error) {
    // 异常处理
  });
  },

  reFrish: function () {
    // 分页
    var that = this;
    var query = new AV.Query('Topic');
    query.limit(page_size);
    query.skip(page_index * page_size);
    // 查询所有数据
    query.include('targetUser');
    query.find().then(function (topicList) {
        for (var i = 0; i < topicList.length; i++) {
           that.queryItem(topicList[i])
        }
  }, function (error) {
    // 异常处理
  });
  },

  queryItem(topic){
    var that = this;
    var numbers;
    var query = new AV.Query('Item');
    query.limit(5);
    query.equalTo('targetTopic', AV.Object.createWithoutData('Topic', topic.id));
    query.include('targetUser');
    query.include('targetUser');
    query.count().then(function (count) {
        numbers = count;
    }, function (error) {
    })
    query.find().then(function (item) {
        var image=[{topic:topic,item:item,length:numbers}];
        that.setData({
              itemList : that.data.itemList.concat(image),
        })
  }, function (error) {
    // 异常处理
  });
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

  },
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.indexSharePage.title,
      path: app.globalData.confi.indexSharePage.path,
      imageUrl:app.globalData.confi.indexSharePage.imageUrl,
      success: function(res) {
          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res){
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var paramsJson = {
                  user:AV.User.current().id,
                  encryptedData: encryptedData,
                  iv: iv,
                  sessionKey:User.current().attributes.authData.lc_weapp.session_key,
                  }
              Cloud.run('groupId' ,paramsJson)
            }
          })
      }
    }
  }
})
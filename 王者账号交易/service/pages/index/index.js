
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var that = this;
var page_index = 0;
var page_size = 12;
Page({

  data: {
    topicList:[],
    page_index: 0,
    multiArray:  ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜'],

  },
  onLoad: function (options) {
    this.setConfi('5a6492c61b69e60066f379a7')
  },

  onReady: function () {

  },
  setConfi(objectId){
    var that = this;
    var query = new AV.Query('Confi');
    query.get(objectId).then(function (confi) {
         console.log(confi.attributes.lotteryDisplay)
         that.setData({confi:confi.attributes.lotteryDisplay})
    }, function (error) {
      // 异常处理
    });
  },
  queryMaster(){
    var query1 = new AV.Query('Master');
    query1.equalTo('prior', true);
    var query2 = new AV.Query('Master');
    query2.equalTo('status', 3);

    var topicQuery = AV.Query.and(query1, query2);

    topicQuery.addAscending('confi');
    topicQuery.addDescending('numberOfOrder');
    topicQuery.limit(12);
    topicQuery.include('targetUser');
    topicQuery.find().then(topicList => this.setData({
      topicList
    })).catch(console.error);
  },

  onShow: function () {
    this.queryMaster()
  },
  onHide: function () {
    page_index = 0;
  },
  onUnload: function () {
    page_index = 0;
  },
  onPullDownRefresh: function () {
      this.queryMaster()
  },
  reFrish: function () {
    var page_size = 12;
    // 分页
    var query1 = new AV.Query('Master');
    query1.equalTo('prior', true);
    var query2 = new AV.Query('Master');
    query2.equalTo('status', 3);

    var topicQuery = AV.Query.and(query1, query2);
    
    topicQuery.addAscending('confi');
    topicQuery.addDescending('numberOfOrder');
    topicQuery.limit(page_size);
    topicQuery.skip(page_index * page_size);
    // 查询所有数据
    topicQuery.include('targetUser');
    topicQuery.find().then(results => this.setData({
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
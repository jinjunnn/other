const AV = require('../../../utils/av-live-query-weapp-min');
var app = getApp();
var objectId;
var gameId;



Page({
  data: {  
  },
  onLoad: function (options) {
      objectId = options.objectId;
      gameId = options.gameId;
      this.setData({ mode:app.globalData.confi.mode})
  },

  onReady: function () {
  },

  onShow: function () {
      this.queryVideo()
      this.queryAd()
  },

  queryVideo(){
      var query = new AV.Query('Video');
      query.get(objectId).then(video => this.setData({video:video})).catch(console.error);
  },

  queryAd(){
      var query = new AV.Query('Ad');
      query.equalTo('gameId', Number(gameId));
      query.descending('prior');
      query.find()
     .then(comment => this.setData({ 
         comment: comment.map(orderItem => Object.assign(orderItem.toJSON(), {
         updatedAt: orderItem.createdAt.toLocaleString(),
         }))
     }))
  },
  tap(event){
      if (gameId == 1) {
          wx.navigateToMiniProgram({
          appId: 'wx4f93ecdfd7367530',
          path: event.currentTarget.dataset.path,
          success(res) {
          }
        })
        } else if (gameId == 2){
          wx.navigateToMiniProgram({
          appId: 'wx628aeebe0d1a37c5',
          path: event.currentTarget.dataset.path,
          success(res) {
          }
        })
        }
  },
  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
    return this.refreshOrders().then(wx.stopPullDownRefresh);
  },

  onReachBottom: function () {
  
  },
  onShareAppMessage: function (res) {
    console.log(this.data.video)
    if (res.from === 'button') {
    }
    return {
      title: this.data.video.attributes.title,
      imageUrl: this.data.video.attributes.cover.attributes.url,
      path: '/pages/video/detail/detail?objectId=' + objectId + '&gameId=' + gameId,
      success: function(res) {
      },
      fail: function(res) {
      }
    }
  }
})
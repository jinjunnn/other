// pages/goods/goods.js
const common = require('../../model/common');
const AV = require('../../utils/av-live-query-weapp-min');
var app = getApp();
var page_index = 0;
var page_size = 10;


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.showNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
      wx.setNavigationBarTitle({ title: '游戏交易'});

  },

  navigator(){
        wx.navigateTo({
          url: './publish/publish'
    })
  },

  queryGame(){
    var query = new AV.Query('Game');
    query.ascending('confi');
    query.equalTo('displayOrNot', true)
    query.find().then(game => this.setData({
        game,
    })).catch(console.error);
  },

  queryTrade(){
          var query = new AV.Query('Trade');
          query.equalTo('status', 3);
          query.descending('createdAt');
          query.limit(page_size);
          query.find().then(teams => this.setData({
            teams
          })).catch(console.error);
  },

  bindNavTradeIndexPage(e){
    console.log(e.currentTarget.dataset.gameid)
    wx.navigateTo({
      url: './index/index?gameId='+e.currentTarget.dataset.gameid+'&gamename='+e.currentTarget.dataset.gamename
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
       this.queryGame()
       this.queryTrade()
       wx.hideNavigationBarLoading()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  page_index = 0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  page_index = 0;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  reFrish: function () {
    // 分页
          var query = new AV.Query('Trade');
          query.equalTo('status', 3);
          query.descending('createdAt');
          query.limit(page_size);
          query.skip(page_index * page_size);
          query.find().then(results => this.setData({
            teams : this.data.teams.concat(results)
          })).catch(console.error);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },



  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.tradeSharePage.title,
      path: app.globalData.confi.tradeSharePage.path,
      imageUrl:app.globalData.confi.tradeSharePage.imageUrl,
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
// pages/me/me.js
const AV = require('../../utils/av-live-query-weapp-min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (user) {
       that.setData({
        user:user,
       })
  }, function (error) {
    // 异常处理
  });

    //查询我的文章
  var queryArticle = new AV.Query('Article');
  var user = AV.Object.createWithoutData('_User', AV.User.current().id);
  queryArticle.equalTo('targetUser', user);
  queryArticle.find().then(function (articles) {
      that.setData({articles:articles.length})
  }, function (error) {
  });
    //查询我的关注
    var queryFollowee = AV.User.current().followeeQuery();
    queryFollowee.include('followee');
    queryFollowee.find().then(function(followees){
           var followees = followees.length;
            that.setData({
            followees:followees,
        })
    });
    //查询我的粉丝
    var queryFollower = AV.User.current().followerQuery();
    queryFollower.include('follower');
    queryFollower.find().then(function(followers){
           var followers = followers.length;
            that.setData({
            followers:followers,
        })
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
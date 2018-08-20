// pages/user/author/author.js
const AV = require('../../../utils/av-live-query-weapp-min');
var t ;

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
    console.log(options)
    var that = this;
    t = options.objectId;

    var query = new AV.Query('_User');
    query.get(t).then(function (author) {
       that.setData({
        author:author,
       })
  }, function (error) {
    // 异常处理
  });


    var queryLikes = new AV.Query('_Status');
    queryLikes.equalTo('source', AV.Object.createWithoutData('_User',options.objectId));
    queryLikes.include('targetArticle');
    queryLikes.include('targetArticle.targetUser');
    queryLikes.find().then(function(statuses){
          var likes = statuses.length;
            that.setData({
            likes:likes,
            articles:statuses,
            objectId:options.objectId,

        })          
    });

        var queryFollowee = new AV.Query('_Followee');
    queryFollowee.equalTo('user', AV.Object.createWithoutData('_User',options.objectId));
    queryFollowee.find().then(function(followee){
          var followees = followee.length;
            that.setData({
            followees:followees,
            m:AV.User.current().id,
        })          
    });

        var queryFollower = new AV.Query('_Follower');
    queryFollower.equalTo('user', AV.Object.createWithoutData('_User',options.objectId));
    queryFollower.find().then(function(follower){
          var followers = follower.length;
            that.setData({
            followers:followers,
        })          
    });
    //查询与用户是否为好友关系，如果为好友关系COUNT=1；
      var queryUser = AV.User.current().followeeQuery();
      queryUser.equalTo('followee', AV.Object.createWithoutData('_User', options.objectId))
      queryUser.include('followee');
      queryUser.find().then(function (followee) {
      var count = followee.length;
      that.setData({ count });

      }, function (error) {
      });
      // if (t == AV.User.current().id) { 
      //   var count = this.data.count - 1;
      //   that.setData({ 
      //   count })}
  },

  toggleFollow: function () {
    var that = this;
    if (this.data.count == 0) {

      var currentUser = AV.User.current();
      currentUser.follow(t).then(function () {
        console.log('关注成功')
      }, function (err) {
        //关注失败
        console.dir(err);
      });
      var count = this.data.count + 1;
      this.setData({
        count
      })
    } else {
      AV.User.current().unfollow(t).then(function(){
        console.log('取消关注成功')
      }, function(err){
        //取消关注失败
        console.dir(err);
      });
      var count = this.data.count - 1;
      this.setData({
        count
      })
    }
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
    var queryLikes = new AV.Query('_Status');
    queryLikes.equalTo('source', AV.Object.createWithoutData('_User', t));
    queryLikes.include('targetArticle');
    queryLikes.find().then(function (statuses) {
      var likes = statuses.length;
      that.setData({
        likes: likes,
        articles: statuses,
      })
    });

    var queryFollowee = new AV.Query('_Followee');
    queryFollowee.equalTo('user', AV.Object.createWithoutData('_User', t));
    queryFollowee.find().then(function (followee) {
      var followees = followee.length;
      that.setData({
        followees: followees,
      })
    });

    var queryFollower = new AV.Query('_Follower');
    queryFollower.equalTo('user', AV.Object.createWithoutData('_User', t));
    queryFollower.find().then(function (follower) {
      var followers = follower.length;
      that.setData({
        followers: followers,
      })
    });
    //查询与用户是否为好友关系，如果为好友关系COUNT=1；
    var queryUser = AV.User.current().followeeQuery();
    queryUser.equalTo('followee', AV.Object.createWithoutData('_User', t))
    queryUser.include('followee');
    queryUser.find().then(function (followee) {
      var count = followee.length;
      that.setData({ count });
    }, function (error) {
    });

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
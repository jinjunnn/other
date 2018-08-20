// pages/detail/detail.js
const AV = require('../../utils/av-live-query-weapp-min');
const bind = require('../../utils/live-query-binding');
var that = this;
var lat;
var lng;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
  },
  onLoad: function (options) {
    var that = this;

    const queryArticle = new AV.Query('Article')
        // queryArticle.equalTo('objectId', options.articleObjectId);
        queryArticle.include('targetUser');
        queryArticle.include('targetTopic');
        queryArticle.include('targetTopic.user');
        queryArticle.get(options.articleObjectId).then(function (article) {

        //创建一个数组，并将位置信息储存在数组[0]中
          var markers = [{
                  iconPath: "/image/地图标记.png",
                  id: 0,
                  latitude: article._serverData.lat,
                  longitude: article._serverData.lng,
                  width: 50,
                  height: 50
          }];
        that.setData({
          article,
          markers:markers,

        })

        }, function (error) {
        });

    const queryUser = new AV.Query('_Status')
          queryUser.equalTo('source', AV.Object.createWithoutData('_User', AV.User.current().id))
    const queryStatus = new AV.Query('_Status')
          queryStatus.equalTo('targetArticle', AV.Object.createWithoutData('Article',this.options.articleObjectId))
    var query = AV.Query.and(queryUser, queryStatus);
        query.count().then(function (count) {
           var count = count ;
           that.setData({count});
        }, function (error) {
        });
  }, 

  toggleLike: function() {
    if (this.data.count==0) {
        var status = new AV.Status();
        var targetArticle = AV.Object.createWithoutData('Article', this.options.articleObjectId);
        status.set('targetArticle',targetArticle); 
            status.send().then(function(){
             }, function(err){
                    console.dir(err);
             }); 
              var query = AV.Status.statusQuery(AV.User.current());
              query.find().then(function(statuses){
              });
      var count = this.data.count+1;
            this.setData({
            count  
        })
    }else{
        const queryUser = new AV.Query('_Status')
        var queryUser = AV.Status.statusQuery(AV.User.current());
        const queryArticle = new AV.Query('_Status')
        queryArticle.equalTo('targetArticle', AV.Object.createWithoutData('Article',this.options.articleObjectId));
        var query = AV.Query.and(queryUser, queryArticle);
        query.find().then(function(statuses){
              var like = AV.Object.createWithoutData('_Status', statuses[0].id);
              like.destroy().then(function (success) {
              }, function (error) {
              });
        });
              var count = this.data.count-1;
              this.setData({
              count  
        })
    }
  },
  setWishList(){
    if (this.data.count==0) {
        var status = new AV.Status();
        var targetArticle = AV.Object.createWithoutData('Article', this.options.articleObjectId);
        status.set('targetArticle',targetArticle); 
            status.send().then(function(){
             }, function(err){
                    console.dir(err);
             }); 
              var query = AV.Status.statusQuery(AV.User.current());
              query.find().then(function(statuses){
              });
      var count = this.data.count+1;
            this.setData({
            count  
        })
    }else{
        const queryUser = new AV.Query('_Status')
        var queryUser = AV.Status.statusQuery(AV.User.current());
        const queryArticle = new AV.Query('_Status')
        queryArticle.equalTo('targetArticle', AV.Object.createWithoutData('Article',this.options.articleObjectId));
        var query = AV.Query.and(queryUser, queryArticle);
        query.find().then(function(statuses){
              var like = AV.Object.createWithoutData('_Status', statuses[0].id);
              like.destroy().then(function (success) {
              }, function (error) {
              });
        });
              var count = this.data.count-1;
              this.setData({
              count  
        })
    }
    

  },

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
  
  },
 
})

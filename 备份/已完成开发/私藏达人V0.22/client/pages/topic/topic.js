var app = getApp()
const AV = require('../../utils/av-live-query-weapp-min');
const bind = require('../../utils/live-query-binding');
var row
Page({
  data: {
    articles:[],
  },

  onLoad: function (options) {
    var that = this;
    var query = new AV.Query('Topic');
    query.include('user');
    query.get(options.objectId).then(function (topic) {


       that.setData({
          topic,
       })
    }, function (error) {
      // 异常处理
    });

    var topic = AV.Object.createWithoutData('Topic', options.objectId);
    var query1 = new AV.Query('Article');
    query1.include('thumb');
    query1.equalTo('targetTopic', topic);
    query1.find().then(function (article) {
      that.setData({
        articles: article,
      })  
      var renew = AV.Object.createWithoutData('Topic', options.objectId);
      renew.increment('read', 1);
      todo.fetchWhenSave(true);
      return renew.save();

    });

    // //状态的发布
    // var status = new AV.Status();
    // status.set('like', 1);
    // var targetArticle = AV.Object.createWithoutData('Article', '597ccc7f1b69e6006c568b66');
    // status.set('targetArticle',targetArticle);   
    // var targetTopic = AV.Object.createWithoutData('Topic', options.objectId);
    // status.set('targetTopic',targetTopic);
    // status.send().then(function(){
    //          //send status successfully.
    //  }, function(err){
    //         //an error threw.
    //         console.dir(err);
    //  });
  },

  onShow: function() {

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

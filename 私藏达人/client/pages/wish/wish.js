// pages/wish/wish.js
const AV = require('../../utils/av-live-query-weapp-min');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    page_index: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
    //这里有问题，如果用户没有登录，则会出现错误。
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //查询我的收藏
    var that = this;
    var queryLikes = AV.Status.statusQuery(AV.User.current());
    queryLikes.descending('createdAt');
    queryLikes.limit(15);
    queryLikes.include('targetArticle');
    queryLikes.include('targetArticle.targetUser');
    queryLikes.find().then(function(statuses){
            that.setData({
            articles:statuses,
        })          
    });
  },
  reFrish: function () {
    var page_size = 15;
    // 分页
    var queryLikes = AV.Status.statusQuery(AV.User.current());
    queryLikes.descending('createdAt');
    queryLikes.limit(page_size);
    queryLikes.skip(this.data.page_index * page_size);
    queryLikes.include('targetArticle');
    queryLikes.include('targetArticle.targetUser');
    queryLikes.find().then(results => this.setData({
      articles: this.data.articles.concat(results)
    })).catch(console.error);
  },
  onPullDownRefresh: function () {
    var that = this;
    var queryLikes = AV.Status.statusQuery(AV.User.current());
    queryLikes.include('targetArticle');
    queryLikes.find().then(function (statuses) {
      var likes = statuses.length;
      that.setData({
        articles: statuses,
      })
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page_index: ++this.data.page_index
    });
    this.reFrish();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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
})
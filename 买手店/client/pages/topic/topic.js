const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var page_index = 0;
var page_size = 10;

var objectId;

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
      objectId = options.objectId;
  },

  queryTopic(){
      var that = this;
      var query = new AV.Query('Topic');
      query.include('targetUser');
      query.get(objectId).then(function (topic) {
            that.setData({
                  topic:topic
            })
      }, function (error) {
        // 异常处理
      });
  },

  queryItem(topic){
    var that = this;
    var numbers;
    var query = new AV.Query('Item');
    query.equalTo('targetTopic', AV.Object.createWithoutData('Topic', topic));
    query.limit(page_size);
    query.include('targetUser');
    query.include('targetUser');
    query.find().then(function (item) {
        that.setData({
              itemlist: item
        })
  }, function (error) {
    // 异常处理
  });
  },

  reFrish: function () {
    var that = this;
    var numbers;
    var query = new AV.Query('Item');
    query.equalTo('targetTopic', AV.Object.createWithoutData('Topic', topic));
    query.limit(page_size);
    query.skip(page_index * page_size);
    query.include('targetUser');
    query.include('targetUser');
    query.find().then(function (item) {
        that.setData({
            itemlist: this.data.itemlist.concat(item)
        })
  }, function (error) {
    // 异常处理
  });
  },

  onReady: function () {
      this.queryTopic()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.queryItem(objectId)
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      page_index++;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
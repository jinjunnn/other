//我发布的活动


const AV = require('../../../utils/av-live-query-weapp-min');
const bind = require('../../../utils/live-query-binding');
const common = require('../../../model/common');
var app = getApp();


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
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //queryPublish
  queryPublish(){
    let that = this;
    let query = new AV.Query('Post');
    query.equalTo('targetUser', AV.User.current());
    query.limit(20);
    query.include('targetUser');
    query.find().then(postList => this.setData({
      postList
    })).catch(console.error);

  },

  bindSubmit(event){
    console.log('woshi')
    console.log(event)
    console.log(event.currentTarget.dataset.objectid)
    let objectId = event.currentTarget.dataset.objectid
    wx.navigateTo({
      url: '../../postlist/content/content?objectId=' + objectId
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.queryPublish();
  
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
// pages/index/index.js
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp()
var that = this;
Page({

  data: {
    topicList:[],
    page_index: 0,
    multiArray:  ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜'],

  },
  onLoad: function (options) {
    var that = this;
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      var nickName = userInfo.nickName;
      var avatarUrl = userInfo.avatarUrl;
      const user = AV.User.current();
     // console.log(user)
      user.set('username', nickName);
      user.set('userImage',avatarUrl);
      // 保存到云端
      user.save();
    })
  },
  login: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp());
  },
  onReady: function () {

    this.login()
    that = this;
    var topicQuery = new AV.Query('Master');
    topicQuery.descending('read');
    topicQuery.equalTo('display',true);
    topicQuery.limit(8);
    topicQuery.include('targetUser');
    topicQuery.find().then(topicList => this.setData({
      topicList
    })).catch(console.error);
  },

  onShow: function () {

  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  reFrish: function () {
    var page_size = 8;
    // 分页
    var topicQuery = new AV.Query('Master');
    topicQuery.descending('createdAt');
    topicQuery.limit(page_size);
    topicQuery.skip(this.data.page_index * page_size);
    // 查询所有数据
    topicQuery.include('user');
    topicQuery.find().then(results => this.setData({
      topicList : this.data.topicList.concat(results)
    })).catch(console.error);
  },
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
  
  }
})
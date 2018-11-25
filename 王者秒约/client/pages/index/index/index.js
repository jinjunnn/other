
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');
var app = getApp()
var that = this;
var page_index = 0;
let mode;

Page({

  data: {
    topicList:[],
    page_index: 0,
    multiArray:  ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜'],

  },
  onLoad: function (options) {
    mode = options.mode;

  },
  getUserInfo(){
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      var nickName = userInfo.nickName;
      var avatarUrl = userInfo.avatarUrl;
      var city = userInfo.city;
      var gender = userInfo.gender;
      var province = userInfo.province;
      const user = AV.User.current();
      user.set('username', nickName);
      user.set('userImage',avatarUrl);
      user.set('city', city);
      user.set('province',province);
      user.set('gender',gender);      
      // 保存到云端
      user.save();
    })
  },

  onReady: function () {

    this.queryMaster()
  },
  queryMaster(){
  var query1 = new AV.Query('Master');
  query1.equalTo('mode', Number(mode));
  var query2 = new AV.Query('Master');
  query2.equalTo('status', 3);

  var topicQuery = AV.Query.and(query1, query2);
    topicQuery.addAscending('confi');
    topicQuery.addDescending('numberOfOrder');
    topicQuery.limit(12);
    topicQuery.include('targetUser');
    topicQuery.find().then(topicList => this.setData({
      topicList
    })).catch(console.error);
  },

  onShow: function () {
    
  },
  onHide: function () {
    page_index = 0;
  },
  onUnload: function () {
    page_index = 0;
  },
  onPullDownRefresh: function () {
      this.queryMaster()
  },
  reFrish: function () {
    var page_size = 12;
    var query1 = new AV.Query('Master');
    query1.equalTo('mode', Number(mode));
    var query2 = new AV.Query('Master');
    query2.equalTo('status', 3);

    var topicQuery = AV.Query.and(query1, query2);
    topicQuery.equalTo('status',3);
    topicQuery.addAscending('confi');
    topicQuery.addDescending('numberOfOrder');
    topicQuery.limit(page_size);
    topicQuery.skip(page_index * page_size);
    // 查询所有数据
    topicQuery.include('targetUser');
    topicQuery.find().then(results => this.setData({
      topicList : this.data.topicList.concat(results)
    })).catch(console.error);
  },
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: 'pages/lottery/lottery?user=' + AV.User.current().id,
    }
  }
})
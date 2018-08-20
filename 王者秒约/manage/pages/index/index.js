// pages/index/index.js
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var that = this;
var page_index = 0;
var page_size = 100;

Page({

  data: {
    topicList:[],
    page_index: 0,
    multiArray:  ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜'],
  },
  onLoad: function (options) {

  },


  queryMaster(){
    var topicQuery = new AV.Query('Master');
    topicQuery.descending('createdAt');
    topicQuery.equalTo('status',2);
    topicQuery.limit(page_size);
    topicQuery.include('targetUser');
    topicQuery.find()
              .then(topicList => {
                console.log(topicList.length)
                        var comm = topicList.filter(function (x) {
                          return x.attributes.targetUser.attributes.userImage !== undefined;
                        });
                        this.setData({ 
                           topicList :comm
                        })
              })
             .catch(console.error);

  },
  reFrish: function () {
    var topicQuery = new AV.Query('Master');
    topicQuery.descending('createdAt');
    topicQuery.equalTo('status',2);
    topicQuery.limit(page_size);
    topicQuery.skip(page_index * page_size);
    topicQuery.include('targetUser');
    topicQuery.find()
              .then(topicList => {
                        var comm = topicList.filter(function (x) {
                          return x.attributes.targetUser.attributes.userImage !== undefined;
                        });
                        this.setData({ 
                           topicList :this.data.topicList.concat(comm)
                        })
              })
             .catch(console.error);
  },

  onShow: function () {
    this.queryMaster()
  },
  onHide: function () {
    // page_index = 0;
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
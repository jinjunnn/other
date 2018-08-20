
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var that = this;
var page_index = 0;

Page({

  data: {
    topicList:[],
    page_index: 0,
    multiArray:  ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜'],
    banner:[
             'http://lc-xfs1iy3e.cn-n1.lcfile.com/ee8bb6f8a608274875fc.png',
             'http://lc-xfs1iy3e.cn-n1.lcfile.com/ee8bb6f8a608274875fc.png',
             'http://lc-xfs1iy3e.cn-n1.lcfile.com/ee8bb6f8a608274875fc.png',
             'http://lc-xfs1iy3e.cn-n1.lcfile.com/ee8bb6f8a608274875fc.png'
            ],
    mode: 0,

  },
  onLoad: function (options) {
    this.setConfi('5a6492c61b69e60066f379a7')
  },

  onReady: function () {
    this.queryMaster()
  },
  setConfi(objectId){
    var that = this;
    var query = new AV.Query('Confi');
    query.get(objectId).then(function (confi) {
         console.log(confi.attributes.lotteryDisplay)
         that.setData({confi:confi.attributes})
    }, function (error) {
      // 异常处理
    });
  },

  bindChangeMode(e){
        this.setData({
          mode:Number(e.target.dataset.mode)
        })
        switch (Number(e.target.dataset.mode)) {
          case 0:
                  console.log(Number(e.target.dataset.mode))
                  var query1 = new AV.Query('Master');
                  query1.equalTo('prior', true);
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
            break;
          case 1:
                  console.log(Number(e.target.dataset.mode))
                  var query1 = new AV.Query('Master');
                  query1.equalTo('mode', 1);
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
            break;
          case 2:
                  console.log(Number(e.target.dataset.mode))
                  var query1 = new AV.Query('Master');
                  query1.equalTo('mode', 2);
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
            break;
          case 3:
                  console.log(Number(e.target.dataset.mode))
                  var query1 = new AV.Query('Master');
                  query1.equalTo('mode', 3);
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
            break;
        }

  },

  bindPlayAudio(e){

        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = e.target.dataset.audio
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
  },
  //这个是查询广告链接
  // queryProduct(){
  //   var query = new AV.Query('Product');
  //   query.ascending('confi');
  //   query.equalTo('displayOrNot', true)
  //   query.find().then(product => this.setData({
  //       product,
  //   })).catch(console.error);
  // },


  // queryGame(){
  //   var query = new AV.Query('Game');
  //   query.ascending('confi');
  //   query.equalTo('displayOrNot', true)
  //   query.find().then(game => this.setData({
  //       game,
  //   })).catch(console.error);
  // },

  queryMaster(){
    var query1 = new AV.Query('Master');
    query1.equalTo('prior', true);
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

  reFrish: function (mode) {
        switch (mode) {
          case 0:
                  var page_size = 12;
                  var query1 = new AV.Query('Master');
                  query1.equalTo('prior', true);
                  var query2 = new AV.Query('Master');
                  query2.equalTo('status', 3);
                  var topicQuery = AV.Query.and(query1, query2);
                  topicQuery.addAscending('confi');
                  topicQuery.addDescending('numberOfOrder');
                  topicQuery.limit(page_size);
                  topicQuery.skip(page_index * page_size);
                  topicQuery.include('targetUser');
                  topicQuery.find().then(results => this.setData({
                    topicList : this.data.topicList.concat(results)
                  })).catch(console.error);
            break;
          case 1:
                  var page_size = 12;
                  var query1 = new AV.Query('Master');
                  query1.equalTo('mode', 1);
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
            break;
          case 2:
                  var page_size = 12;
                  var query1 = new AV.Query('Master');
                  query1.equalTo('mode', 2);
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
            break;
          case 3:
                  var page_size = 12;
                  var query1 = new AV.Query('Master');
                  query1.equalTo('mode', 3);
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
            break;
        }
  },
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish(this.data.mode);
  },
  //积分打赏，给用户看的
  bindGive(){
      common.showModal('您好，您的积分不足，您可以通过每日登陆或转发获得相应的积分。', '积分不足')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.indexSharePage.title,
      path: app.globalData.confi.indexSharePage.path,
      imageUrl:app.globalData.confi.indexSharePage.imageUrl,
      success: function(res) {
          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res){
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var paramsJson = {
                  user:AV.User.current().id,
                  encryptedData: encryptedData,
                  iv: iv,
                  sessionKey:User.current().attributes.authData.lc_weapp.session_key,
                  }
              Cloud.run('groupId' ,paramsJson)
            }
          })
      }
    }
  }
})
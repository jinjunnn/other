// pages/goods/goods.js
const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var page_index = 0;
var page_size = 6;
var display = 0;
var title = '皮肤抽奖';
var theconfi = '5a6492c61b69e60066f379a7';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lotteryTimes:0,
    target: 'miniProgram',
  },
  /**
   * 生命周期函数--监听页面加载vb
   */
  onLoad: function (options) {
    this.queryConfi(theconfi);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({ title: title});
  },

  //查询用户是否有过本次抽奖,这个方法是用来验证用户身份，用于快速审核。
  findCurrentUserLottery(){
    var query = new AV.Query('LotteryToday');
    query.equalTo('targetUser', AV.Object.createWithoutData('_User', AV.User.current().id))
    query.find().then(goodslist => this.setData({
      lotteryTimes: goodslist.length
    })).catch(console.error);
  },

  //bindEnterLotteryTodayPage切换到免费抽奖页面
  bindEnterLotteryTodayPage(){
    wx.navigateTo({
      url: 'test?id=1'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.queryLotterys();
    this.queryPropertys();
  },


  //查询免费抽奖
  queryLotterys(){
    var d = new Date();
    var query = new AV.Query('Lottery');
    query.equalTo('display', display);
    query.lessThan('deadline', new Date(d.valueOf() + 24 * 60 * 60 * 1000));
    query.descending('deadline');
    query.include('targetProperty');
    query.limit(page_size);
    query.find().then(list => this.setData({
      list,
      d,
    })).catch(console.error)
  },

  //查询道具抽奖表
  queryPropertys() {
    var query = new AV.Query('Property');
    query.ascending('confi');
    query.limit(page_size);
    query.find().then(propertyList => this.setData({
      propertyList,
    })).catch(console.error);
  },

  onHide: function () {
    page_index = 0;
  },

  onUnload: function () {
    page_index = 0;
  },

  onPullDownRefresh: function () {
  },
  // 如果用户没有登录，跳转到登录页面，如果用户登录了跳转到目标页面。
  bindToTodayPage(e){
      console.log(e.currentTarget.dataset.objectid);
      var that = this;
      if (!app.globalData.hasLogin) {
        common.toLoginPage();
      } else {
          wx.navigateTo({
            url: '/pages/lottery/today/today?objectId=' + e.currentTarget.dataset.objectid,
          });
      }

  },
  //小程序切换
  bindOpenOtherProgress(e){
    console.log(e.currentTarget.dataset.objectid);
    wx.navigateToMiniProgram({
      appId: this.data.appId,
      path: 'pages/lottery/detail/detail?objectId='+e.currentTarget.dataset.objectid,
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  //查询配置confi表
  queryConfi(id){
    var that = this;
    var query = new AV.Query('Confi');
    query.get(id).then(function (confi) {
      that.setData({
        confi:confi.attributes.lotteryDisplay,
        appId:confi.attributes.targetLotteryAppId,
        times:confi.attributes.targetLotteryTimes,
      })
    }, function (error) {
      // 异常处理
    }).then(()=>{
      console.log('查询到表显示的confi为false')
      that.setTargetTo();
    });
  },

  //设置点击抽奖页面跳转小程序还是不跳转。
  setTargetTo() {
    var that = this;
    if (that.data.confi) {
      return;
    } else {
      that.setData({
        target: 'self',
      });
    }

  },
  //加载更多内容
  reFrish: function () {
    // 分页
    var query = new AV.Query('Property');
    query.ascending('confi');
    query.limit(page_size);
    query.skip(page_index * page_size);
    query.find()
         .then(results => this.setData({
            propertyList : this.data.propertyList.concat(results)
          })).catch(console.error);
  },
  onReachBottom: function () {
      page_index = ++page_index;
      this.reFrish();
  },

  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.lotterySharePage.title,
      path: app.globalData.confi.lotterySharePage.path,
      imageUrl:this.data.list[0].attributes.image.attributes.url,
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
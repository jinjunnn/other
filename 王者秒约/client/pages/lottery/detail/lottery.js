// pages/goods/goods.js
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');
var page_index = 0;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lotteryTimes:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // common.querySetting( '皮肤抽奖','抽奖需获得您的昵称和头像信息，用以在中奖名单中公布。')
    console.log(options)
    if (options) {
        this.setData({
          mode: options.mode,
        })
    } else {}

    this.queryConfi()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({ title: '皮肤抽奖'});
    var query = new AV.Query('LotteryToday');
    query.equalTo('targetUser', AV.Object.createWithoutData('_User', AV.User.current().id))
    query.find().then(goodslist => this.setData({
      lotteryTimes:goodslist.length
    })).catch(console.error);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var d = new Date()

    var query = new AV.Query('Lottery');
    query.ascending('confi');
    query.equalTo('displayOrNot', true)
    query.limit(6);
    query.find().then(goodslist => this.setData({
      goodslist
    })).catch(console.error);

    var query1 = new AV.Query('Lottery');
    query1.equalTo('display', 1);
    query1.descending('deadline');
    query1.limit(6);
    query1.find().then(list => this.setData({
      list,
      d,
    })).catch(console.error)},

  onHide: function () {
    page_index = 0;
  },

  onUnload: function () {
    page_index = 0;
  },

  onPullDownRefresh: function () {
  },

  bindOpenOtherProgress(e){
    console.log(e.currentTarget.dataset.objectid)
    wx.navigateToMiniProgram({
      appId: this.data.appId,
      path: 'pages/lottery/detail/detail?objectId='+e.currentTarget.dataset.objectid,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },

  queryConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a6492c61b69e60066f379a7').then(function (confi) {
      that.setData({
        confi:confi.attributes.lotteryDisplay,
        appId:confi.attributes.targetLotteryAppId,
        times:confi.attributes.targetLotteryTimes,
      })
    }, function (error) {
      // 异常处理
    });
  },

  reFrish: function () {
    var page_size = 6;
    // 分页
    var query = new AV.Query('Lottery');
    query.ascending('confi');
    query.equalTo('displayOrNot', true)
    query.limit(page_size);
    query.skip(page_index * page_size);
    query.find()
         .then(results => this.setData({
            goodslist : this.data.goodslist.concat(results)
          })).catch(console.error);
  },
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },

  onShareAppMessage: function () {
    return {
      path: 'pages/lottery/lottery?user=' + AV.User.current().id,
    }
  }
})
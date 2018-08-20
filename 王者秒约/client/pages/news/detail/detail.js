const Realtime = require('../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var that = this;
var app = getApp();
var tapAd = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      adid:
        [
             "adunit-86a4f45a84a32fb6",
             "adunit-7da62929ab96330e",
             "adunit-db85cdae1ddd3f47",
             "adunit-69ff9d72f129116a",
             "adunit-31353fa88f44154e",
             "adunit-edd0ea12058866ee",
             "adunit-0ec8aaa832eafb7b",
             "adunit-c928ca5d75807d18",
             "adunit-b8244d518e34e088",
             "adunit-7e3aeb3ef839ad67",
             "adunit-39c9eef96f356cea",
             "adunit-1c997317d263264a",
             "adunit-52a5303ae6e6e2bd",
             "adunit-b952bbac06c9f42d",
             "adunit-08082e6403fdfa85",
             "adunit-9a1e1be0eae20e51",
             "adunit-b5424c6694ad378d",
             "adunit-f7b0f5fcd05cb461",
             "adunit-3a4305b0dc9dca7a",
             "adunit-0235c07f0d911bab"
        ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      this.setData({
        ad : this.data.adid[15]
      })
      this.queryNews(options.objectId)
  },

  queryNews(objectId){
      var query = new AV.Query('News');
      query.include('targetUser').get(objectId).then(news => 
        this.setData({
          news
        })).catch(console.error);
  },

  bindtapAd(){
      console.log(12345)
      common.amendIntergal(20)
      common.addIntergal('观看广告', 20)
      common.sendNotice('积分中心' , '感谢您对我们广告的支持，通过点击广告，您获得了20积分。您可以通过观看您喜欢的广告来支持我们，点击广告我们将随机赠送您积分和皮肤奖励，最高可以获得888点券的皮肤。')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("我是tapad="+ tapAd)
    if (tapAd == 1) {
        this.bindtapAd()
    } else {

    }
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    tapAd = tapAd + 1;
  
  },
  //抽奖
  bindLottery(){
    wx.switchTab({
      url: '/pages/lottery/lottery'
    })
  },

  //积分夺宝
  bindIntergal(){
    wx.navigateTo({
      url: '/pages/lottery/detail/lottery'
    })

  },

  //职业代练
  bindShangfen(){
    wx.navigateToMiniProgram({
      appId: "wxc7569f6191eed045",
      path: "/pages/index/dailian/dailian",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })

  },

  //普通陪玩
  bindPeiwan(){
    wx.navigateToMiniProgram({
      appId: "wxc7569f6191eed045",
      path: "pages/index/index",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })

  },

  //皮肤销售
  bindPifu(){
    wx.navigateToMiniProgram({
      appId: "wx4996164e74b59c5c",
      path: "pages/index/index",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })
  },

  //账号交易
  bindZhanghao(){
    wx.navigateToMiniProgram({
      appId: "wx4af5627b21d7b379",
      path: "pages/trade/trade",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })
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
    return {
      title: this.data.news.attributes.title + "，点击广告赠送了我一个888点券皮肤",
      imageUrl:this.data.news.attributes.profile,
      success: function(res) {

      }
    }
  }
})
const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var page_index = 0;
var page_size = 30;
var that = this;
var coins;
var app = getApp();
//固定的费用金额为1，购买点券时，将COST赋值为价格。
var cost = 1;
//微信现金支付抽奖
var t1=0.2
//钱包余额抽奖
var t2=100000
//消费方式
var payFor;
var image;
var deadline;
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
    console.log(AV.User.current())
    common.querySettingMustTrue( '皮肤抽奖','抽奖需获得您的昵称和头像信息，用以在中奖名单中公布。')
    wx.showShareMenu({
      withShareTicket: true
    })
    deadline = new Date(options.deadline);
    console.log(options)
    var d = new Date();
    console.log(d)
    image = options.image;
    this.setData({
      options,
      d
    })

      var query = new AV.Query('LotteryGet');
      var user = AV.Object.createWithoutData('Lottery', options.objectId);
      query.equalTo('targetLottery', user);
      query.include('targetUser');
      query.descending('updatedAt')
      query.find()
            .then(comment => this.setData({ 
                   comment: comment.map(commentItem => Object.assign(commentItem.toJSON(), {
                   updatedAt: commentItem.updatedAt.toLocaleString(),
                   }))
            }))
           .catch(console.error);

  },
  bindLottery(){
    common.showModal( '您可以通过登录打卡、分享等行为随机获得幸运积分。幸运积分可以用于皮肤抽奖以及皮肤兑换。','积分不足')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({ title: '积分抽奖'});

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
      success: function(res) {
        common.addShares()
      }
    }
  }
})
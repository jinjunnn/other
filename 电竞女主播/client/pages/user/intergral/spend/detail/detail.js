const AV = require('../../../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../../../utils/av-live-query-weapp-min');
const Order = require('../../../../../model/order');
const common = require('../../../../../model/common');
var that = this;
var lucky = 2;
var confi = false;
var intergal;


Page({

  /**
   * 页面的初始数据
   */
  data: {
      orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    Intergal = results.attributes.Intergal
    console.log(Intergal)
    that.setData({
      coins:results
    })
    }, function (error) {
    // 异常处理
    console.error(error);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    intergal = results.attributes.Intergal
    that.setData({
      coins:results
    })
    }, function (error) {
    // 异常处理
    console.error(error);
    });
  },
  exchange(intergal, targetIntergalGoods){
          //修改user表，中的 intergal 数量
          common.amendIntergal(-intergal)

          // 向coins表增加一条记录
          var IntergralaExchange = AV.Object.extend('IntergralaExchange');
          var exchange = new IntergralaExchange();
          exchange.set('obtainWay','兑换');
          exchange.set('intergal',-intergal);
          exchange.set('paid', false);
          exchange.set('targetIntergalGoods', AV.Object.createWithoutData('IntergalGoods', targetIntergalGoods));
          exchange.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          exchange.save().then(function (todo) {

          }, function (error) {

          });

          common.sendNotice('积分中心' , '您好，恭喜您兑换了'+ this.data.options.title + '。请您联系客服索要。')
          wx.navigateTo({
            url: '../../../notice/notice'
          })

  },

  bindExchange: function () {
      var that = this;
      console.log(that.data.options.price)
      console.log(Number(intergal))
      if (that.data.options.price > Number(intergal)) {
      wx.showModal({
      title: '积分不足',
      content: '您有'+intergal+'积分，赶快去分享免费抽奖页面，获得更多积分吧。',
      success: function(res) {
        if (res.confirm) {
              wx.switchTab({
                url: '../../../../lottery/lottery'
              })
        } else if (res.cancel) {
        }
      }
    })
      } else {
            wx.showModal({
            title: '兑换确认',
            content: '确认使用'+this.data.options.price+'个积分兑换。',
            success: function(res) {
              if (res.confirm) {
                console.log(that.data.options.price)
                 that.exchange(that.data.options.price, that.data.options.objectId)
              } else if (res.cancel) {
              }
            }
          })
      }
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
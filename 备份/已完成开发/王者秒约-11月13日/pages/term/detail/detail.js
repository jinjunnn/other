const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var that = this;

var payFor;
var coins;
var expenses;
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
    coins = results.attributes.coins
    expenses = results.attributes.expenses
    console.log(expenses)
    that.setData({
      coins:results
    })
    }, function (error) {
    console.error(error);
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  //点击购买
  bindBuy: function () {
      var that = this;
      if (this.data.options.price > coins) {
      wx.showModal({
      title: '微信支付',
      content: this.data.options.title+'价格为'+(this.data.options.price)+'元，使用微信支付。',
      success: function(res) {
        if (res.confirm) {
          that.donateBuy()
        } else if (res.cancel) {
        }
      }
    })
      } else {
      wx.showModal({
          title: '兑换确认',
          content: this.data.options.title+'的兑换价格为'+(this.data.options.price)+'元，推荐您使用钱包余额兑换。',
          success: function(res) {
            if (res.confirm) {
               that.exchange()
            } else if (res.cancel) {
            }
          }
          })
      }
  },  
  //兑换购买
  exchange(){
          //成功后的业务逻
          this.buyRecord()
          common.amendCoins(-this.data.options.price)
          common.amendExpenses(- (-this.data.options.price))
          common.addRecord(this.data.options.title+'购买' , -this.data.options.price)
          common.sendNotice('大神团' , '恭喜您成功加入大神团，请在个人资料中完善资料，我们将尽快与您联系，遥祝您早上荣耀王者。')
          wx.navigateTo({
           url: '../../user/notice/notice'
          })
  },

  //创建购买订单
    donateBuy() {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: this.data.options.title+'购买',
      //因为，点券10个=1元  因此*10而不是*100
      amount: this.data.options.price * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //成功后的业务逻辑
        this.buyRecord()
        
        common.addRecord(this.data.options.title+'购买' , -this.data.options.price)
        common.amendExpenses(- (-this.data.options.price))
        //发送一条中奖的消息
        common.sendNotice('大神团' , '恭喜您成功加入大神团，请在个人资料中完善资料，我们将尽快与您联系，遥祝您早上荣耀王者。')
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        })         
        wx.navigateTo({
               url: '../../user/notice/notice'
        });
        setTimeout(this.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },
  //刷新订单，用户完成订单后刷新订单为“success”
  refreshOrders() {
    return new Query(Order)
      .equalTo('user', User.current())
      .equalTo('status', 'SUCCESS')
      .descending('createdAt')
      .find()
      .then(orders => this.setData({ 
        orders: orders.map(order => Object.assign(order.toJSON(), {
          paidAt: order.paidAt.toLocaleString(),
        }))
      }))
      .catch(console.error);
  },
  //增加1条购买记录
  buyRecord(){
          var TeamOrder = AV.Object.extend('TeamOrder');
          // 新建对象
          var order = new TeamOrder();
          var targetTeam = AV.Object.createWithoutData('Team', this.data.options.objectId);
          order.set('targetTeam',targetTeam);
          order.set('targetUser',AV.User.current());
          order.set('status',false)
          order.save()
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
      return this.refreshOrders().then(wx.stopPullDownRefresh);
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
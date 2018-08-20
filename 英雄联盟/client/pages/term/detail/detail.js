const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var that = this;

var payFor;
var coins;
var expenses;
var objectId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
  },

  onLoad: function (options) {
      common.querySetting( '提醒','使用此功能需获取您用户基础权限。')
      objectId = options.objectId;

  },

  onReady: function () {
      wx.setNavigationBarTitle({ title: '秒约'});
  },

  onShow: function () {
      this.queryMaster()
      this.queryComment()
  },

  queryMaster(){
      var query = new AV.Query('Team');
      query.include('targetUser').get(objectId).then( term => 
        this.setData({
          term 
        })).catch(console.error);
  },

  queryComment(){
      var query = new AV.Query('Master');
      var user = AV.Object.createWithoutData('Team', objectId);
      query.equalTo('targetTeam', user);
      query.include('targetUser');
      query.find()
     .then(teamer => this.setData({ 
         teamer: teamer.map(orderItem => Object.assign(orderItem.toJSON(), {
         updatedAt: orderItem.createdAt.toLocaleString(),
         }))
     }))
  },
  //代练订单
  bindRankBuy(){
    wx.navigateTo({
      url: '../rank/rank?title='+this.data.term.attributes.title + '&objectId=' + objectId
    })

  },
  //点击购买
  bindBuy: function () {
      var that = this;
      //由于目前用户在账户上的资金一直不可能太多，因此不做判断。
      if (this.data.term.attributes.price) {
console.log(123)

      wx.showModal({
      title: '微信支付',
      content: this.data.term.attributes.title+'价格为'+(this.data.term.attributes.price)+'元，使用微信支付。',
      success: function(res) {
        if (res.confirm) {
          that.donateBuy()
        } else if (res.cancel) {
          return false;
        }
      }
    })
      } else {
      wx.showModal({
          title: '兑换确认',
          content: this.data.term.attributes.title+'的兑换价格为'+(this.data.term.attributes.price)+'元，推荐您使用钱包余额兑换。',
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
          common.amendCoins(-this.data.term.attributes.price)
          common.amendExpenses(- (-this.data.term.attributes.price))
          common.addRecord(this.data.term.attributes.title+'购买' , -this.data.term.attributes.price)
          common.sendNotice('大神团' , '恭喜您成功加入大神团，请在个人资料中完善资料，我们将尽快与您联系，遥祝您早上荣耀王者。')
          wx.navigateTo({
           url: '../../user/notice/notice'
          })
          //发送一条sms
          this.sendSMS()
  },
  //发送短消息
  sendSMS(){
        AV.Cloud.requestSmsCode({
        mobilePhoneNumber: '18312538628',
        template: '大神团订单',
        sign:'王者秒约'
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
  },
  bindSendSMS(){
    common.sendSMS('18312538628', '客服消息')
    common.sendSMS('17704054310', '客服消息')
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
      productDescription: this.data.term.attributes.title+'购买',
      //因为，点券10个=1元  因此*10而不是*100
      amount: this.data.term.attributes.price * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //成功后的业务逻辑
        this.buyRecord()
        
        common.addRecord(this.data.term.attributes.title+'购买' , -this.data.term.attributes.price)
        common.amendExpenses(- (-this.data.term.attributes.price))
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
          var targetTeam = AV.Object.createWithoutData('Team', objectId);
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
// pages/index/detail/detail.js
const Realtime = require('../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
//  与页面信息有关
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var that = this;
var coins;
var lucky = 2;
var confi = false;



var payFor;
var cost;

var app = getApp()
const realtime = new Realtime({
 appId: 'WekN4hEaRUx0bLwhjdWqBIY8-gzGzoHsz',
 appKey: '0NT62qkoVPWSW5BKHyKVEvc1',
 region: 'cn', 
 noBinary: true,
});

var CONVERSATION_ID;
var client1;

Page({
  data: {
       multiArray:  ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜'],
  
  },
  onLoad: function (options) {
      this.setData({
        options
      })
  },

  onReady: function () {

  },

  onShow: function () {
      console.log(AV.User.current().id)
      var query = new AV.Query('Comment');
      var user = AV.Object.createWithoutData('_User', AV.User.current().id);
      query.equalTo('targetTo', user);
      query.include('targetTo');
      query.include('targetFrom');
      query.find().then(comment => this.setData({
          comment
        })).catch(console.error);
  },

  //点击购买
  bindBuy: function () {
    var that = this;
      wx.showModal({
      title: '确认下单',
      content: '确认支付用户:'+that.data.options.nickname+'的陪打订单，价格'+that.data.options.price+'元。',
      success: function(res) {
        if (res.confirm) {
          that.donate()       
        } else if (res.cancel) {
          //do something
        }
      }
    })
  },
  //确认订单
  donate() {
    var that = this;
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: this.data.options.title+"陪打订单",
      amount: this.data.options.price * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        //保存订单信息
        that.saveOrder()
        //更新record记录
        that.updateRecord()  
        wx.navigateTo({
           url: '../../user/order/order'
        })
        setTimeout(this.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },

  //更新订单
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


  //页面跳转链接，跳转到以下页面
  bindConversation(){
        var that = this;
        realtime.createIMClient(AV.User.current().id).then(function(client) {
        client1 = client;

          return client.createConversation({
            members: [that.data.options.user],
            name: 'Tom & Jerry',
            unique: true,
          });
        }).then(function(conversation) {
          CONVERSATION_ID = conversation.id
        that.closeConversation()
                })
  },

  closeConversation(){
      client1.close().then(function() {
                wx.navigateTo({
                url: '../../message/detail/detail?conversationId='+CONVERSATION_ID
                })
      })
  },


  //添加一条订单记录
  saveOrder(){

      var PlayOrder = AV.Object.extend('PlayOrder');
      var order = new PlayOrder();
      order.set('targetBuyer',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('targetSeller',AV.Object.createWithoutData('_User', this.data.options.user));
      var targetMaster = AV.Object.createWithoutData('Master', this.data.options.objectId);
      order.set('targetMaster', targetMaster);
      order.set('status','已支付');
      order.set('bindFunction','取消订单')
      //这里后续可以设置多局购买。
      order.set('times',1)
      order.set('amount',Number(this.data.options.price))
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });

  },

  //update record表
  updateRecord(){
      payFor = this.data.options.nickname;
      cost = this.data.options.price;
      this.payRecord()
  },
  //更新record表
  payRecord(){          
          var Record = AV.Object.extend('Record');
          var updateCoins = new Record();
          updateCoins.set('payFor', '陪打订单：'+payFor);
          updateCoins.set('amount',-cost);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {
          }, function (error) {
          });
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
    return this.refreshOrders().then(wx.stopPullDownRefresh);
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})
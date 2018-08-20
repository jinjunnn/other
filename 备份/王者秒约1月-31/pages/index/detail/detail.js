// pages/index/detail/detail.js
const Realtime = require('../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var that = this;
var app = getApp();
var CONVERSATION_ID;
var client;
var objectId;
var nickname;
var gamename;
var price;
var amount;
var coins;


Page({
  data: {
       multiArray: [['苹果端', '安卓端'], ['微信大区', 'QQ大区'], ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜']],
  
  },
  onLoad: function (options) {
      objectId = options.objectId;
      common.querySetting( '提醒','下单需获取您当前用户的基础权限。')
  },

  onReady: function () {
      wx.setNavigationBarTitle({ title: '陪打导师'});
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    coins = results.attributes.coins

    that.setData({
      coins:results
    })
    }, function (error) {
    });
  },

  onShow: function () {
      this.queryMaster()
      this.queryComment()
  },

  queryMaster(){
      var query = new AV.Query('Master');
      query.include('targetUser').get(objectId).then(user => 
        this.setData({
          user
        })).catch(console.error);
  },

  queryComment(){
      var query = new AV.Query('Comment');
      var user = AV.Object.createWithoutData('_User', objectId);
      query.equalTo('targetMaster', user);
      query.include('targetTo');
      query.include('targetFrom');
      query.find()
     .then(comment => this.setData({ 
         comment: comment.map(orderItem => Object.assign(orderItem.toJSON(), {
         updatedAt: orderItem.createdAt.toLocaleString(),
         }))
     }))
  },
  //点击购买
  bindBuy: function (e) {
          var that = this;
          common.addFormId(e.detail.formId)
          price = this.data.user.attributes.price;
          amount = this.data.user.attributes.price * 100;
          gamename = this.data.user.attributes.targetUser.attributes.gameName;
          nickname = this.data.user.attributes.targetUser.attributes.nickname;
          var productDescription = gamename+"陪打订单";
          if (price < coins) {
                  wx.showModal({
                    title: '确认下单',
                    content: '使用账户余额支付'+nickname+'的陪打订单，价格'+price+'元。',
                    success: function(res) {
                      if (res.confirm) {
                        that.donate2(productDescription,amount,gamename)       
                      } else if (res.cancel) {
                      }
                    }
                  })   
              return true;
          } else {
                  wx.showModal({
                    title: '确认下单',
                    content: '确认支付用户:'+nickname+'的陪打订单，价格'+price+'元。',
                    success: function(res) {
                      if (res.confirm) {
                        that.donate(productDescription,amount,gamename)       
                      } else if (res.cancel) {
                        //do something
                      }
                    }
                  })
          }

  },
  //确认订单
  donate(productDescription,amount,gamename) {
    var that = this;
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: productDescription,
      amount: amount,
      gamename:gamename,
      orderMode:0,
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
        //新增一条交易记录
        common.addRecord(nickname + '的陪打订单', -Number(price))
        //发送一条短信
        that.sendSMS()
        //expenses字段增加
        common.amendExpenses(Number(price))
        //发一条通知
        common.sendNotice(nickname , '您好，收到您的陪打订单，我的游戏昵称是'+nickname+'，请您在游戏中加我好友邀请我陪打，或者请您在个人中心-设置中设置您的正确的游戏昵称，等我加您后邀请您排位。')
        wx.navigateTo({
           url: '../../user/notice/notice'
        })
        setTimeout(that.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },

    //账户余额支付
  donate2(productDescription,amount,gamename) {
    var that = this;
        //保存订单信息
        that.saveOrder()
        //新增一条交易记录
        common.addRecord(nickname + '的陪打订单', -Number(price))
        //发送一条短信
        that.sendSMS()
        //expenses字段增加
        common.amendExpenses(Number(price))
        //修改coins数量
        common.amendCoins(-Number(price))
        //发一条通知
        common.sendNotice(nickname , '您好，收到您的陪打订单，我的游戏昵称是'+nickname+'，请您在游戏中加我好友邀请我陪打，或者请您在个人中心-设置中设置您的正确的游戏昵称，等我加您后邀请您排位。')
        wx.navigateTo({
           url: '../../user/notice/notice'
        })
  },
  //发送短消息
  sendSMS(){
        AV.Cloud.requestSmsCode({
        mobilePhoneNumber: this.data.user.attributes.targetUser.attributes.cells,
        template: '订单通知1',
        sign:'王者秒约',
        gameName: this.data.coins.attributes.gameName
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
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
  bindConversation(e){
    var that = this;
    console.log(e.detail.formId)
    common.addFormId(e.detail.formId)

    if (AV.User.current().attributes.gender >= 0) {
        console.log(this.data.user.attributes.targetUser.id)
        app.realtime.createIMClient(AV.User.current().id).then(function(user) {
        client = user;
          return client.createConversation({
            members: [that.data.user.attributes.targetUser.id],
            unique: true,
          });
        }).then(function(conversation) {
        CONVERSATION_ID = conversation.id
        that.closeConversation()
                })     
    } else {
      common.showModal('您好，聊天需要访问您的微信名和头像信息，请前往[我的]-[设置]开启权限。')
    }
  },
  closeConversation(){
          var userid = this.data.user.attributes.targetUser.id;
          var userimage = this.data.user.attributes.targetUser.attributes.image;
          var username = this.data.user.attributes.targetUser.attributes.username;
          var image=[{user:userid,name:username,image:userimage},{user:User.current().id,name:User.current().attributes.username,image:User.current().attributes.userImage}];
          var bill = AV.Object.createWithoutData('_Conversation', CONVERSATION_ID);
          bill.set('image', image);
          bill.save();
                wx.navigateTo({
                url: '../../message/detail/detail?conversationId='+CONVERSATION_ID+'&image='+userimage
                })
  },
  //添加一条订单记录
  saveOrder(){
      var PlayOrder = AV.Object.extend('PlayOrder');
      var order = new PlayOrder();
      order.set('targetBuyer',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('targetSeller',AV.Object.createWithoutData('_User', this.data.user.attributes.targetUser.id));
      var targetMaster = AV.Object.createWithoutData('Master', this.data.user.id);
      order.set('targetMaster', targetMaster);
      order.set('status','已支付');
      //这里后续可以设置多局购买。
      order.set('times',1)
      order.set('amount',Number(price))
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
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
    return {
      title: app.globalData.confi.indexDetailSharePage.title,
    }
  }
})
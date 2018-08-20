// pages/index/detail/detail.js
const Realtime = require('../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var that = this;
var app = getApp()
var CONVERSATION_ID;
var client;
var objectId;

Page({
  data: {
       multiArray:  ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜'],
  
  },
  onLoad: function (options) {
      objectId = options.objectId;

    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },

  onReady: function () {
      wx.setNavigationBarTitle({ title: '秒约'});
      this.queryMaster()
  },

  onShow: function () {

  },

  queryMaster(){
      var query = new AV.Query('Master');
      query.include('targetUser').get(objectId).then(user => this.setData({
          user
        })).catch(console.error);
  },
  updateComment: function(e) {
    this.setData({
      comment: e.detail.value
    })
  },

    //Notice添加一条通知from 是通知人，targetuser是被通知人，message是消息内容。
  sendNotice(from , message){
      var Notice = AV.Object.extend('Notice');
      var order = new Notice();
      order.set('targetUser',AV.Object.createWithoutData('_User', this.data.user.attributes.targetUser.id ));
      order.set('From', from);
      order.set('message',message);
      order.save()
           .then(function (todo) {
            });
  },

  bindAgree(){
    var that = this;
    that.sendNotice('秒约团队' , '恭喜您通过大神认证，您可以接受用户的订单来赚钱啦。请准确设置您的区服信息，游戏中不要设置禁止添加好友，下单用户会直接加你游戏好友，与您排位。' )
    that.sendSMS('成功认证通知')
    var query = new AV.Query('Master');
    query.get(objectId)
         .then(function(query){
            query.set('status', 3);
            query.save();
         })
    //放一个云函数去修改用户的pass字段为true
        var paramsJson = {
          userId: this.data.user.attributes.targetUser.id,
          status: true
        };
        AV.Cloud.run('updateMasterPass', paramsJson).then(function(data) {
          console.log(data)
        }, function(err) {
          console.log(data)
        });
    wx.navigateBack({ delta: 1})
  },
  //发送短消息
  sendSMS(status,others){
        AV.Cloud.requestSmsCode({
        mobilePhoneNumber: this.data.user.attributes.targetUser.attributes.cells,
        template: status,
        others: others,
        sign:'王者秒约'
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
  },
  bindDisagree(){
    var that = this;
    console.log(that.data.comment)
    //发送一条通知
    that.sendNotice('秒约团队' , that.data.comment)
    that.sendSMS('认证失败通知',that.data.comment)
    var query = new AV.Query('Master');
    query.get(objectId)
         .then(function(query){
            query.set('status', 4);
            query.save();
    })
    wx.navigateBack({
      delta: 1
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

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})
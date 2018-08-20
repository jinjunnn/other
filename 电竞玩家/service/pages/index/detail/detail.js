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
       tags:["技术流","带飞","连麦打"],
  },
  onLoad: function (options) {
      objectId = options.objectId;
      this.setData({
        confi:app.globalData.confi.detailDisplay
      })
  },

  onReady: function () {
      wx.setNavigationBarTitle({ title: '陪打导师'});
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
  bindBuy(){

  },
  bindgetuserinfo(e){
    console.log(e)
    console.log(AV.User.current())
    if (e.detail.userInfo) {
      if (!AV.User.current()) {
        app.login()
        wx.showLoading({
          title: '登录中',
        })
        setTimeout(function(){
          wx.hideLoading()
          wx.navigateTo({
          url: './order/order?objectId='+ objectId
        })    
        },2000)
      } else {
          wx.navigateTo({
          url: './order/order?objectId='+ objectId
        })        }
        
    } else {
        console.log('用户未授权')
    }
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
      common.showModal('您好，聊天需要访问您的微信名和头像信息，请前往[我的]-[设置]开启微信名和头像的使用权限。')
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
  bindFalse(){
     common.showModal('打手的游戏Id:V-for-Vandetta', '确定')
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
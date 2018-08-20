// pages/message/detail/detail.js
const Realtime = require('../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../utils/av-live-query-weapp-min');
const { User } = require('../../../utils/av-live-query-weapp-min');
//用于储存conversation
var room;
// 每个客户端自定义的 id
var client;
var messageIterator;



var chatRoom;
var app = getApp();
var CONVERSATION_ID;
var messages;
var inputContent;

Page({

  data: {
      content: '',
      scrollTop: 999999,
  },
  onLoad: function (options) {
     CONVERSATION_ID = options.conversationId;
      this.setData({
         options,
         user: User.current(),
      })
  },

  onReady: function () {



  },
  bindSendMessage: function(){
    if (!inputContent) {

    } else {
      chatRoom.send(new TextMessage(inputContent));
      messages.push({from:AV.User.current().id,text:inputContent})
      console.log(messages)
      this.setData({
        content:'',
        messages
      })
    }

  },

  updateContent({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    inputContent = value;
    this.setData({
      content: value
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var that = this;
      app.realtime.createIMClient(AV.User.current().id)
          .then(function(client) {
             return client.getConversation(CONVERSATION_ID);
          })
          .then(function(conversation) {
              chatRoom = conversation;
              conversation.on('message',(message)=>{
                   chatRoom.queryMessages({
                    limit: 200,
                  })
                  .then(function(message) {
                    messages = message;
                    that.setData({
                        messages
                  })
              });
              });
              conversation.queryMessages({
                    limit: 200, // limit 取值范围 1~1000，默认 20
              })
              .then(function(message) {
                    messages = message;
                    that.setData({
                        messages
                    })
              });

          })
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
// const LiveReload ={
//   client:null,
//   logout: function(){
//     if(this.client){
//       this.client.close()
//       this.client = null;
//     }
//   },
//   login: function(){
//     if(this.client && this.client.id === AV.User.current().id)
//       return Promise.resolve(this.client)
//       return realtime.createIMClient(AV.User.current().id).then
//       (function(client){
//         this.client = client
//         return client
//       }.bind(this))
//   }
// }
// var that = this;
// LiveReload.login(AV.User.current().id)
// .then(client => client.getConversation(CONVERSATION_ID)
//     .then(conversation => {
//     chatRoom = conversation;
//     chatRoom.on('message',()=>{
//       console.log('有反馈');
//     });
//     chatRoom.queryMessages({
//     limit: 100, // limit 取值范围 1~1000，默认 20
//     })
//         .then(function(messages) {
//         var messagess = messages;
//         that.setData({
//         messagess})
//         });
//     })
// )
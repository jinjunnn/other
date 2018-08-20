// pages/message/detail/detail.js
const Realtime = require('../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../utils/av-live-query-weapp-min');

//用于储存conversation
var room;
// 每个客户端自定义的 id
var clientId = "LeanCloud";
var client;
var inputContent;
var messageIterator;
var CONVERSATION_ID ="59fa383c5b90c830ff7a4d0b";
var chatRoom;

var app = getApp()

const realtime = new Realtime({
 appId: 'WekN4hEaRUx0bLwhjdWqBIY8-gzGzoHsz',
 appKey: '0NT62qkoVPWSW5BKHyKVEvc1',
 region: 'cn', 
 noBinary: true,
});

const LiveReload ={
  client:null,
  logout: function(){
    if(this.client){
      this.client.close()
      this.client = null;
    }
  },
  login: function(){
    if(this.client && this.client.id === AV.User.current().id)
      return Promise.resolve(this.client)
      return realtime.createIMClient(AV.User.current().id).then
      (function(client){
        this.client = client
        return client
      }.bind(this))

  }
}

Page({

  data: {
      content: '',

  },
  onLoad: function (options) {
            var that = this;
            LiveReload.login(AV.User.current().id)
            .then(client => client.getConversation(CONVERSATION_ID)
                .then(conversation => {
                chatRoom = conversation;
                chatRoom.on('message',()=>{
                  console.log('有反馈');
                });
                chatRoom.queryMessages({
                limit: 100, // limit 取值范围 1~1000，默认 20
                })
                    .then(function(messages) {
                    var messagess = messages;
                    that.setData({
                    messagess})
                    });
                })
            )
  },

  onReady: function () {


  },
  bindSendMessage: function(){
      chatRoom.send(new TextMessage(inputContent));
      this.setData({content:''})
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
        realtime.createIMClient('Jerry').then(function(jerry) {
          jerry.on('message', function(message, chatRoom) {
            console.log('Message received: ' + message.text);
          });
        }).catch(console.error);
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


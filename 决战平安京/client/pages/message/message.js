const Realtime = require('../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../utils/av-live-query-weapp-min');


var app = getApp();
var member=[];


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },


  onLoad: function (options) {
       this.setData({
        me:AV.User.current()
      })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({ title: '消息'});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
        var that = this;
        app.realtime.createIMClient(AV.User.current().id)
                .then(function(client) {
                 client.getQuery()
                       .containsMembers([AV.User.current().id])
                       .withLastMessagesRefreshed(true)
                       .exists('lm')
                       .find()
                       .then(function(conversations) {
                        member= [];
                        console.log(conversations)
                        conversations.map(function(conversation) {
                         var today=new Date()
                         var updateDate = conversation.lastMessage.updatedAt;
                          if ((today.getMonth()==updateDate.getMonth())&&(today.getDate()==updateDate.getDate())) {
                              member.push([conversation.members,conversation.id,conversation.lastMessage,conversation._attributes.image,conversation.lastMessage.updatedAt.toLocaleTimeString(),conversation.unreadMessagesCount,AV.User.current().id])
                          } else {
                              member.push([conversation.members,conversation.id,conversation.lastMessage,conversation._attributes.image,conversation.lastMessage.updatedAt.toLocaleDateString(),conversation.unreadMessagesCount,AV.User.current().id])
                          }
                        }).then(
                            that.setData({
                              member: member
                            })
                        )
                })
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
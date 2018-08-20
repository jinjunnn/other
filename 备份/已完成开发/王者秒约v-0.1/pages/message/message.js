const Realtime = require('../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../utils/av-live-query-weapp-min');

const realtime = new Realtime({
      appId: 'WekN4hEaRUx0bLwhjdWqBIY8-gzGzoHsz',
      appKey: '0NT62qkoVPWSW5BKHyKVEvc1',
      region: 'cn', 
      noBinary: true,
      });
var member=[];


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },


  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
        var that = this;
        realtime.createIMClient(AV.User.current().id)
                .then(function(client) {
                 client.getQuery()
                       .containsMembers([AV.User.current().id])
                       .find()
                       .then(function(conversations) {

                        conversations.map(function(conversation) {
                          console.log(conversation)
                          member.push([conversation.members,conversation.id])
                        }).then(
                            that.setData({
                              member:member
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
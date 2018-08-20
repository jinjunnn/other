const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  queryMaster(){
    var topicQuery = new AV.Query('LotteryGet');
    topicQuery.descending('createdAt');
    topicQuery.equalTo('paid',false);
    topicQuery.include('targetUser');
    topicQuery.include('targetLottery');
    topicQuery.find().then(topicList => this.setData({
      topicList
    })).catch(console.error);
  },

  bindSubmit(event){
    wx.showModal({
      title: '提示',
      content: '是否已经赠送？',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.user)
          var bill = AV.Object.createWithoutData('LotteryGet', event.currentTarget.dataset.user);
          bill.set('paid', true);
          bill.save();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindCopyName(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.user,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            common.showTip('已复制')
          }
        })
      }
    })
  },
  
  bindCopyWeChatID(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.user,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            common.showTip('已复制')
          }
        })
      }
    })
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
      this.queryMaster()
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
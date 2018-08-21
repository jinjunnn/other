const AV = require('../../../../utils/av-live-query-weapp-min');
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  bindSetAccount(){
      var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
      todo.set('account', this.data.account);
      todo.set('name', this.data.name)
      todo.save();
      wx.showToast({
      title: '绑定成功',
      icon: 'success',
      duration: 2000
    })
      wx.navigateTo({
          url: '../detail/detail'
        })

  },
  bindAccountInput: function(e) {
    this.setData({
      account: e.detail.value
    })
  },
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
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
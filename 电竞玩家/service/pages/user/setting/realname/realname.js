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
  console.log(options)
  this.setData({
    info:options,
  })
  },
  setNickName(e){
          console.log(this.data.info.key)
          var that = this;
          var query = new AV.Query('_User');
          query.get(AV.User.current().id)
             .then(function (todo) {
                console.log(todo)
                todo.set(that.data.info.key, e.detail.value);
                todo.save()
             .then(() => {
                  wx.navigateBack({
                    delta: 1
                  })
              })
             .catch(function(error) {
                // catch 方法写在 Promise 链式的最后，可以捕捉到全部 error
                console.error(error);
              })
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
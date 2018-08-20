const AV = require('../../../utils/av-live-query-weapp-min');
var address = '';
var coins= 7

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
  //申请取现
  bindWithdrawals(){
    if (!this.data.user.attributes.account) {      
        wx.navigateTo({
          url: './account/account'
        })
      } 
      else {
        
        wx.navigateTo({
          url: "./detail/detail"
        })
      }
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
      var query = new AV.Query('_User');
    query.get(AV.User.current().id)
         .then(user => 
              this.setData({
                  user:user,
                  coins:user.attributes.coins.toFixed(2)
            })
      ).catch(console.error);

    var query = new AV.Query('Record');
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    query.descending('createdAt')
    query.equalTo('targetUser', user);
    query.limit(100);
    query.find().then(records => this.setData({
      records
    })).catch(console.error);
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
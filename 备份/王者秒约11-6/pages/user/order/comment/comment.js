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
          this.setData({
            options
          })
  },

  bindSubmit(){
          var  Comment= AV.Object.extend('Comment');
          var comment = new (Comment);
          comment.set('targetFrom',AV.Object.createWithoutData('_User', this.data.options.from));
          comment.set('targetTo',AV.Object.createWithoutData('_User', this.data.options.to));

          comment.set('comment',this.data.comment);

          comment.save()
          this.amendStasus()


          wx.navigateBack({
            delta: 1
          })
  },

  bindInput({
          detail: {
            value
          }
          }) {
            // Android 真机上会诡异地触发多次时 value 为空的事件
            if (!value) return;
            this.setData({
              comment: value
            });
  },
  amendStasus(){
          var bill = AV.Object.createWithoutData('PlayOrder', this.data.options.objectId);
          bill.set('status', '已完成');
          bill.set('bindFunction','已完成')
          bill.save();
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
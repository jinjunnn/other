// pages/user/profile/profile.js
const AV = require('../../../utils/av-live-query-weapp-min');
var url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSummary: '', 
    mobilePhoneNumber: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (user) {
       that.setData({
        user:user,
       })

  }, function (error) {
    // 异常处理
  });
  },
  upImg: function () {
         var that = this;
         wx.chooseImage({
         count: 1,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success: function(res) {
                  var tempFilePath = res.tempFilePaths[0];
                  new AV.File('filename', {
                  blob: {
                  uri: tempFilePath,
                  },
        }).save().then(file =>that.setData({image:file.url()})).then(that.updateUrl()).catch(console.error);
        }
        });
  },

  updateUrl(){
        var that = this;
        var image = AV.Object.createWithoutData('_User', AV.User.current().id);
        image.set('userImage', that.image);
        image.save();
  },
  updateUserSummary({
    detail: {
      value
    }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      userSummary: value
    });
  },
 upMobilePhoneNumber({
    detail: {
      value
    }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      mobilePhoneNumber: value
    });
  },

  updateSummary() {
  var summary = AV.Object.createWithoutData('_User', AV.User.current().id);
  // 修改属性
  summary.set('userSummary', this.data.userSummary);
  // 保存到云端
  summary.save();
  },
  updateMobilePhoneNumber() {
  var mobilePhoneNumber = AV.Object.createWithoutData('_User', AV.User.current().id);
  // 修改属性
  mobilePhoneNumber.set('mobilePhoneNumber', this.data.mobilePhoneNumber);
  // 保存到云端
  mobilePhoneNumber.save();
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
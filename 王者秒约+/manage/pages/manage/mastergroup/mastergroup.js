                                      // pages/publish/publish.js
const AV = require('../../../utils/av-live-query-weapp-min');
var common = require('../../../model/common');
const Order = require('../../../model/order');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');

var coins;

Page({

  data: { 
    images:[],
    title: '', 
    content: '', 
  },

  onLoad: function (options) {

  },
  //上传照片
  upImg: function () {
         var that = this;
         wx.chooseImage({
         count: 9,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success: function(res) {
                  var tempFilePath = res.tempFilePaths[0];
                  res.tempFilePaths.map(tempFilePath => () => new AV.File('filename', {
                  blob: {
                  uri: tempFilePath,
                  },
        }).save()).reduce(
        (m, p) => m.then(v => AV.Promise.all([...v, p()])),
        AV.Promise.resolve([])
        ).then(files => that.setData({images:files.map(file => file.url())})).catch(console.error);
        }
        });
  },

  //提交储存信息
  submitTap() {
  var that = this;
    if (!this.data.images) {

    }
        else {
          var confi = AV.Object.createWithoutData('Confi', '5a6492c61b69e60066f379a7');
          confi.set('gameGroupRQImage', this.data.images);
          confi.save();
      }
  },

  onReady: function () {
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    coins = results.attributes.coins;
    that.setData({
      coins:results
    })
    }, function (error) {
    });
  },

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
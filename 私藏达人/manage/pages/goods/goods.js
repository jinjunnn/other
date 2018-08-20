// pages/publish/publish.js
const AV = require('../../utils/av-live-query-weapp-min');
const Goods = require('../../model/goods');
var common = require('../../model/common');

var that = this;


Page({

  data: {
    height: 20,
    images: [],
    article: [],
    title: '',
    summary: '',
    what: '',
    why: '',
    editDraft: null,
  },

  onLoad: function (options) {
 
  },
  //图片部署在leancloud上传照片
  upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0];
        res.tempFilePaths.map(tempFilePath => () => new AV.File('filename', {
          blob: {
            uri: tempFilePath,
          },
        }).save()).reduce(
          (m, p) => m.then(v => AV.Promise.all([...v, p()])),
          AV.Promise.resolve([])
          ).then(files => that.setData({ images: files.map(file => file.url()) })).catch(console.error);
      }
    });

  },
  
  //提交储存信息
  submitTap() {
    var summary = this.data.summary
    var images = this.data.images
    var title = this.data.title
    var content = this.data.content 
    var price = this.data.price       

    if (!title) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!content) {
      common.showTip("内容不能为空", "loading");
    }
    else if (!images) {
      common.showTip("请上传图片", "loading");
    }
    else {
      new Goods({
        summary: summary,
        title: title,
        images: this.data.images,
        content:content,
        price:Number(price),

      }).save().then((article) => {
        try {
          wx.removeStorageSync('images')
        } catch (e) {
          // Do something when catch error
        }
        wx.reLaunch({
          url: '../index/index'
        })
      }
        ).catch(console.error);

    }
  },
  updatePrice({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      price: value
    });
  },
  updateSummary({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      summary: value
    });
  },
  updateContent({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      content: value
    });
  },
  updateTitle({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      title: value
    });
  },
  updatePrice({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      price: value
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })

    i = e.detail.value
  },
  onReady: function () {

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
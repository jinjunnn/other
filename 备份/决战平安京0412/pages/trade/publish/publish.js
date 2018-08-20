// pages/publish/publish.js
const AV = require('../../../utils/av-live-query-weapp-min');
var common = require('../../../model/common');
var Trade = require('../../../model/trade');

Page({

  data: { 
    images:[],
    title: '', 
    content: '', 
  },

  onLoad: function (options) {

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
  var content = this.data.content
  var title = this.data.title
  var images = this.data.images
  var price = Number(this.data.price)
  var cells = this.data.cells
    if (!title) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!content) {
      common.showTip("内容不能为空", "loading");
    }
    else if (!price) {
      common.showTip("价格不能为空", "loading");
    }
    else if (!images) {
      common.showTip("请上传图片", "loading");
    }
    else {
  new Trade({ 
        price:price, 
        content: content, 
        title: title, 
        images: images,
        status: 1,
        cells: cells,
        targetUser:AV.User.current(),
  }).save().then((article) => {
        wx.navigateBack({
          delta: 1
        })
  }
  ).catch(console.error);

  }
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
// pages/publish/publish.js
const AV = require('../../utils/av-live-query-weapp-min');
const Article = require('../../model/article');
var common = require('../../model/common');
Page({

  data: { 
    height: 20, 
    images:[], 
    article:[], 
    title: '', 
    summary: '', 
    what: '',
    why: '',
    editDraft: null, },

  onLoad: function (options) {
  
  },
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
  navLikesPage(){
        //上传文件信息，上传图片的时候创建一个Article实例，返回实例，在此上传其他信息到该实例。

  },

  submitTap() {
  var title = this.data.title 
  var summary = this.data.summary
  var what = this.data.what
  var why = this.data.why
  var address =this.data.address
  var cell = this.data.cell 
  var geo = this.data.geo
  var likes = this.data.likes 
  var openTime = this.data.openTime
    if (!title) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!summary) {
      common.showTip("内容不能为空", "loading");
    }
    else {
  //这里可以用于设置上传的文章是私密文章还是公开文章。,设置这个，需要在下面文档的save前，加入.setACL(acl) // var
  // acl = new AV.ACL(); // acl.setPublicReadAccess(false); //
  // acl.setPublicWriteAccess(false); //
  // acl.setReadAccess(AV.User.current(), true); //
  // acl.setWriteAccess(AV.User.current(), true); 
  new Article({ 
        address:address, 
        cell:cell, 
        geo:geo, 
        likes:0, 
        openTime: openTime,
        summary: summary, 
        title: title, 
        what: what, 
        why: why, 
        images: this.data.images,
        targetUser:AV.User.current(),
  }).save().then((article) => {
        wx.navigateTo({
          url: '../list/article/article'
        })
  }
  ).catch(console.error);

  }
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
  updateWhy({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      why: value
    });
  },
  updateWhat({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      what: value
    });
  },
    updatePhoneNumber({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      cell: value
    });
  },
  updateOpenTime({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      openTime: value
    });
  },
  updatePlace({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      address: value
    });
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
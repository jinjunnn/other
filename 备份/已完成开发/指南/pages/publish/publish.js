// pages/publish/publish.js
const AV = require('../../utils/av-live-query-weapp-min');
const Article = require('../../model/article');
var common = require('../../model/common');
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')


var title;
var city;
var district;
var address;
var lat;
var lng;

Page({

  data: { 
    height: 20, 
    images:[],
    article:[], 
    title: '请输入地点', 
    summary: '', 
    what: '',
    why: '',
    editDraft: null, },

  onLoad: function (options) {
    title = options.title;
    city = options.city;
    district = options.district;
    address = options.address;
    lat = options.lat;
    lng = options.lng;
        this.setData({
          title: options.title
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
  upImg2: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
  
        success: function (res) {
        util.showBusy('正在上传')
        var tempFilePaths = res.tempFilePaths;
        var images = new Array();      
        var imgLength = tempFilePaths.length;
        if (imgLength > 0){
          var j= 0;
          for (var i = 0; i < imgLength; i++){
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = extension;//上传的图片的别名      
            wx.uploadFile({
              url: config.service.uploadUrl,
              filePath: tempFilePaths[i],
              name: 'file',

              success: function (res) {
                util.showSuccess('上传图片成功')
                res = JSON.parse(res.data)
                var url = res.data.imgUrl
                images.push({"url":url});
                j++;
                that.setData({
                   images
                })
              },

              fail: function (e) {
                util.showModel('上传图片失败')
              }
            })
          }
        }
      },
      fail: function (e) {
        console.error(e)
      }
    })
  },


  //切换输入标题的页面
  openMap(){
    wx.navigateTo({
      url: '../publish/map/map'
    })
  },
  //提交储存信息
  submitTap() {
  var summary = this.data.summary
  var what = this.data.what
  var why = this.data.why
  var cell = this.data.cell 
  var likes = this.data.likes 
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
        lat: lat,
        lng: lng,
        city: city,
        district: district,
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
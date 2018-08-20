// pages/publish/publish.js
const AV = require('../../utils/av-live-query-weapp-min');
const Article = require('../../model/article');
var common = require('../../model/common');
var app = getApp()

var title = "请输入地址";
var that= this;
var city;
var images;
var district;
var address;
var lat;
var lng;
var i;

Page({

  data: { 
    height: 20, 
    images:[],
    article:[], 
    title: title, 
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
        // this.setData({
        //   title:title,
        //   topic:topic
        // });
  },
  //图片部署在leancloud上传照片
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
  //切换输入标题的页面
  openMap(){
    wx.navigateTo({
      url: '../article/map/map'
    })
  },

  //提交储存信息
  submitTap() {
  var summary = this.data.summary
  var what = this.data.what
  var why = this.data.why
  var cell = this.data.cell 
  var likes = this.data.likes 
  var images = this.data.images
  var targetUser = this.data.topicList[i].attributes.user.id
  var targetTopic = this.data.topicList[i].id


    if (!title) {
      common.showTip("地点不能为空", "loading");
    }
    else if (!summary) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!images) {
      common.showTip("请上传图片", "loading");
    }
    else {
  new Article({ 
        address:address, 
        cell:cell, 
        lat: Number(lat),
        lng: Number(lng),
        city: city,
        district: district,
        likes:0, 
        summary: summary, 
        title: title, 
        what: what, 
        why: why, 
        images: this.data.images,
        targetUser:AV.Object.createWithoutData('User',targetUser),
        targetTopic:AV.Object.createWithoutData('Topic',targetTopic),
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
   bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    
    i = e.detail.value
  },
  onReady: function () {
        that = this;
          var topicQuery = new AV.Query('Topic');
          topicQuery.descending('read');
          topicQuery.find().then(topicList => this.setData({
            topicList
          })).catch(console.error);
          this.setData({
          title:title,
        });


  },

  onShow: function () {

      try {
        var value = wx.getStorageSync('images')
        if (value) {
        images = value
        console.log('1'+value)
        }
      } catch (e) {
        // Do something when catch error
      }
      this.setData({
      images: images
    });
    try {
      wx.setStorageSync('images', null)
           this.setData({
             images: null
           });  
    } catch (e) {
    }
  

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {


    try {
      wx.setStorageSync('images', this.data.images)
    } catch (e) {
    }
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    try {
      wx.setStorageSync('images', null)
    } catch (e) {
    }
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
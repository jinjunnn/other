                                      // pages/publish/publish.js
const AV = require('../../utils/av-live-query-weapp-min');
var common = require('../../model/common');
const Order = require('../../model/order');
const Shop = require('../../model/shop');
const { User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');

var coins;

Page({

  data: { 
    image:[],
    name: '', 
    content: '', 
    location: '', 
  },

  onLoad: function (options) {

  },

  newShop(){
    var that = this;
    var query = new AV.Query('Shop');
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    query.equalTo('targetUser', user);
    query.count().then(function (count) {
        if (count===0) {
              var Shop = AV.Object.extend('Shop');
              var shop = new Shop();
              shop.set('targetUser',AV.User.current())
              shop.save()
                    .then(function (shop) {
                        that.queryShop()
                      });
        } else {
              that.queryShop()
        }
    });
  },

  queryShop(){
      var query = new AV.Query('Shop');
      var user = AV.Object.createWithoutData('_User', AV.User.current().id);
      query.equalTo('targetUser', user);
      query.first().then(shop => 
        this.setData({
          shop
        })
      ).catch(console.error);
  },

  updateName({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      name: value
    });
  },

  updateLocation({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      location: value
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

  updateAmount({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      amount: value
    });
  },
  //上传照片
  upImg1: function () {
         var that = this;
         wx.chooseImage({
         count: 1,
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
        ).then(files => that.setData({image:files.map(file => file.url())})).catch(console.error);
        }
        });
  },

  //提交储存信息
  submitTap(name, subname, images1, images2, images3, content, price1, price2, brand, amount) {

          var shop = AV.Object.createWithoutData('Shop', this.data.shop.id);
          shop.set('name', this.data.name);
          shop.set('location', this.data.location);
          shop.set('image', this.data.image);
          shop.set('content', this.data.content);
          shop.set('status', false);
          shop.save();

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
    this.newShop()
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
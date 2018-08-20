// pages/publish/map/map.js

const AV = require('../../../utils/av-live-query-weapp-min');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
const Article = require('../../../model/article');
var common = require('../../../model/common');
var qqmapsdk;
var address;
var city;


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
    qqmapsdk = new QQMapWX({
      key: 'RFIBZ-C7TAF-AGUJP-NLTDX-2WAQH-7OBMD'
    });
    qqmapsdk.reverseGeocoder({
      success: function(res) {
          city = res.result.address_component.city;
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  updateTitle({
    detail: {
      value
    },
  }) {

    if (!value) return;
    qqmapsdk.getSuggestion({
    keyword: value,
    region: city,
    region_fix: '0',
    success: function (res) {
      console.log(res.data);
      address = res;
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
    }
  })
  this.setData({
    addresses: address.data
  });

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
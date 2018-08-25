// pages/publish/map/map.js

const AV = require('../../../utils/av-live-query-weapp-min');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
// const Article = require('../../../model/article');
// var common = require('../../../model/common');
var qqmapsdk;
var address;
var city;

let plugin = requirePlugin("myPlugin");
let routeInfo = {
  startLat: 39.90469, //起点纬度 选填
  startLng: 116.40717, //起点经度 选填
  startName: "我的位置", // 起点名称 选填
  endLat: 39.94055, // 终点纬度必传
  endLng: 116.43207, //终点经度 必传
  endName: "来福士购物中心", //终点名称 必传
  mode:"car" //算路方式 选填
};

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
        console.log(res)
          city = res.result.address_component.city;
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //返回数据
  bindTransItem(e){
        let pages = getCurrentPages(); //当前页面
        let prevPage = pages[pages.length - 2]; //上一页面
        prevPage.setData({ //直接给上移页面赋值
          item: e.currentTarget.dataset.item,
          selAddress: 'yes'
        });
        wx.navigateBack({ //返回
          delta: 1
        })
  },



  //查询数据
  updateTitle({
    detail: {
      value
    },
  }) {
    if (!value) return;
    this.setData({
      title: value
    });
    let that = this;
    qqmapsdk.getSuggestion({
    keyword: value,
    region: city,
    region_fix: '0',
    success: function (res) {
      console.log(res.data)
        that.setData({
          addresses: res.data
        });
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
    }
  })


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
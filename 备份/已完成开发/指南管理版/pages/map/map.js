// pages/map/map.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'RFIBZ-C7TAF-AGUJP-NLTDX-2WAQH-7OBMD'
    });
  },
  onShow: function () {

    // 调用接口
    qqmapsdk.getSuggestion({
      keyword: '技术',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });


  },
})

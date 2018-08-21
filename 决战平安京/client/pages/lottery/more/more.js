const AV = require('../../../utils/av-live-query-weapp-min');
var page_index = 0;
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
    var d = new Date()
    var query1 = new AV.Query('Lottery');
    query1.equalTo('display', 1);
    query1.descending('deadline');
    query1.limit(6);
    query1.find().then(list => this.setData({
      list,
      d,
      options,
    })).catch(console.error);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({ title: '每日限免皮肤抽奖'});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  onHide: function () {
    page_index = 0;
  },
  onUnload: function () {
    page_index = 0;
  },
  onPullDownRefresh: function () {
  },
  reFrish: function () {
    var page_size = 6;
    // 分页
    var query = new AV.Query('Lottery');
    query.equalTo('display', 1);
    query.descending('deadline');
    query.limit(page_size);
    query.skip(page_index * page_size);
    query.find()
         .then(results => this.setData({
            list : this.data.list.concat(results)
          })).catch(console.error);
  },
  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
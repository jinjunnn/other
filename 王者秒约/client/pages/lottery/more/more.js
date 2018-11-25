const AV = require('../../../utils/av-live-query-weapp-min');
var page_index = 0;
var page_size = 6;
var d = new Date();
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

    var query1 = new AV.Query('Lottery');
    query1.equalTo('display', 0);
    query1.lessThan('deadline', new Date(d.valueOf() + 24 * 60 * 60 * 1000));
    query1.descending('deadline');
    query1.include('targetProperty');
    query1.limit(page_size);
    query1.find().then(list => this.setData({
      list,
      d,
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
 
    // 分页
    var query = new AV.Query('Lottery');
    query.equalTo('display', 0);
    query.lessThan('deadline', new Date(d.valueOf() + 24 * 60 * 60 * 1000));
    query.descending('deadline');
    query.limit(page_size);
    query.include('targetProperty');
    query.skip(page_index * page_size);
    query.find()
         .then(results => this.setData({
            list : this.data.list.concat(results)
          })).catch(console.error);
  },
  onReachBottom: function () {
      console.log(page_index);
      page_index = ++page_index;
      console.log(page_index);
      this.reFrish();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: 'pages/lottery/lottery?user=' + AV.User.current().id
    }
  }
})
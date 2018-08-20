// pages/user/coins/coins.js
const AV = require('../../../utils/av-live-query-weapp-min');
var that = this;
var coins;
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

    var query = new AV.Query('Coins');
    query.descending('updatedAt');
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    query.equalTo('targetUser', user);
    query.count().then(function (count) {
        if (count===0) {
              var Coins = AV.Object.extend('Coins');
              var coins = new Coins();
              coins.set('amount',50);
              coins.set('obtainWay','注册')
              coins.set('targetUser',AV.User.current())
              coins.save().then(function () {

                      var queryUser = new AV.Query('_User');
                      queryUser.get(AV.User.current().id).then(function (results) {
                      coins = results.get('coins');
                      //其他地方，下面的coins变量使用sum
                      var sum = coins + 50;
                      var coinAtUser = AV.Object.createWithoutData('_User', AV.User.current().id);
                         coinAtUser.set('coins', coins);
                         coinAtUser.save().then(coins => this.setData({
                          coins
                        }));
                      }, function (error) {
                        console.error(error);
                      });
              }, function (error) {
                console.error(error);
              });
        } else {
        }
    });

    query.find().then(coinslist => this.setData({
      coinslist
    })).catch(console.error);

  },

  onReady: function () {

  var that = this;


  var query = new AV.Query('_User');
  query.get(AV.User.current().id).then(function (results) {
    that.setData({
      coins:results
    })
  }, function (error) {
    // 异常处理
    console.error(error);
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
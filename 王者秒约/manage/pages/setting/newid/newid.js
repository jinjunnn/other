const AV = require('../../../utils/av-live-query-weapp-min');
var common = require('../../../model/common');
const Order = require('../../../model/order');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');

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


  },
  bindConfirm(){
    var that = this;
    wx.showModal({
      title: '警告!',
      content: '此操作，将修改中奖表的数据，请确认后再进行修改。',
      success: function (res) {
        if (res.confirm) {
          that.newId()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //云函数批量更新用户数据
  newId(){
        var paramsJson = {
          id: 136000
        };
        AV.Cloud.run('addUserId', paramsJson).then(function(data) {
          console.log(data)
        }, function(err) {
          console.log(data)
        });
  },
  

  //测试获取二维码
  getQRCode(){
        var paramsJson = {
          paths:'pages/index/index',
          scene:null,
        };

        AV.Cloud.run('sendQRCode', paramsJson).then(function(data) {
          console.log(data)
        }, function(err) {
          console.log(data)
        });
  },



  //批量更新用户数据
  bindBandUpdateData(){
      var query = new AV.Query('Master');
      query.notEqualTo('mode',3);
      query.limit(1000);
      query.find().then(function (results) {
        console.log(results.length)
          results.forEach(function(result) {
            result.set('mode', 3);
          });
          return AV.Object.saveAll(results);
        }).then(function(results) {

      }, function (error) {
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
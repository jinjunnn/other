const AV = require('../../../utils/av-live-query-weapp-min');
var common = require('../../../model/common');
const Order = require('../../../model/order');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
var lottery;
var lotteryNew;

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
  },

  bindSendMessage(){
      var that =this;
      var query = new AV.Query('Lottery');
      query.exists('deadline');
      query.limit(2)
      query.descending('createdAt')
      query.find().then(function (results) {
        lotteryNew = results[0].attributes.title+results[0].attributes.content;
        lottery = results[1].attributes.title+results[1].attributes.content;
        console.log(lottery)
        console.log(lotteryNew)
        // results 返回的就是有图片的 Todo 集合
      }, function (error) {
      });

      wx.showModal({
        title: '确认',
        content: '确认发布1000条模板消息',
        success: function(res) {
          if (res.confirm) {
           that.sendTemplateMessage(lotteryNew,lottery)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },
  //云函数调用批量的发模板消息
  sendTemplateMessage(lotteryNew,lottery){
        var that = this;
        var date = new Date(); 
        date.setDate(date.getDate()-7);
        console.log(date)
        var paramsJson = {
          dateToday: date,
          lotterys: lottery,
          lotterysNew: lotteryNew
        };
        AV.Cloud.run('sendTemplateMessage', paramsJson).then(function(data) {
          console.log(data)
        }, function(err) {
          console.log(data)
        });
  },

  bindPaySendMessage(){
      var that =this;
      var query = new AV.Query('Lottery');
      query.exists('deadline');
      query.limit(2)
      query.descending('createdAt')
      query.find().then(function (results) {
        lotteryNew = results[0].attributes.title+results[0].attributes.content;
        lottery = results[1].attributes.title+results[1].attributes.content;
        console.log(lottery)
        console.log(lotteryNew)
        // results 返回的就是有图片的 Todo 集合
      }, function (error) {
      });

      wx.showModal({
        title: '确认',
        content: '确认发布1000条模板消息',
        success: function(res) {
          if (res.confirm) {
           that.sendPayTemplateMessage(lotteryNew,lottery)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },
  //云函数调用批量的发模板消息
  sendPayTemplateMessage(lotteryNew,lottery){
        var that = this;
        var date = new Date(); 
        date.setDate(date.getDate()-7);
        console.log(date)
        var paramsJson = {
          dateToday: date,
          lotterys: lottery,
          lotterysNew: lotteryNew
        };
        AV.Cloud.run('sendPayTemplateMessage', paramsJson).then(function(data) {
          console.log(data)
        }, function(err) {
          console.log(data)
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
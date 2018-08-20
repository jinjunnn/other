const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var app = getApp();
var objectId;
var price;
var deadline;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[0,1,2,3,4,5]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    objectId = options.objectId;
    price = options.price;
    console.log(options)
    this.setData({price : options.price})
  },

  ////查询GroupOrder
  queryItemOrder(objectId){
              console.log('objectId'+objectId)
              var query = new AV.Query('ItemOrder');
              query.equalTo('targetGroupOrder', AV.Object.createWithoutData('GroupOrder', objectId));
              query.include('targetUser');
              query.include('targetGroupOrder');
              query.include('targetGroupOrder.targetLottery');
              query.find().then(itemlist => {
                this.setData({
                  itemlist,
                  nowtime:deadline,

                })
     }).then(function(obj) {
        }).catch(function(error) {
          console.log(error)
        });
  },

  ////查询GroupOrder
  queryItemOrderAndUser(objectId){
              console.log('objectId'+objectId)
              var queryGroupOrder = new AV.Query('ItemOrder');
              queryGroupOrder.equalTo('targetGroupOrder', AV.Object.createWithoutData('GroupOrder', objectId));
              var queryUser = new AV.Query('ItemOrder');
              queryUser.equalTo('targetUser', AV.Object.createWithoutData('_User', AV.User.current().id));

              var query = AV.Query.and(queryGroupOrder, queryUser);
              query.include('targetUser');
              query.include('targetGroupOrder');
              query.include('targetGroupOrder.targetLottery');
              query.find().then(itemlist => {
                this.setData({isThisUserBuyOrNot: Boolean(itemlist.length)})
     }).then(function(obj) {
        }).catch(function(error) {
          console.log(error)
        });
  },
  bindBuy(e){
    common.addFormId(e.detail.formId)
    var that = this;
    that.donate(this.data.itemlist[0].attributes.targetGroupOrder.attributes.amount,'参与拼团',this.data.itemlist[0].attributes.targetGroupOrder.attributes.mode)
  },
  bindBackToIndexPage(e){
    common.addFormId(e.detail.formId)
        wx.switchTab({
          url: '/pages/index/index'
        })
  },
  bindBackToUserPage(e){
    common.addFormId(e.detail.formId)
        wx.switchTab({
          url: '/pages/user/user'
        })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function () {
      wx.setNavigationBarTitle({ title: '皮肤拼团'});
  },

  //创建订单
  donate(cost,product,mode) {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: product,
      amount: Math.floor(cost * 100),
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //支付成功后的业务逻辑
        this.saveOrder(mode,cost,product)
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },

  //添加一条订单记录
  saveOrder(mode,cost,product){
      var order = AV.Object.createWithoutData('GroupOrder', objectId);
      order.increment('persons',1)
      order.save()
      .then(function (todo) {
      }, function (error) {
        console.error(error);
      })
      .then(function (todo) {
              var ItemOrder = AV.Object.extend('ItemOrder');
              var itemOrder;
              var order = new ItemOrder();
              order.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
              order.set('targetGroupOrder', AV.Object.createWithoutData('GroupOrder', objectId));
              order.save()
      }, function (error) {
        console.error(error);
      }).then(()=>{
        var that = this;
        that.queryItemOrder(objectId)
        that.queryItemOrderAndUser(objectId)
      });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    deadline = new Date()
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (!AV.User.current()) {
        setTimeout(function() {that.queryItemOrder(objectId)}, 1500);
        setTimeout(function() {that.queryItemOrderAndUser(objectId)}, 1500);
    } else {
        that.queryItemOrder(objectId)
        that.queryItemOrderAndUser(objectId)
    }
    wx.hideLoading()
  },
  setTime(deadline){
    var totalSecond = Date.parse(new Date(deadline))/1000 - Date.parse(new Date())/1000;  
    console.log(totalSecond)
    var interval = setInterval(function () {  
      // 秒数  
      var second = totalSecond;  
  
      // 天数位  
      var day = Math.floor(second / 3600 / 24);  
      var dayStr = day.toString();  
      if (dayStr.length == 1) dayStr = '0' + dayStr;  
  
      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);  
      var hrStr = hr.toString();  
      if (hrStr.length == 1) hrStr = '0' + hrStr;  
  
      // 分钟位  
      var min = Math.floor((second - day * 3600 *24 - hr * 3600) / 60);  
      var minStr = min.toString();  
      if (minStr.length == 1) minStr = '0' + minStr;  
  
      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min*60;  
      var secStr = sec.toString();  
      if (secStr.length == 1) secStr = '0' + secStr;  
  
      this.setData({  
        countDownDay: dayStr,  
        countDownHour: hrStr,  
        countDownMinute: minStr,  
        countDownSecond: secStr,  
      });  
      totalSecond--;  
      if (totalSecond < 0) {  
        clearInterval(interval);   
        this.setData({  
          countDownDay: '00',  
          countDownHour: '00',  
          countDownMinute: '00',  
          countDownSecond: '00',  
        });  
      }  
    }.bind(this), 1500);  
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
    return {
      title: app.globalData.confi.lotteryTodaySharePage.title,
      path: '/pages/index/groupOrder/groupOrder?objectId='+objectId+'&price='+cost,
      imageUrl:this.data.itemlist[0].attributes.targetGroupOrder.attributes.targetLottery.attributes.image.attributes.url,
      success: function(res) {
        wx.switchTab({
          url: '/pages/user/user'
        })
      },
      fail: function(res) {
        console.log(345)
      }
    }
  }
})
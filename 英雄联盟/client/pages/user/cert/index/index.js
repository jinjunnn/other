// pages/user/cert/index/index.js

const AV = require('../../../../utils/av-live-query-weapp-min');
const common = require('../../../../model/common')
const { User, Query, Cloud } = require('../../../../utils/av-live-query-weapp-min');
const Order = require('../../../../model/order');
var price;
var coins;
var mode;

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
    mode = options.mode;
     this.setData({options})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({ title: '大神认证'});
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  modeOne(){
        this.bindBuy()
  },

  modeTwo(){
        this.bindBuy()
  },

  modeThree(){
        //Deposit
        common.amendDeposit(0,mode)
        wx.navigateTo({
           url: '../cert/cert?mode='+mode
        })
  },

  modeFour(){
        //Deposit
        common.amendDeposit(0,mode)
        wx.navigateTo({
           url: '../cert/cert?mode='+mode
        })
  },
  //点击购买
  bindBuy: function (e) {
          var that = this;
          // common.addFormId(e.detail.formId)
          price = 100;
          var productDescription ="大神认证定金";
          if (price < coins) {
                  wx.showModal({
                    title: '确认下单',
                    content: '使用余额支付100元保证金。',
                    success: function(res) {
                      if (res.confirm) {
                        that.donate2("大神认证定金", price*100)       
                      } else if (res.cancel) {
                      }
                    }
                  })   
              return true;
          } else {
                  wx.showModal({
                    title: '确认下单',
                    content: '请支付100元保证金。',
                    success: function(res) {
                      if (res.confirm) {
                        that.donate("大神认证保证金", price*100)       
                      } else if (res.cancel) {
                        //do something
                      }
                    }
                  })
          }
  },
  //确认订单
  donate(productDescription,amount) {
    var that = this;
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: productDescription,
      amount: amount,
      orderMode:2,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        //保存订单信息
        that.saveOrder()
        //新增一条交易记录
        common.addRecord('大神认证保证金', -Number(price))

        //Deposit
        common.amendDeposit(Number(price),mode) 
        //expenses字段增加
        common.amendExpenses(Number(price))
        //发一条通知
        common.sendNotice('秒约团队' , '您好，您已经成功缴纳100元保证金')
        wx.navigateTo({
           url: '../cert/cert?mode='+mode
        })
        setTimeout(that.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },

    //账户余额支付
  donate2(productDescription,amount,gamename) {
    var that = this;
        //保存订单信息
        that.saveOrder()
        //新增一条交易记录
        common.addRecord(nickname + '的陪打订单', -Number(price))
        //expenses字段增加
        common.amendExpenses(Number(price))
        //Deposit
        common.amendDeposit(Number(price),Number(mode))
        //修改coins数量
        common.amendCoins(-Number(price))
        //发一条通知
        common.sendNotice('秒约团队' , '您好，您已经成功缴纳100元保证金')
        wx.navigateTo({
           url: '../cert/cert?mode='+mode
        })
  },
  //更新订单
  refreshOrders() {
    return new Query(Order)
      .equalTo('user', User.current())
      .equalTo('status', 'SUCCESS')
      .descending('createdAt')
      .find()
      .then(orders => this.setData({ 
        orders: orders.map(order => Object.assign(order.toJSON(), {
          paidAt: order.paidAt.toLocaleString(),
        }))
      }))
      .catch(console.error);
  },
  //添加一条订单记录
  saveOrder(){
      var Deposit = AV.Object.extend('Deposit');
      var order = new Deposit();
      order.set('targetBuyer',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('status','已支付');
      order.set('deposit',true)
      order.set('amount',Number(price))
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });

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
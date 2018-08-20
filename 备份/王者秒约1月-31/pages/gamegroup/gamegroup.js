const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common')
const { User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');
const Order = require('../../model/order');
var app = getApp();
var amount;
var gameGroupId;
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
    common.querySetting( '提醒','下单需获取您用户基础权限。')
    this.queryMaster()
  },

  queryMaster(){
    var topicQuery = new AV.Query('GameGroupSet');
    topicQuery.limit(8);
    topicQuery.include('targetUser');
    topicQuery.find().then(topicList => this.setData({
      topicList
    })).catch(console.error);
  },
  //群已满
  bindBuy2: function () {
          common.showModal('本群已经满人，请加其他群。',)
  },

  //点击购买
  bindBuy: function () {
          var that = this;
          amount = 200;
          gameGroupId = "001群";
          var productDescription = "游戏群订单";
          that.donate(productDescription,amount)
          // if (price < coins) {
          //         wx.showModal({
          //           title: '确认下单',
          //           content: '使用账户余额支付'+nickname+'的陪打订单，价格'+price+'元。',
          //           success: function(res) {
          //             if (res.confirm) {
          //               that.donate2(productDescription,amount,gamename)       
          //             } else if (res.cancel) {
          //             }
          //           }
          //         })   
          //     return true;
          // } else {
          //         wx.showModal({
          //           title: '确认下单',
          //           content: '确认支付用户:'+nickname+'的陪打订单，价格'+price+'元。',
          //           success: function(res) {
          //             if (res.confirm) {
          //               that.donate(productDescription,amount,gamename)       
          //             } else if (res.cancel) {
          //               //do something
          //             }
          //           }
          //         })
          // }
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
    //mode=0 代打订单；mode=1 群订单；
      var paramsJson = {
      productDescription: productDescription,
      amount: amount,
      orderMode:1,
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
        common.addRecord('加入游戏群', -2)
        //expenses字段增加
        common.amendExpenses(2)
        //发一条通知
        common.sendNotice( '秒约群中心', '您好，您已经成功付款，请添加群管理员微信：ybao1003 加你入群。')

        wx.navigateTo({
           url: './detail/detail'
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
  //添加一条订单记录
  saveOrder(){
      var GameGroup = AV.Object.extend('GameGroup');
      var order = new GameGroup();
      order.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('status','已支付');
      order.set('amount', 2 )
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });
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

  onHide: function () {
    page_index = 0;
  },

  onUnload: function () {
    page_index = 0;
  },

  onPullDownRefresh: function () {
      this.queryMaster()
  },

  reFrish: function () {
    var page_size = 8;

    var topicQuery = new AV.Query('GameGroupSet');
    topicQuery.limit(page_size);
    topicQuery.skip(page_index * page_size);
    topicQuery.include('targetUser');
    topicQuery.find().then(topicList => this.setData({
      topicList : this.data.topicList.concat(topicList)
    })).catch(console.error);
  },

  onReachBottom: function () {
      page_index = ++page_index
      this.reFrish();
  },

  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.gameGroupSharePage.title,
      path: app.globalData.confi.gameGroupSharePage.path,
      imageUrl:app.globalData.confi.gameGroupSharePage.imageUrl,
      success: function(res) {
          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res){
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var paramsJson = {
                  user:AV.User.current().id,
                  encryptedData: encryptedData,
                  iv: iv,
                  sessionKey:User.current().attributes.authData.lc_weapp.session_key,
                  }
              Cloud.run('groupId' ,paramsJson)
            }
          })
      }
    }
  }
})
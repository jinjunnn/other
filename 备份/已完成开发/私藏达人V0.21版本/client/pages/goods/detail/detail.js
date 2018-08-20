const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var that = this;
var coins;
var lucky = 2;
var confi = false;


Page({

  /**
   * 页面的初始数据
   */
  data: {
      orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({options})
    //查询配置信息
    // var query = new AV.Query('Confi');
    // query.get('59cbf2721b69e6004051b2d0').then(function (results) {
    // console.log(results.attributes.canBuy)

    // confi = results.attributes.coins
    // }, function (error) {
    // // 异常处理
    // console.error(error);
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;


    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    coins = results.attributes.coins
    console.log(coins)
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
  bindLucky: function () {
    var that = this;
    if (lucky < coins) {
      wx.showModal({
      title: '抽奖确认',
      content: '您有'+coins+'个达人币，确认使用'+lucky+'个达人币抽奖。',
      success: function(res) {
        if (res.confirm) {
          that.luckyDraw()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    } 

    else if (!confi){
      wx.showModal({
      title: '达人币不足',
      content: '是否使用现金支付，1元现金=1达人币',
      success: function(res) {
        if (res.confirm) {
            that.donate()
        } else if (res.cancel) {
                  wx.showModal({
                  title: '达人币不足',
                  content: '您有'+coins+'个达人币，赶快去赚更多的达人币吧。',
                  success: function(res) {
                    if (res.confirm) {

                  

                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
        }
      }
    })
    } 

    else {
      wx.showModal({
      title: '达人币不足',
      content: '您有'+coins+'个达人币，赶快去赚更多的达人币吧。',
      success: function(res) {
        if (res.confirm) {

// do somethings

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    }
  },
  donate() {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: this.data.options.title+"抽奖",
      amount: lucky * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        setTimeout(this.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },
  // luckyTap(){
  //   var c = this.data.coins.attributes.coins;
  //   var that = this;
  //   if (lucky > c) {
  //         wx.showToast({
  //           title: '达人币不足',
  //           icon: 'cancel',
  //           duration: 2000
  //         })
  //   } else {
  //   that.luckyDraw()

  //   }
  // },
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
  luckyDraw(){
  var price = this.data.options.price;
  console.log(Math.floor((Math.random()*price)+1))
          //修改user表，中的coins数量
          coins = coins - lucky;

          var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
          todo.set('coins', coins);
          todo.save();

          // 向coins表增加一条记录
          var Coins = AV.Object.extend('Coins');
          var updateCoins = new Coins();
          updateCoins.set('obtainWay','抽奖');
          updateCoins.set('amount',-lucky);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {

          }, function (error) {

          });




  if (Math.floor((Math.random()*price*10000)+1)===1) {
          wx.showToast({
            title: '恭喜您已经中奖',
            icon: 'success_no_circle',
            duration: 2000
          })
          wx.reLaunch({
           url: '../winning/winning'
          })

  } else {
      wx.showModal({
      title: '未中奖',
      content: '此产品的中奖概率为'+Math.round(parseFloat(lucky/this.data.options.price)*100000)/1000+'%是否再来一次？',
      success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }

  },
  exchange(){
          var price = this.data.options.price;
          //修改user表，中的coins数量
          coins = coins - price;

          var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
          todo.set('coins', coins);
          todo.save();

          // 向coins表增加一条记录
          var Coins = AV.Object.extend('Coins');
          var updateCoins = new Coins();
          updateCoins.set('obtainWay','兑换');
          updateCoins.set('amount',-price);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {

          }, function (error) {

          });
          wx.reLaunch({
           url: '../winning/winning'
          })
  },

  bindExchange: function () {
      var that = this;
      if (this.data.options.price > coins) {
      wx.showModal({
      title: '达人币不足',
      content: '您有'+coins+'个达人币，赶快去赚更多的达人币吧。',
      success: function(res) {
        if (res.confirm) {
      // 去往达人币说明页面
        } else if (res.cancel) {
        }
      }
    })
      } else {
      wx.showModal({
      title: '兑换确认',
      content: '确认使用'+this.data.options.price+'个达人币兑换。',
      success: function(res) {
        if (res.confirm) {
           that.exchange()
        } else if (res.cancel) {
        }
      }
    })
      }
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
      return this.refreshOrders().then(wx.stopPullDownRefresh);
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
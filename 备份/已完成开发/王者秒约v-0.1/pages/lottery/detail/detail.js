const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var that = this;
var coins;

//固定的费用金额为2，购买点券时，将COST赋值为价格。
var cost = 2;
var confi = false;
//微信抽奖
var t1=0.105
//钱包抽奖
var t2=0.125
//消费方式
var payFor;

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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    coins = results.attributes.coins

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

      var query = new AV.Query('LotteryGet');
      var user = AV.Object.createWithoutData('Lottery', this.data.options.objectId);
      query.equalTo('targetLottery', user);
      query.include('targetUser');
      query.find().then(comment => this.setData({
          comment
        })).catch(console.error);
  
  },
  //点击抽奖
  bindLucky: function () {
    var that = this;
    if (cost <= coins) {
      wx.showModal({
      title: '皮肤抽奖',
      content: '本次抽皮肤将消费'+cost+'元，将使用内余额支付。',
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
      title: '微信支付',
      content: '本次抽皮肤将消费'+cost+'元，将使用微信支付。',
      success: function(res) {
        if (res.confirm) {
            that.donate()
        } else if (res.cancel) {
                  wx.showModal({
                  title: '余额不足',
                  content: '您钱包有'+coins+'元余额，快去转发到您的微信群，以获得更多奖励。',
                  success: function(res) {
                    if (res.confirm) {
                    //这里调用wx.share，
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
      title: '钱包余额不足',
      content: '您有'+coins+'元，赶快去赚取更多奖励吧。',
      success: function(res) {
        if (res.confirm) {

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    }
  },
  //创建抽奖订单
  donate() {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: this.data.options.title+payFor,
      amount: cost * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        this.wePayDraw()
        // wx.showToast({
        //   title: '支付成功',
        //   icon: 'success',
        //   duration: 1500,
        // });
        setTimeout(this.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },
  //创建购买订单
    donateBuy() {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: this.data.options.title+payFor,
      //因为，点券10个=1元  因此*10而不是*100
      amount: this.data.options.price * 10,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {

          //发送一条中奖的消息
          var message = '恭喜购买皮肤'+this.data.options.content+'请在【我的】-【完善资料】填写自己的详细信息，请确保信息准确无误，我们的工作人员将加您游戏好友并向您赠送皮肤。我们购买皮肤的点券都是由正规渠道充值获得，可以确保您不会被封号。';
          this.sendNotice(message)
          this.lotteryGet()
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
  //刷新订单，用户完成订单后刷新订单为“success”
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

  //钱包余额抽奖，
  luckyDraw(){
          payFor = this.data.options.title+this.data.options.content+'皮肤抽奖'
          var price = this.data.options.price;
          //概率
          var pro = Math.floor(Math.random()*((price*t2).toFixed(0))+1);
          console.log(pro)
          console.log(Math.floor(pro))
          //修改user表，中的coins数量
          this.record()
          this.totalTimes()

  if (pro==1) {
          this.getTimes()
          //发送一条中奖的消息
          var message = '恭喜抽中皮肤'+this.data.options.content+'请在【我的】-【完善资料】填写自己的详细信息，请确保信息准确无误，我们的工作人员将加您游戏好友并向您赠送皮肤。我们购买皮肤的点券都是由正规渠道充值获得，可以确保您不会被封号。';
          this.sendNotice(message)
          wx.showToast({
            title: '恭喜您已经中奖',
            icon: 'success_no_circle',
            duration: 2000
          })
        //这里增加一个中奖表。
          wx.reLaunch({
           url: '../winning/winning'
          })

  } else {
          //发送一条中奖的消息
          var message = '很遗憾的通知您，您的本次抽奖未中奖，我们的抽奖完全按照皮肤的价格比例进行设置，比如28元的皮肤，我们的中奖概率为1/28。抽奖仅为娱乐消遣，欢迎您下次中奖';
          this.sendNotice(message)
      wx.showModal({
      title: '未中奖',
      content: '此产品的中奖概率为'+(cost/(price*0.09)*100).toFixed(2)+'%是否再来一次？',
      success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  },
  //微信支付抽奖
  wePayDraw(){
          payFor = this.data.options.title+this.data.options.content+'皮肤抽奖'
          var price = this.data.options.price;

          var pro = Math.floor(Math.random()*((price*t2).toFixed(0))+1);
          console.log(pro)
          console.log(Math.floor(pro))
          this.record()
          this.totalTimes()

  if (pro==1) {
          this.getTimes()
          //发送一条中奖的消息
          var message = '恭喜抽中皮肤'+this.data.options.content+'请在【我的】-【完善资料】填写自己的详细信息，请确保信息准确无误，我们的工作人员将加您游戏好友并向您赠送皮肤。我们购买皮肤的点券都是由正规渠道充值获得，可以确保您不会被封号。';
          this.sendNotice(message)
          wx.showToast({
            title: '恭喜您已经中奖',
            icon: 'success_no_circle',
            duration: 2000
          })
        //这里增加一个中奖表。
          wx.reLaunch({
           url: '../winning/winning'
          })
  } else {
          //发送一条中奖的消息
          var message = '很遗憾的通知您，您的本次抽奖未中奖，我们的抽奖完全按照皮肤的价格比例进行设置，比如28元的皮肤，我们的中奖概率为1/28。抽奖仅为娱乐消遣，欢迎您下次中奖';
          this.sendNotice(message)
      wx.showModal({
      title: '未中奖',
      content:'此产品的中奖概率为'+(cost/(price*0.09)*100).toFixed(2)+'%是否再来一次？',
      success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  },
  //兑换
  exchange(){
          payFor = this.data.options.title+this.data.options.content+'皮肤兑换'
          var price = this.data.options.price;
          //修改user表，中的coins数量
          coins = coins - price;
          
          this.coinsUpdate()
          //发送一条中奖的消息
          var message = '恭喜购买皮肤'+this.data.options.content+'请在【我的】-【完善资料】填写自己的详细信息，请确保信息准确无误，我们的工作人员将加您游戏好友并向您赠送皮肤。我们购买皮肤的点券都是由正规渠道充值获得，可以确保您不会被封号。';
          this.sendNotice(message)
          this.lotteryGet()
          //兑换时，应当将抽奖的价格修改成商品价格，调用record后，将cost价格归还为2
          cost = price;
          this.record()
          cost = 2;
          wx.reLaunch({
           url: '../winning/winning'
          })
  },
  //点击兑换
  bindExchange: function () {
      var that = this;
      if (this.data.options.price > coins) {
      wx.showModal({
      title: '微信支付',
      content: this.data.options.title+this.data.options.summary+'皮肤'+this.data.options.content+'的兑换价格为'+(this.data.options.price*0.1).toFixed(0)+'元，是否使用微信支付？',
      success: function(res) {
        if (res.confirm) {
          that.donateBuy()
        } else if (res.cancel) {
        }
      }
    })
      } else {
      wx.showModal({
          title: '兑换确认',
          content: this.data.options.title+this.data.options.summary+'皮肤'+this.data.options.content+'的兑换价格为'+(this.data.options.price*0.1).toFixed(0)+'元，推荐您使用钱包余额兑换。',
          success: function(res) {
            if (res.confirm) {
               that.exchange()
            } else if (res.cancel) {
               that.donateBuy()
            }
          }
          })
      }
  },  
  //添加一条抽奖记录
  record(){
          coins = coins - cost;
          this.coinsUpdate();
          this.recordPay()
  },

  //User表修改coins字段
  coinsUpdate(){          
          var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
          todo.set('coins', coins);
          todo.save();
  },

  //Record表增加一条消费记录
  recordPay(){          
          var Record = AV.Object.extend('Record');
          var updateCoins = new Record();
          updateCoins.set('payFor', payFor);
          updateCoins.set('amount',-cost);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {
          }, function (error) {
          });
  },

  //增加抽奖数量字段
  totalTimes(){
          var todo = AV.Object.createWithoutData('Lottery', this.data.options.objectId);

            todo.increment('timesLottery', 1);
            todo.fetchWhenSave(true);
            return todo.save();

          },
  //增加获奖数量字段
  getTimes(){
          var todo = AV.Object.createWithoutData('Lottery', this.data.options.objectId);

            todo.increment('timesGet', 1);
            todo.fetchWhenSave(true);
            return todo.save();
  },

  //增加1条购买记录
  lotteryGet(){
          var PayGet = AV.Object.extend('PayGet');
          // 新建对象
          var lottery = new PayGet();
          var targetLottery = AV.Object.createWithoutData('Lottery', this.data.options.objectId);
          lottery.set('targetLottery',targetLottery);
          lottery.set('targetUser',AV.User.current());
          lottery.save()
  },

  //添加一条通知
  sendNotice(message){
      var Notice = AV.Object.extend('Notice');
      var order = new Notice();
      order.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('From', '皮肤中心');
      order.set('message',message);
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
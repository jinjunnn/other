const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var app = getApp()
var that = this;
var coins;
//抽奖的次数
var times =1;
//固定的费用金额为1，购买点券时，将COST赋值为价格。
var cost = 1;
//微信现金支付抽奖
var t1=0.3;
//钱包余额抽奖
var t2=10000;
//消费方式
var payFor;
var title;
var content;
var price;
var objectId;
var confi;
var image;

Page({
  data: {
      orders: [],
      condition: 1,
  },

  onLoad: function (options) {    
    var that = this;
    objectId = options.objectId
    var query = new AV.Query('Lottery');
    query.get(options.objectId).then(function (user) {
    that.setData({
      user
    })
    confi = user.attributes.confi ,
    image = user.attributes.image.attributes.url,
    title = user.attributes.title , 
    content = user.attributes.content ,
    price = user.attributes.price ,
    // objectId =user.attributes.objectId,
    payFor =user.attributes.title+user.attributes.content+'皮肤抽奖'

    }, function (error) {
    });
  },

  onReady: function () {
    wx.setNavigationBarTitle({ title: '皮肤抽奖'});
    // console.log(title + content + price + payFor)

    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    coins = results.attributes.coins

    that.setData({
      coins:results
    })
    }, function (error) {
    });
  },

  onShow: function () {

  },
  //点击抽奖
  bindLucky: function () {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: '../../user/login/login'
      })
    } else {
        console.log(objectId)
        console.log(price)
        this.setData({
          condition: 1
        });
        var that = this;
        if (cost <= coins) {
          that.luckyDraw()
          return false;
        } else {
          that.donate()
        }
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
      productDescription:payFor,
      amount: cost * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //支付成功后的业务逻辑
        this.wePayDraw()
        setTimeout(this.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },
  //发送短消息
  sendSMS(){
        AV.Cloud.requestSmsCode({
        mobilePhoneNumber: '17704054310',
        template: '皮肤中心',
        sign:'王者秒约'
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
  },
  //钱包余额抽奖，
  luckyDraw(){
          coins = coins - cost;
          //概率
          var pro = Math.floor(Math.random()*((price*t2).toFixed(0))+1);
          console.log(pro)
          common.addRecord(payFor, -cost)
          common.amendExpenses(cost)
          common.amendCoins(-cost)
          this.totalTimes()

  if (pro==1) {
          this.getTimes()
          //发送一条中奖的消息
          var message = '恭喜抽中皮肤'+content+'请加客服人员微信区加微信号：ybao1003 QQ区加QQ号：784092545，加好友后，进入游戏进行索要。微信区好友可能会延迟1-4个小时显示在游戏好友列表中，请耐心等待。';
          common.sendNotice('皮肤中心',message)
          this.setData({ condition: 2 });
          //发送一条短信
          that.sendSMS()
          //这里增加一个中奖表。
          this.lotteryGet2()
          wx.navigateTo({
           url: '../get/get?objectId='+objectId
          })

  } else {
          var message = '很遗憾的通知您，您的本次抽奖未中奖，我们的抽奖完全按照皮肤的价格比例进行设置。例如:28元的皮肤，28*0.8=23,我们的中奖概率为1/23。抽奖仅为娱乐消遣，欢迎您下次中奖';
          common.sendNotice('皮肤中心',message)
      wx.showModal({
      title: '抽中10积分',
      content: '积分可以用于皮肤兑换。'+content+'皮肤的中奖概率为'+(cost/(price*0.08)*100).toFixed(2)+'%是否再来一次？',
      success: function(res) {
        if (res.confirm) {
          that.bindLucky()
        } else if (res.cancel) {
        }
      }
    })
  }
  },
  //微信支付抽奖
  wePayDraw(){
          times = ++times;

          var pro = Math.floor(Math.random()*((price*t1).toFixed(0))+1);
          console.log('抽奖次数'+times)
          console.log('随机数'+pro)
          console.log('必中'+ price * 0.125)
          common.amendExpenses(cost)
          common.addRecord(payFor , -cost)
          this.totalTimes()


  if (times >= price*0.125) {
          console.log(times)

          times = 1;
          this.getTimes()
          //发送一条短信
          this.sendSMS()
          //发送一条中奖的消息
          var message = '恭喜抽中皮肤'+content+'请加客服人员微信区加微信号：ybao1003 QQ区加QQ号：784092545，加好友后，进入游戏进行索要。微信区好友可能会延迟1-4个小时显示在游戏好友列表中，请耐心等待。';
          common.sendNotice('皮肤中心' , message)
          wx.showModal({
            title: '恭喜中奖！',
            content: '请您在48小时内按照指引截图并与微信客服：ybao1003 取得联系并领取皮肤。如有任何问题请联系客服。',
            success: function(res) {
              if (res.confirm) {
                    wx.navigateTo({
                     url: '../guide/guide'
                    })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        //这里增加一个中奖表。
          this.lotteryGet2()
  }
  else if (pro==1 && times>=12) {
          this.getTimes()
          times = 1;
          //发送一条短信
          this.sendSMS()
          //发送一条中奖的消息
          var message = '恭喜抽中皮肤'+content+'请截屏后加客服人员微信区加微信号：ybao1003 QQ区加QQ号：784092545进行索要。微信区好友可能会延迟1-4个小时显示在游戏好友列表中，请耐心等待。';
          common.sendNotice('皮肤中心' , message)
          wx.showModal({
            title: '恭喜中奖！',
            content: '请您在48小时内按照指引截图并与微信客服：ybao1003 取得联系并领取皮肤。如有任何问题请联系客服。',
            success: function(res) {
              if (res.confirm) {
                    wx.navigateTo({
                     url: '../guide/guide'
                    })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          //这里增加一个中奖表。
          this.lotteryGet2()
  } 
  else {
          //发送一条中奖的消息
          var message = '很遗憾的通知您，您的本次抽奖未中奖。我们的抽奖完全按照皮肤的价格8折进行设置，比如28元的皮肤，我们的中奖概率为1/（28*0.8）。抽奖仅为娱乐消遣，欢迎您下次中奖';
          common.sendNotice('皮肤中心' , message)
          common.addIntergal('抽奖' , 20)
          common.amandIntergal(20)
          this.setData({ condition: 3 });
  }
  },

  //点击兑换
  bindExchange: function () {
      var that = this;
      if (price / 10 > coins) {
      wx.showModal({
      title: '仅限苹果IOS玩家购买',
      content: title +'皮肤'+content+'的兑换价格为'+(price*0.08).toFixed(0)+'元，仅限苹果手机游戏玩家购买。',
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
          content: title+'皮肤'+content+'的兑换价格为'+(price*0.08).toFixed(0)+'元，推荐您使用钱包余额兑换。',
          success: function(res) {
            if (res.confirm) {
               that.exchange()
               wx.navigateTo({
                  url: '../../user/notice/notice'
               })
            } else if (res.cancel) {
            }
          }
          })
      }
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
      productDescription: payFor,
      //因为，点券10个=1元  因此*10而不是*100
      amount: price * 8,
      times: times,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
          //发送一条中奖的消息
          common.sendNotice('皮肤中心' , '恭喜购买皮肤'+content+'请加客服人员微信区加微信号：ybao1003 QQ区加QQ号：784092545，加好友后，进入游戏进行索要。微信区好友可能会延迟1-4个小时显示在游戏好友列表中，请耐心等待。')
          var price = price/12.5;
          common.amendExpenses(price)
          this.lotteryGet()
          common.addRecord(payFor, -price)
          wx.navigateTo({
                  url: '../../user/notice/notice'
          })

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
    console.log('可以走通')
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

  //兑换
  exchange(){
          var price = price/12.5;
          common.amendExpenses(-(-price))
          common.amendCoins(-price)
          common.sendNotice('皮肤中心' , '恭喜购买皮肤'+ content+'请在【我的】-【完善资料】填写自己的详细信息，请确保信息准确无误，我们的工作人员将加您游戏好友并向您赠送皮肤。我们购买皮肤的点券都是由正规渠道充值获得，可以确保您不会被封号。')
          this.lotteryGet()
          common.addRecord(payFor , -price)

  },
  //增加抽奖数量字段
  totalTimes(){
          var todo = AV.Object.createWithoutData('Lottery', objectId);
            todo.increment('timesLottery', 1);
            todo.fetchWhenSave(true);
            return todo.save();

          },
  //增加获奖数量字段
  getTimes(){
          var todo = AV.Object.createWithoutData('Lottery', objectId);
            todo.increment('timesGet', 1);
            todo.fetchWhenSave(true);
            return todo.save();
  },

  //增加1条购买记录
  lotteryGet(){
          var PayGet = AV.Object.extend('PayGet');
          // 新建对象
          var lottery = new PayGet();
          var targetLottery = AV.Object.createWithoutData('Lottery', objectId);
          lottery.set('targetLottery',targetLottery);
          lottery.set('targetUser',AV.User.current());
          lottery.set('product',title + content)
          lottery.save()
  },
  //增加1条抽奖记录
  lotteryGet2(){
          var LotteryGet = AV.Object.extend('LotteryGet');
          // 新建对象
          var lottery = new LotteryGet();
          var targetLottery = AV.Object.createWithoutData('Lottery', objectId);
          lottery.set('targetLottery',targetLottery);
          lottery.set('targetUser',AV.User.current());
          lottery.set('product',title + content)
          lottery.save()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(0)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(1)
      times = 1;
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

  onShareAppMessage: function () {
    return{
      title:  title + content + '皮肤抽奖',
      imageUrl:image,
    }
  }
})
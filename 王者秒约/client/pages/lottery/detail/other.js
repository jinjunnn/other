const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var page_index = 0;
var page_size = 30;
var price;
var that = this;
var coins;
var intergal;
var objectId;
var content;
var app = getApp();
//固定的费用金额为1，购买点券时，将COST赋值为价格。
var cost = 100;
//微信现金支付抽奖
var t1=0.2
//钱包余额抽奖
var t2=100000
//消费方式
var payFor;
var image;
var deadline;
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
    console.log(AV.User.current())

    var that = this;
    objectId = options.objectId;
    var query = new AV.Query('Property');
    query.get(options.objectId).then(function (property) {
          that.setData({
            property,
          });
        })
    this.queryConfi()
    wx.showShareMenu({
      withShareTicket: true
    })
    deadline = new Date(options.deadline);
    console.log(options)
    var d = new Date();
    console.log(d)
    image = options.image;
    this.setData({
      options,
      d
    })

      var query = new AV.Query('LotteryGet');
      var user = AV.Object.createWithoutData('Lottery', options.objectId);
      query.equalTo('targetLottery', user);
      query.include('targetUser');
      query.descending('updatedAt')
      query.find()
            .then(comment => this.setData({ 
                   comment: comment.map(commentItem => Object.assign(commentItem.toJSON(), {
                   updatedAt: commentItem.updatedAt.toLocaleString(),
                   }))
            }))
           .catch(console.error);

  },
  bindLottery(){
    var that = this;
    console.log(coins)
    common.querySettingMustTrue( '皮肤抽奖','抽奖需获得您的昵称和头像信息，用以在中奖名单中公布。')
    if (intergal >= 100) {
      that.intergalDraw()
    } else if(coins >= 1 ){
      console.log(1234567)
      that.luckyDraw()
    }else if(AV.User.current().updatedAt - AV.User.current().createdAt > 86400000){
        wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userInfo']) {
                  wx.showModal({
                    title: title,
                    content: content,
                    success: function(res) {
                      if (res.confirm) {
                              wx.openSetting({
                                success: (res) => {
                                          app.getUserInfo()
                                          that.bindRecharge()
                                }
                              })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
            } else {
              that.bindRecharge()
            }
          }
        })

    } else {
      common.showModal( '您可以通过登录打卡、分享等行为随机获得幸运积分。幸运积分可以用于皮肤抽奖以及皮肤兑换。','积分不足')
    }
  },
  //切换另外一个小程序进行充值。
  bindRecharge(){
    console.log(this.data.appId)
    wx.navigateToMiniProgram({
      appId: this.data.appId,
      path: 'pages/user/wallet/recharge/recharge',
      success(res) {
        // 打开成功
      }
    })
  },

  queryConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a6492c61b69e60066f379a7').then(function (confi) {
      that.setData({
        confi:confi.attributes.lotteryDisplay,
        appId:confi.attributes.targetRechargeAppId,
        times:confi.attributes.targetLotteryTimes,
      })
    }, function (error) {
      // 异常处理
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({ title: '积分抽奖'});
    var that = this;
    console.log(AV.User.current().id)
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    intergal = results.attributes.Intergal;
    coins = results.attributes.coins;
    that.setData({
      intergal:results.attributes.Intergal,
      coins:results.attributes.coins,
    })
    }, function (error) {
    });
  },
  //钱包余额抽奖，
  luckyDraw(){
          coins = coins - 1;
          //概率
          var pro = Math.floor(Math.random()*((price*t2).toFixed(0))+1);
          console.log(pro)
          common.addRecord('余额抽奖', -1)
          common.amendExpenses(1)
          common.amendCoins(-1)
          this.totalTimes()

  if (pro==1) {
          this.getTimes()
          //发送一条中奖的消息
          var message = '恭喜抽中皮肤'+content+'请加客服人员微信区加微信号：ybao1003 QQ区加QQ号：784092545，加好友后，进入游戏进行索要。微信区好友可能会延迟1-4个小时显示在游戏好友列表中，请耐心等待。';
          common.sendNotice('皮肤中心',message)
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
      content: '积分可以用于皮肤兑换。'+content+'皮肤的中奖概率为'+(cost/(price*0.8)).toFixed(2)+'%是否再来一次？',
      success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    })
  }
  },
  //积分抽奖，
  intergalDraw(){
          intergal = intergal - cost;
          //概率
          var pro = Math.floor(Math.random()*((price*t2).toFixed(0))+1);
          console.log(pro)
          common.addIntergal('积分抽奖', -cost)
          common.amandIntergal(-cost)
          this.totalTimes()

  if (pro==1) {
          this.getTimes()
          //发送一条中奖的消息
          var message = '恭喜抽中皮肤'+content+'请加客服人员微信区加微信号：ybao1003 QQ区加QQ号：784092545，加好友后，进入游戏进行索要。微信区好友可能会延迟1-4个小时显示在游戏好友列表中，请耐心等待。';
          common.sendNotice('皮肤中心',message)
          //这里增加一个中奖表。
          this.lotteryGet2()
          wx.navigateTo({url: '../get/get?objectId='+objectId})

  } else {
          var message = '很遗憾的通知您，您的本次抽奖未中奖，我们的抽奖完全按照皮肤的价格比例进行设置。例如:28元的皮肤，28*0.8=23,我们的中奖概率为1/23。抽奖仅为娱乐消遣，欢迎您下次中奖';
          common.sendNotice('皮肤中心',message)
      wx.showModal({
      title: '未中奖',
      content: '积分可以用于皮肤兑换。'+content+'皮肤的中奖概率为'+(cost/(price*0.8)).toFixed(2)+'%是否再来一次？',
      success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    })
  }
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
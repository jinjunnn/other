const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var price;
var price2;
var title;
var app = getApp();
var objectId;
var p;
var p1 = 0;
var p2 = 0;
// r1青铜； r2白银； r3黄金； r4铂金； r5钻石； r6星耀； r7王者1-10；r8王者10-20； r9王者20-30；
var r1 = 5;
var r2 = 6;
var r3 = 8;
var r4 = 10;
var r5 = 20;
var r6 = 30;
var r7 = 40;
var r8 = 50;
var r9 = 60;
var a;
var b;
Page({

  /**
   * 页面的初始数据⒈Ⅰ ⒉Ⅱ ⒊Ⅲ ⒋Ⅳ ⒌Ⅴ
   */
  data: {
    array1:['微信大区','QQ大区'],
    array2:['倔强青铜','秩序白银','荣耀黄金','尊贵铂金','永恒钻石Ⅴ','永恒钻石Ⅳ','永恒钻石Ⅲ','永恒钻石Ⅱ','永恒钻石Ⅰ','至尊星耀Ⅴ','至尊星耀Ⅳ','至尊星耀Ⅲ','至尊星耀Ⅱ','至尊星耀Ⅰ','最强王者'],
    array3:['1局','2局','3局','4局','5局','6局','7局','8局','9局','10局'],
    priceIndex:[5,6,8,12,13,15,17,20,25,25,30,30,35,35,50],
    priceIndex2:[3,5,5,10,12,13,15,18,20,22,24,24,28,30,40],
    index1:0,
    index2:0,
    index3:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.querySetting( '下单确认','下单需获取您用户基础权限。')
  },
  //点击购买
  bindBuy: function () {
      var that = this;
      //由于目前用户在账户上的资金一直不可能太多，因此不做判断。
      price = this.data.priceIndex[this.data.index2]*this.data.index3 + this.data.priceIndex[this.data.index2];
      price2 = this.data.priceIndex2[this.data.index2]*this.data.index3 + this.data.priceIndex2[this.data.index2];
    if (!this.data.user.attributes.weChatID) {
      common.showTip("请输入微信账号", "loading");
    }
    else if (!this.data.user.attributes.gameName) {
      common.showTip("请输入游戏账号", "loading");
    }
    else {
      that.donateBuy()
    }
  },  
  //兑换购买
  exchange(){
          //成功后的业务逻
          this.buyRecord()
          common.amendCoins(-price)
          common.amendExpenses(- (-price))
          common.addRecord(title+'购买' , -price)
          common.sendNotice('上分团队' , '恭喜您购买成功。请完善资料，以便我们客服人员联系您。您也可以联系客服。')
          wx.navigateTo({
           url: '../../user/notice/notice'
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
  //增加1条购买记录
  buyRecord(){
      var ExpertOrder = AV.Object.extend('ExpertOrder');
      var order = new ExpertOrder();
      order.set('targetBuyer',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('status','已支付');
      //这里后续可以设置多局购买。
      order.set('times',Number(this.data.index3) + 1)
      order.set('rank', this.data.array2[this.data.index2])
      order.set('price', this.data.priceIndex[this.data.index2])
      order.set('price2', this.data.priceIndex2[this.data.index2])
      order.set('amount',Number(price))
      order.set('zone', this.data.array1[this.data.index1])
      order.set('amount2',Number(price2))
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });
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
      productDescription: '职业陪打订单',
      amount: price * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //成功后的业务逻辑
        this.buyRecord()
        common.addRecord('职业陪打订单', -price)
        common.amendExpenses(- (-price))
        //发送一条中奖的消息
        common.sendNotice('职业陪打' , '恭喜您下单成功，请扫码加入职业陪打微信群，如果群过期请添加微信ybao1003邀请您。')

        // //发送一条sms
        // this.sendSMS()
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        })         
        wx.navigateTo({
           url: './detail/detail'
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
  // //发送短消息
  // sendSMS(){
  //       AV.Cloud.requestSmsCode({
  //       mobilePhoneNumber: '17704054310',
  //       template: '大神团订单',
  //       sign:'王者秒约'
  //       }).then(function(){
  //             //调用成功
  //           }, function(err){
  //             //调用失败
  //       });
  // },
  bindPickerChange1: function(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange2: function(e) {
    this.setData({
      index2: e.detail.value
    })
  },
  bindPickerChange3: function(e) {
    this.setData({
      index3: e.detail.value
    })
  },
  bindOrder(event){
      wx.showModal({
        title: '下单确认',
        content: '请确认玩家已经加入代练接单群，或玩家游戏名完整。接单后请在1小时内完成订单。',
        success: function(res) {
          if (res.confirm) {
                  var bill = AV.Object.createWithoutData('ExpertOrder', event.currentTarget.dataset.order);
                  bill.set('status', '已接单');
                  bill.set('targetExpert',AV.Object.createWithoutData('_User', AV.User.current().id));
                  bill.save();
                  common.amendCoins(event.currentTarget.dataset.price)
                  common.amendIncomes(event.currentTarget.dataset.price)
                  common.addRecord('陪打接单', -event.currentTarget.dataset.price)
                  common.sendNotice('陪打接单' , '恭喜您下单成功，请扫码加入陪打微信群。')
                  wx.navigateBack({
                    delta: 1
                  })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

  },
  queryExpertOrder(){
    if (this.data.user.attributes.depositPass) {
    var query = new AV.Query('ExpertOrder');
    query.equalTo('status', '已支付');
    query.addAscending('createdAt');
    query.limit(12);
    query.include('targetBuyer');
    query.find().then(order => this.setData({
      order
    })).catch(console.error);
    } else {
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      setTimeout(this.queryExpertOrder.bind(this), 1500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var query = new AV.Query('_User');
    query.get(User.current().id).then(function (user) {
          that.setData({
            user
          })
    }, function (error) {
      // 异常处理
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
      return {
      title: app.globalData.confi.rankSharePage.title,
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
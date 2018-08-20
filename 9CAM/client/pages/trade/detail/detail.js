const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var that = this;

var payFor;
var coins;
var expenses;
var objectId;
var title;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
  },

  onLoad: function (options) {
    console.log(options)
      objectId = options.objectId;
      title = options.title;
  },

  onReady: function () {
      wx.setNavigationBarTitle({ title:'产品交易'});
  },

  onShow: function () {
      this.queryTrade()
  },

  queryTrade(){
      var query = new AV.Query('Trade');
      query.include('targetUser').get(objectId).then( trade => 
        this.setData({
          trade 
        })).catch(console.error);
  },

  //点击购买
  bindBuy: function () {
      common.querySetting( '登录','小程序将使用您的微信ID和微信头像作为账号，请开启权限。')

      var that = this;
      //由于目前用户在账户上的资金一直不可能太多，因此不做判断。
      if (this.data.trade.attributes.amount) {
      wx.showModal({
      title: '微信支付',
      content: this.data.trade.attributes.title+'价格为'+(this.data.trade.attributes.amount)+'元，使用微信支付。',
      success: function(res) {
        if (res.confirm) {
          that.donateBuy()
        } else if (res.cancel) {
          return false;
        }
      }
    })
      } else {
      wx.showModal({
          title: '兑换确认',
          content: this.data.trade.attributes.title+'的兑换价格为'+(this.data.trade.attributes.amount)+'元，推荐您使用钱包余额兑换。',
          success: function(res) {
            if (res.confirm) {
               that.exchange()
            } else if (res.cancel) {
            }
          }
          })
      }
  },  
  //兑换购买
  exchange(){
          //成功后的业务逻
          this.buyRecord()
          common.amendCoins(-this.data.trade.attributes.amount)
          common.amendExpenses(- (-this.data.trade.attributes.amount))
          common.addRecord(this.data.trade.attributes.title+'购买' , -this.data.trade.attributes.amount)

          common.sendNotice('秒约交易' , '恭喜您成功购买，我们已经联系卖方发货，请在 秒约小程序-我的-个人资料中完善自己的手机号码等信息，以方便卖方与您取得联系。')
          
          wx.navigateTo({
           url: '../../user/notice/notice'
          })
          //发送一条sms
          this.sendSMS()
  },
  //发送短消息
  sendSMS(){
        AV.Cloud.requestSmsCode({
        mobilePhoneNumber: this.data.trade.attributes.targetUser.attributes.cells,
        template: '交易订单',
        sign:'王者秒约',
        goods: this.data.trade.attributes.title
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
  },
  bindSendSMS(){
    common.sendSMS('18312538628', '客服消息')
    common.sendSMS('17704054310', '客服消息')
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
      productDescription: this.data.trade.attributes.title,
      //因为，点券10个=1元  因此*10而不是*100
      amount: this.data.trade.attributes.amount * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //成功后的业务逻辑
        this.buyRecord()
        common.addRecord(this.data.trade.attributes.title , -this.data.trade.attributes.amount)
        common.amendExpenses(- (-this.data.trade.attributes.amount))
        //发送一条中奖的消息
        common.sendNotice('购买通知' , '恭喜您成功购买'+this.data.trade.attributes.title+'我们已经通知卖家发货，请确保您准确的填写了您的手机号码，以便卖家与您沟通和联系。')
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
        })         
        wx.navigateTo({
               url: '../../user/notice/notice'
        });
        setTimeout(this.refreshOrders.bind(this), 2000);
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

  //增加1条购买记录
  buyRecord(){

          var TeamOrder = AV.Object.extend('TradeRecord');
          // 新建对象
          var order = new TeamOrder();
          var targetTrade = AV.Object.createWithoutData('Trade', objectId);
          order.set('targetTrade',targetTrade);
          order.set('targetUser',AV.User.current());
          order.set('status',false);
          order.set('goods',this.data.trade.attributes.title);
          order.set('price',Number(this.data.trade.attributes.amount));
          order.set('targetSeller',AV.Object.createWithoutData('_User', this.data.trade.attributes.targetUser.id))
          order.save()
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

  onShareAppMessage: function () {
    return {
      title: this.data.trade.attributes.title + '出手，价格'+ this.data.trade.attributes.amount +'元',
      imageUrl:this.data.trade.attributes.images[0],
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
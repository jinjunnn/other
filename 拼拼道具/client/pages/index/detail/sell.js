const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var objectId;
var orderAmounts;
var itemAmounts;


Page({
  data: {
      modaldisplay:false,
  },
  onLoad: function (options) {
      objectId = options.objectId;
      common.querySetting( '登录','小程序将使用您的微信Id作为登录账号。')
  },

  onReady: function () {
      wx.setNavigationBarTitle({ title: '皮肤拼团'});
  },

  onShow: function () {
      this.queryProduct()
  },

  queryProduct(){
      var query = new AV.Query('Lottery');
      query.include('targetUser').get(objectId).then(product => 
        this.setData({
          product
        })).catch(console.error);
  },

  bindFullBuy(e){
          var that = this;
          common.addFormId(e.detail.formId)
          that.donate(this.data.product.attributes.price/12.5,this.data.product.attributes.content,3) 
  },

  bindBuy(e){
          var that = this;
          common.addFormId(e.detail.formId)
          that.donate(this.data.product.attributes.price/10,this.data.product.attributes.content,4)     
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
  //添加一条订单记录
  saveOrder(mode,cost,product){
      var GroupOrder = AV.Object.extend('GroupOrder');
      var groupOrder;
      var overdueTime = new Date();
      console.log(AV.User.current().id)
      console.log(this.data.product.id)
      var order = new GroupOrder();
      order.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('targetLottery', AV.Object.createWithoutData('Lottery', this.data.product.id));
      order.set('mode',mode);
      //这里后续可以设置多局购买。
      order.increment('persons',1)
      order.set('amount',cost)
      order.set('product',product)
      order.set('overdue',new Date(overdueTime - (-259200000)))
      order.save()
      .then(function (todo) {
        console.log(todo.id)
        groupOrder = todo
      }, function (error) {
        console.error(error);
      })
      .then(function (todo) {
              var ItemOrder = AV.Object.extend('ItemOrder');
              var itemOrder;
              var order = new ItemOrder();
              order.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
              order.set('targetGroupOrder', AV.Object.createWithoutData('GroupOrder', groupOrder.id));
              order.save()
      }, function (error) {
        console.error(error);
      }).then(()=>{
        var that = this;
        this.setData({ modaldisplay: true })
        wx.navigateTo({
          url: '../groupOrder/groupOrder?objectId='+groupOrder.id
        })
      });
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
    return this.refreshOrders().then(wx.stopPullDownRefresh);
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.indexDetailSharePage.title,
    }
  }
})
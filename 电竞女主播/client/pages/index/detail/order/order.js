// pages/index/detail/detail.js
const Realtime = require('../../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../../utils/av-live-query-weapp-min');
const common = require('../../../../model/common')
const { User, Query, Cloud } = require('../../../../utils/av-live-query-weapp-min');
const Order = require('../../../../model/order');
var that = this;
var app = getApp();
var CONVERSATION_ID;
var client;
var objectId;
var nickname;
var gamename;
var price;
var amount;
var coins;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    array1:['苹果微信区','安卓微信区','苹果QQ区','安卓QQ区'],
    array2:['倔强青铜','秩序白银','荣耀黄金','尊贵铂金','永恒钻石Ⅴ','永恒钻石Ⅳ','永恒钻石Ⅲ','永恒钻石Ⅱ','永恒钻石Ⅰ','至尊星耀Ⅴ','至尊星耀Ⅳ','至尊星耀Ⅲ','至尊星耀Ⅱ','至尊星耀Ⅰ','最强王者'],
    array3:['1局','2局','3局','4局','5局','6局','7局','8局','9局','10局'],
    priceIndex:[5,6,8,12,13,15,17,20,25,25,30,30,35,35,50],
    priceIndex2:[3,5,5,10,10,12,13,15,20,20,24,24,25,25,40],
    index1:0,
    index2:0,
    index3:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    objectId = options.objectId;
  
  },
  bindPickerChange1: function(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange3: function(e) {
    this.setData({
      index3: e.detail.value
    })
  },
  bindBuy: function (e) {
    if (!this.data.user.attributes.weChatID) {
      common.showTip("微信号不能为空", "loading");
    }
    else if (!this.data.user.attributes.gameName) {
      common.showTip("游戏名不能为空", "loading");
    }

    else {
          var that = this;
          common.addFormId(e.detail.formId)
          price = this.data.master.attributes.price * this.data.index3 + this.data.master.attributes.price;
          gamename = this.data.master.attributes.targetUser.attributes.gameName;
          nickname = this.data.master.attributes.targetUser.attributes.nickname;
          coins = this.data.user.attributes.coins;
          console.log('我的账户余额是'+coins)
          var productDescription = gamename+"陪打订单";

          if (price <= coins) {
              that.donate2(productDescription,price,gamename)       
              return true;
          } else {
                that.donate(productDescription,price,gamename)   
          }

    }
  },
  //确认订单
  donate(productDescription,amount,gamename) {
    var that = this;
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: productDescription,
      amount: amount * 100,
      gamename:gamename,
      orderMode:0,
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
        common.addRecord(nickname + '的陪打订单', -Number(price))
        //发送一条短信
        // common.sendSMS(this.data.master.attributes.targetUser.attributes.cells, '订单通知1', this.data.user.attributes.gameName)
        //expenses字段增加
        common.amendExpenses(Number(price))
        //发一条通知
        common.sendNotice(nickname , '您好，收到您的陪打订单，我的游戏昵称是'+nickname+'，请您在游戏中加我好友邀请我陪打，或者请您在个人中心-设置中设置您的正确的游戏昵称，等我加您后邀请您排位。')
        that.bindConversation()
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
        wx.showLoading({
          title: '下单中',
          mask:true,
        })
        //保存订单信息
        that.saveOrder()
        //新增一条交易记录
        common.addRecord(nickname + '的陪打订单', -Number(price))
        //给打手发送一条模板消息
        // common.sendModelMsg(formId,openid,game,gamename,templateId)
        //发送一条短信
        common.sendSMS(this.data.master.attributes.targetUser.attributes.cells, '订单通知1', this.data.user.attributes.gameName)
        //expenses字段增加
        common.amendExpenses(Number(price))
        //修改coins数量
        common.amendCoins(-Number(price))
        //发一条通知
        common.sendNotice(nickname , '您好，收到您的陪打订单，我的游戏昵称是'+nickname+'，请您在游戏中加我好友邀请我陪打，或者请您在个人中心-设置中设置您的正确的游戏昵称，等我加您后邀请您排位。')
        that.bindConversation()
        setTimeout(function(){
          wx.hideLoading()
        },10000)
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
      var PlayOrder = AV.Object.extend('PlayOrder');
      var order = new PlayOrder();
      order.set('targetBuyer',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('targetSeller',AV.Object.createWithoutData('_User', this.data.master.attributes.targetUser.id));
      var targetMaster = AV.Object.createWithoutData('Master', this.data.master.id);
      order.set('targetMaster', targetMaster);
      order.set('status','已支付');
      //这里后续可以设置多局购买。
      order.set('times',Number(this.data.index3) + 1)
      order.set('amount',Number(price))
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });
  },
  queryMaster(master){
      var query = new AV.Query('Master');
      query.include('targetUser').get(master).then(master => 
        this.setData({
          master
        })).catch(console.error);
  },

  queryUser(user){
    var that = this;
    var query = new AV.Query('_User');
    query.get(user).then(function (results) {
    coins = results.attributes.coins
    that.setData({
      user:results
    })
    }, function (error) {
    });
  },

  onReady: function () {
      this.queryMaster(objectId)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.queryUser(AV.User.current().id)
  },
  //页面跳转链接，跳转到以下页面
  bindConversation(e){
    var that = this;
    if (AV.User.current().attributes.gender >= 0) {
        console.log(this.data.master.attributes.targetUser.id)
        app.realtime.createIMClient(AV.User.current().id).then(function(user) {
        client = user;
          return client.createConversation({
            members: [that.data.master.attributes.targetUser.id],
            unique: true,
          });
        }).then(function(conversation) {
        CONVERSATION_ID = conversation.id
        that.closeConversation()
                })     
    } else {
      common.showModal('您好，聊天需要访问您的微信名和头像信息，请前往[我的]-[设置]开启权限。')
    }
  },

  closeConversation(){
          var userid = this.data.master.attributes.targetUser.id;
          var userimage = this.data.master.attributes.targetUser.attributes.image;
          var username = this.data.master.attributes.targetUser.attributes.username;
          var image=[{user:userid,name:username,image:userimage},{user:User.current().id,name:User.current().attributes.username,image:User.current().attributes.userImage}];
          var bill = AV.Object.createWithoutData('_Conversation', CONVERSATION_ID);
          bill.set('image', image);
          bill.save();
                wx.navigateTo({
                url: '../../../message/detail/detail?conversationId='+CONVERSATION_ID+'&image='+userimage
                })
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
      success: function(res) {
        common.addShares()
      }
    }
  }
})
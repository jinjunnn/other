const { User } = require('../../../../utils/av-live-query-weapp-min');
const common = require('../../../../model/common');
const AV = require('../../../../utils/av-live-query-weapp-min');

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      priceid : 6,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.setUserWallet()
  },
  bindChangePrice(e){
    console.log(e.currentTarget.dataset.price)
    this.setData({
      priceid : e.currentTarget.dataset.price,
    })

  },

  bindRecharge(){
         var that = this;
         wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo']) {
                wx.showModal({
                  title: "充值",
                  content: "您好，充值需要获得您的微信昵称和微信ID，作为您的登录账号。",
                  success: function(res) {
                    if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                app.login()
                              }
                            })
                    } else if (res.cancel) {

                    }
                  }
                })
          }else{
            //调用支付接口进行充值
            that.donate(that.data.priceid)
            //充值成功，向余额中增加相应的数量

            //向intergal中增加相应的积分
          }
        }
      })
  },

  //创建抽奖订单
  donate(cost) {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription:'充值',
      amount: cost * 1,
    }
    AV.Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //支付成功后的业务逻辑
        common.amendCoins(this.data.priceid)
        common.amendIntergal(this.data.priceid*10)

        common.addRecord('充值' , cost)
        common.addIntergal('充值赠送' , cost*10)
        setUserWallet()
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },
  //
  setUserWallet(){
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
      console.log(results.attributes.coins)
    that.setData({
      coins:results.attributes.coins,
      intergal:results.attributes.Intergal,
    })
    }, function (error) {
    });

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
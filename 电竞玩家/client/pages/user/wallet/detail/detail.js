const AV = require('../../../../utils/av-live-query-weapp-min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  account:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  
  },
  bindAmount: function(e) {
    this.setData({
      account: Number(e.detail.value)
    })
  }, 


  bindSubmit(){
    console.log(this.data.account)
    console.log(this.data.user.attributes.coins)
    if (this.data.account < 100) {
            wx.showModal({
              title: '提示',
              content: '提现金额需要大于等于100元',
              showCancel:'false',
              success: function(res) {
                if (res.confirm) {
                  return false;
                } else if (res.cancel) {
                  return false;
                }
              }
            })
        return false;
    } else if (this.data.account > this.data.user.attributes.coins){
          wx.showToast({
          title: '余额不足',
          icon: 'warn',
          duration: 2000
        })
            wx.showModal({
              title: '提示',
              content: '余额不足！',
              showCancel:'false',
              success: function(res) {
                if (res.confirm) {
                  return;
                } else if (res.cancel) {
                  return;
                }
              }
            })
        return false;
    } else{
      //向withdraw表增加一条记录
      var Withdraw = AV.Object.extend('Withdraw');
      var order = new Withdraw();
      order.set('user',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('status',false);
      order.set('amount',this.data.account)
      order.save()
           .then(          
              wx.showToast({
              title: '提现成功',
              icon: 'success',
              duration: 2000
              }));
      this.amendCoins(this.data.account)
      this.amendWithdraw(-this.data.account)
      this.payRecord(this.data.account)
      this.closePage()
    }
  },
  //修改钱包金额字段
  amendCoins(coins){
          var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
          todo.increment('coins', -coins);
          todo.save();
  },
  //修改取现账户金额字段
  amendWithdraw(withdraw){
          var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
          todo.increment('withdraw', -withdraw);
          todo.save();
  },

  //Record表，新增交易记录明细
  payRecord(cost){          
          var Record = AV.Object.extend('Record');
          var updateCoins = new Record();
          updateCoins.set('payFor', '提现');
          updateCoins.set('amount',-cost);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {
          }, function (error) {
          });
  },



  closePage(){
          wx.navigateBack({
            delta: 1
          })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(user => 

      this.setData({
          user
      })

      ).then().catch(console.error);
  
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
const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var page_index = 0;
var that = this;
var coins;
var app = getApp();

//固定的费用金额为1，购买点券时，将COST赋值为价格。
var cost = 1;
//微信现金支付抽奖
var t1=0.125
//钱包余额抽奖
var t2=100000
//消费方式
var payFor;
var image;


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
    wx.showShareMenu({
      withShareTicket: true
    })
    var d = new Date();
    image = options.image;
    this.setData({
      options,
      d
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    coins = results.attributes.coins
    msgs = results.attributes.
    that.setData({
      coins:results
    })
    }, function (error) {
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryCount()
    this.queryLotteryTimes()
    this.queryLotteryGetTimes()
  },
  //查询用户是否有抽过奖
   queryCount(){
     var that = this;
      var queryBuyer = new AV.Query('LotteryToday');
      queryBuyer.equalTo('targetUser', AV.Object.createWithoutData('_User', AV.User.current().id));
      var querySeller = new AV.Query('LotteryToday');
      querySeller.equalTo('targetLottery', AV.Object.createWithoutData('Lottery', this.data.options.objectId));
      var query = AV.Query.and(queryBuyer, querySeller);
      query.include('targetUser');
      query.include('targetLottery');
      query.count().then(function (count){
            that.setData({
                count
            })
      })
   },

  bindgetuserinfo(){
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      var nickName = userInfo.nickName;
      var avatarUrl = userInfo.avatarUrl;
      var city = userInfo.city;
      var gender = userInfo.gender;
      var province = userInfo.province;
      const user = AV.User.current();
      user.set('username', nickName);
      user.set('userImage',avatarUrl);
      user.set('city', city);
      user.set('province',province);
      user.set('gender',gender);      
      // 保存到云端
      user.save();
    })
  },
  queryLotteryTimes(){
      var query = new AV.Query('LotteryToday');
      var targetLottery = AV.Object.createWithoutData('Lottery', this.data.options.objectId);
      query.equalTo('targetLottery', targetLottery);
      query.limit(10);
      query.include('targetUser');
      query.descending('createdAt')
      query.find()
            .then(comment => this.setData({ 
                   comment
                   })
            )
           .catch(console.error);
  },

  queryLotteryGetTimes(){
      var queryLottery = new AV.Query('LotteryToday');
      var targetLottery = AV.Object.createWithoutData('Lottery', this.data.options.objectId);
      queryLottery.equalTo('targetLottery', targetLottery);
      var queryGet = new AV.Query('LotteryToday');
      queryGet.equalTo('get', true);
      var query = AV.Query.and(queryLottery, queryGet);
      query.include('targetUser');
      query.descending('createdAt')
      query.find()
            .then(commentGet => this.setData({ 
                   commentGet
                   })
            )
           .catch(console.error);
  },
  

  refrish(){
      var query = new AV.Query('LotteryToday');
      var targetLottery = AV.Object.createWithoutData('Lottery', this.data.options.objectId);
      query.equalTo('targetLottery', targetLottery);
      query.limit(10);
      query.skip(page_index * 10);
      query.include('targetUser');
      query.descending('createdAt')
      query.find()
            .then(comment => this.setData({ 
                   comment :this.data.comment.concat(comment)
                   })
            )
           .catch(console.error);
  },
  bindLucky(){
          var that = this;
            if (AV.User.current().attributes.gender) {
              console.log(this.data.count)
                  if (this.data.count > 0) {
                      return false;
                  } else { 
                        that.lotteryToday()
                        common.showModal('恭喜您获得100积分，积分可以兑换皮肤等好礼。获奖名单将在'+ that.data.options.deadlineTime +'公布，领取奖励时限为48小时,请您及时查收。','抽奖完成')
                              that.setData({
                                  count:1
                              })
                        common.amandIntergal(100)
                        common.addIntergal( '分享' , 100)
                  }
            } else {
                  common.showModal('您好，抽奖需要获得您（昵称、头像）信息。请设置访问权限后再参与抽奖。')
            }
  },
  lotteryToday(){
          var LotteryToday = AV.Object.extend('LotteryToday');
          var updateCoins = new LotteryToday();
          updateCoins.set('product',this.data.options.title);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.set('targetLottery',AV.Object.createWithoutData('Lottery', this.data.options.objectId));
          updateCoins.save()   
  },

  onHide: function () {
      page_index = 0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      page_index = 0;
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
      page_index = ++page_index
      this.refrish()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '1张免费抽奖券，每50人有一人中奖！',
      path: '/pages/lottery/lottery',
      imageUrl:image,
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
              console.log(paramsJson)
              Cloud.run('groupId' ,paramsJson)
            }
          })
      }
    }
  }
})
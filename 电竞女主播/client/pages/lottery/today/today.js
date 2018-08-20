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
var t1=0.2
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
    console.log(AV.User.current())
    common.querySettingMustTrue( '皮肤抽奖','抽奖需获得您的昵称和头像信息，用以在中奖名单中公布。')
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

  bindLuckyShare(e){
    console.log(e.detail.formId)
          common.addFormId(e.detail.formId)
          var that = this;

            if (!AV.User.current().attributes.userImage) {
              common.showModal('您好，抽奖需要获得您（昵称、头像）信息。请设置访问权限后再参与抽奖。')

            } else {
                  if (that.data.count > 0) {
                      return false;
                  } 
                  else { 
                        that.lotteryToday()
                        common.showModal('恭喜您获得50积分，积分可以兑换皮肤等好礼。获奖名单将在'+ that.data.options.deadlineTime +'公布，领取奖励时限为48小时,请您及时查收。','抽奖完成')
                              that.setData({
                                  count:1
                              })
                        common.amandIntergal(50)
                        common.addIntergal( '分享' , 50)
                  }   
            }
  },

  bindLucky(e){
    console.log(e.detail.formId)
          common.addFormId(e.detail.formId)
          var that = this;

            if (!AV.User.current().attributes.userImage) {
                  common.showModal('您好，抽奖需要获得您（昵称、头像）信息。请设置访问权限后再参与抽奖。')

            } else {
                      if (that.data.count > 0) {
                            return false;
                      } 
                      else { 
                        that.lotteryToday()
                        common.showModal('恭喜您完成抽奖。获奖名单将在'+ that.data.options.deadlineTime +'公布，领取奖励时限为48小时,请您及时查收。','抽奖完成')
                              that.setData({
                                  count:1
                              })
                      }
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

  queryLotteryTimes(){
      var query = new AV.Query('LotteryToday');
      query.equalTo('targetLottery', AV.Object.createWithoutData('Lottery', this.data.options.objectId));
      query.limit(15);
      query.include('targetUser');
      query.descending('createdAt')
      query.find()
            .then(comment => {
                      var comm = comment.filter(function (x) {
                        return x.attributes.targetUser.attributes.userImage !== undefined;
                      });
                      this.setData({ 
                         comment :comm
                      })
                   }
            )
           .catch(console.error);
  },

  refrish(){
      var query = new AV.Query('LotteryToday');
      query.equalTo('targetLottery', AV.Object.createWithoutData('Lottery', this.data.options.objectId));
      query.limit(15);
      query.skip(page_index * 15);
      query.include('targetUser');
      query.descending('createdAt')
      query.find()
            .then(comment => {
                      var comm = comment.filter(function (x) {
                        return x.attributes.targetUser.attributes.userImage !== undefined;
                      });
                      this.setData({ 
                         comment :this.data.comment.concat(comm)
                      })
                   }
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.lotteryTodaySharePage.title,
      path: app.globalData.confi.lotteryTodaySharePage.path,
      imageUrl:image,
      success: function(res) {
        common.addShares()
      }
    }
  }
})
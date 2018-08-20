const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var page_index = 0;
var page_size = 30;
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
var deadline;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    countDownHour: 0,  
    countDownMinute: 0,  
    countDownSecond: 0,  
    indexArray:[1,2,3,4,5],
    arrays:[1,2,3,4,5,6,7,8,9,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(AV.User.current())
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setTime(deadline)
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

  bindtapAd(){
      console.log(123)
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
  setTime(deadline){
    var totalSecond = Date.parse(new Date(deadline))/1000 - Date.parse(new Date())/1000;  
    console.log(totalSecond)
    var interval = setInterval(function () {  
      // 秒数  
      var second = totalSecond;  
  
      // 天数位  
      var day = Math.floor(second / 3600 / 24);  
      var dayStr = day.toString();  
      if (dayStr.length == 1) dayStr = '0' + dayStr;  
  
      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);  
      var hrStr = hr.toString();  
      if (hrStr.length == 1) hrStr = '0' + hrStr;  
  
      // 分钟位  
      var min = Math.floor((second - day * 3600 *24 - hr * 3600) / 60);  
      var minStr = min.toString();  
      if (minStr.length == 1) minStr = '0' + minStr;  
  
      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min*60;  
      var secStr = sec.toString();  
      if (secStr.length == 1) secStr = '0' + secStr;  
  
      this.setData({  
        countDownDay: dayStr,  
        countDownHour: hrStr,  
        countDownMinute: minStr,  
        countDownSecond: secStr,  
      });  
      totalSecond--;  
      if (totalSecond < 0) {  
        clearInterval(interval);   
        this.setData({  
          countDownDay: '00',  
          countDownHour: '00',  
          countDownMinute: '00',  
          countDownSecond: '00',  
        });  
      }  
    }.bind(this), 1500);  
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
          updateCoins.set('content',this.data.options.content);
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
      wx.showLoading({
        title: '加载中',
      })
      this.refrish()
  },

  queryLotteryTimes(){
      console.log(this.data.options.objectId)
      var query = new AV.Query('LotteryToday');
      query.equalTo('targetLottery', AV.Object.createWithoutData('Lottery', this.data.options.objectId));
      query.limit(page_size);
      query.include('targetUser');
      query.descending('createdAt')
      query.find()
            .then(comment => {
                      console.log('我是comment')
                      console.log(comment)
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
      query.limit(page_size);
      query.skip(page_index * page_size);
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
            .then(() => {
              wx.hideLoading()
            })
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
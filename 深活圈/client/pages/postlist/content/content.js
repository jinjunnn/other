// pages/detail/detail.js
const AV = require('../../../utils/av-live-query-weapp-min');
const bind = require('../../../utils/live-query-binding');
const common = require('../../../model/common');
var app = getApp();
var objectId;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    indicatorDots:true,
    icons:{
      address: '../../../image/地点.png',
      time: '../../../image/时间.png',
      male: '../../../image/男.png',
      female: '../../../image/女.png',
      share: '../../../image/分享.png',
      homepage: '../../../image/首页.png',
      budget: '../../../image/预算.png',
      question: '../../../image/问号.png',
      deadline: '../../../image/截止.png',
      notification: '../../../image/喇叭.png',
      booking_fee: '../../../image/订金.png'
    },
    summary:'报名成功后不可随意爽约，除了会扣信誉值，爽约1次将得到警告；爽约2次将暂停使用权限。聚会组队成功将以短信通知参与者。',
    hasphonenumber:null,
  },
  onLoad: function (options) {
    let that = this;
    objectId = options.objectId;
    that.parseUserBookedOrNot(options.objectId);
    that.parsePost(options.objectId);
    that.parseBooking(options.objectId);

  },
  //进入到MAP页面
  bindMap(){

      let that = this;
      let lat = that.data.post.attributes.geo.latitude;
      let long = that.data.post.attributes.geo.longitude;
      let shopName = that.data.post.attributes.shopName;
      console.log(lat)
      console.log(long)
      console.log(shopName)
      wx.navigateTo({
        url: '../map/map?endlat=' + lat + '&endlong=' + long + '&endtitle=' + shopName 
      })
  },

  //查询post
  parsePost(id){
    let that = this;
    let now = new Date()
    console.log(now)
    const query = new AV.Query('Post')
    // queryArticle.equalTo('objectId', options.articleObjectId);
    query.include('targetUser');
    query.include('targetTag');
    query.get(id).then(function (post) {

      that.setData({
        post:post,
        deadline: post.attributes.deadline.toLocaleString(),
        dating: post.attributes.dating.toLocaleString(),
        hadfinish: Boolean(now > post.attributes.dating),
        deadlined: Boolean(now > post.attributes.deadline),
      })
    }, function (error) {});
  },

 
  //查询报名的人
  parseBooking(id){
        let that = this;
        let query = new AV.Query('Booking');
        query.equalTo('targetPost', AV.Object.createWithoutData('Post', id));
        query.include('targetUser');
        query.include('targetTag');
        query.find().then(function (bookers) {
              that.setData({
                bookers:bookers,
                numberOfBookers: bookers.length,
              })
        })
  },
  //查询我自己有没有报名
  parseUserBookedOrNot(id) {
    let that = this;
    let queryBooking = new AV.Query('Booking');
    queryBooking.equalTo('targetPost', AV.Object.createWithoutData('Post', id));

    let queryUser = new AV.Query('Booking');
    queryUser.equalTo('targetUser', AV.User.current());

    let query = AV.Query.and(queryBooking, queryUser);
    query.count().then(function (hasBooked) {
      that.setData({
        hasBooked
      })
    })
  },
  submit(){
    let that = this;
    let amount = Number(that.data.post.attributes.booking_fee);
    let method = AV.User.current().attributes.wxname + AV.User.current().attributes.phone + '预定' + that.data.post.attributes.title;
    console.log(AV.User.current().attributes.wxname)
    console.log(amount)
    console.log(method)
    that.donate(amount,method)
  },

  //  获取用户的手机号码
  bindGetPhoneNumber(e){
        let paramsJson = {
          res: e.detail,
        }
        let that = this;
        console.log(e)
        wx.checkSession({
          success: function () {
              that.getPhoneNumber(paramsJson)
          },
          fail: function () {
                  wx.navigateTo({
                    url: '../../user/login/login'
                  })
          }
        })
  },
  //返回首页
  bindBackHomePage(){

        wx.reLaunch({
          url: '../postlist'
        })
  },


  //提交到云引擎  发送模板消息。
  sendTemplateMessage(e) {
    let that = this;
    let paramsJson = {
      dateToday: date,
      lotterys: lottery,
      lotterysNew: lotteryNew
    };
    AV.Cloud.run('sendTemplateMessage', paramsJson).then(function (data) {
      console.log(data)
      }).catch(console.error);
  },

  //提交到云引擎  解密换回手机号码。
   getPhoneNumber(e){
    let that = this;
    let amount = Number(that.data.post.attributes.booking_fee);
    let method = AV.User.current().attributes.wxname + AV.User.current().attributes.phone + '预定' + that.data.post.attributes.title;

            AV.Cloud.run('getPhoneNumber', e).then(function (data) {
                      console.log(data.phoneNumber)
                      const user = AV.User.current();
                      user.set('phone', data.phoneNumber);
                      user.save().then(() => {
                            that.donate(amount, method)
                      }).catch(console.error);
                     //这里写代码，把手机号码data.phoneNumber存到用户账号中then（）

              })
  },
  //创建抽奖订单
  donate(amount,method) {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
    let paramsJson = {
      productDescription: method,
      amount: amount * 100,
    }
    AV.Cloud.run('order', paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //支付成功后的业务逻辑
        this.booking(objectId)
        // setTimeout(this.refreshOrders.bind(this), 2000);
      }
      data.fail = ({
        errMsg
      }) => this.setData({
        error: errMsg
      });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({
        error: error.message
      });
      wx.hideToast();
    })
  },
  //记录用户的预定信息
  booking(id){
    console.log('进入booking流程')
    let that = this;
    let Booking = AV.Object.extend('Booking');
    let booking = new Booking();
    booking.set('targetPost', AV.Object.createWithoutData('Post', id));
    booking.set('targetUser', AV.User.current());
    booking.save().then(function (todo) {
      let c = '报名成功';
      that.parseBooking(objectId);
      that.setData({
        hasBooked : true
      })

      let dating = that.data.dating;
      let address = that.data.post.attributes.shopName;
      let phone = that.data.post.attributes.targetUser.attributes.phone;
      let username = AV.User.current().attributes.wxname;

      let params = 'username=' + AV.User.current().attributes.wxname + '&dating=' + that.data.dating + '&address=' + that.data.post.attributes.shopName + '&phone=' + that.data.post.attributes.targetUser.attributes.phone
      console.log(params)
      wx.navigateTo({
        url: '../success/success?'+ params
      })
    }, function (error) {
      console.error(error);
    });
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
       let that = this;
       if (!AV.User.current()) {
         wx.navigateTo({
           url: '../../user/login/login'
         })
       } else if (!Boolean(AV.User.current().attributes.phone)) {
         that.setData({
           hasphonenumber: false
         })
       } else {
         that.setData({
           hasphonenumber: true
         })
       }
  },
  //用户点击问号按钮，提示用户活动定金是怎么收取
  bindNotice(){
        common.showModal('订金是深活圈平台收取的费用，点击参与付费后，不予退回，感谢。')
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

  },

})
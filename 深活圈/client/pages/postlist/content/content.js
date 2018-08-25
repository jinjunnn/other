// pages/detail/detail.js
const AV = require('../../../utils/av-live-query-weapp-min');
const bind = require('../../../utils/live-query-binding');
const common = require('../../../model/common');
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    indicatorDots:true,
    icons:{
      notification: 'https://wx.qlogo.cn/mmopen/vi_32/rG1ZplIRNqr0UW7F14jg6iaRpacxKKia91eA1m9ib21mvic9bf3WxqcHsfzYic2KBBRsjnibW1JjZjibn5RdhazV3oEzw/132',
      tags:{
        food: 'https://wx.qlogo.cn/mmopen/vi_32/rG1ZplIRNqr0UW7F14jg6iaRpacxKKia91eA1m9ib21mvic9bf3WxqcHsfzYic2KBBRsjnibW1JjZjibn5RdhazV3oEzw/132',
      },
    },
    summary:'报名成功后不可随意爽约，除了会扣信誉值，爽约1次将得到警告；爽约2次将暂停使用权限。聚会组队成功将以短信通知参与者。',
  },
  onLoad: function (options) {
    let that = this;
    let objectId = options.objectId;
    that.parsePost(options.objectId);
    that.parseBooking(options.objectId);

  },

  bindMap(){
      wx.navigateTo({
        url: '../map/map'
      })
  },

  //查询post
  parsePost(id){
    let that = this;
    const query = new AV.Query('Post')
    // queryArticle.equalTo('objectId', options.articleObjectId);
    query.include('targetUser');
    query.include('targetTag');
    query.get(id).then(function (post) {

      // //创建一个数组，并将位置信息储存在数组[0]中
      // var markers = [{
      //   iconPath: "/image/地图标记.png",
      //   id: 0,
      //   latitude: article._serverData.lat,
      //   longitude: article._serverData.lng,
      //   width: 50,
      //   height: 50
      // }];
      that.setData({
        post
        // markers: markers,
      })
    }, function (error) {});
  },

 
  //查询报名的人
  parseBooking(id){
        let that = this;
        let query = new AV.Query('Booking');
        query.equalTo('targetPost', AV.Object.createWithoutData('Post', id));
        query.include('targetUser');
        query.find().then(function (bookers) {
              that.setData({
                bookers
              })
        })
  },

  submit(){
    let that = this;
        if (!app.globalData.hasLogin) {
          wx.navigateTo({
            url: '../../user/login/login'
          })
        }  else if(condition){
        
        
      }   else {
              let amount = Number(that.data.post.booking_fee);
              let method = '预定' + that.data.post.title;
              console.log(amount)
              console.log(method)
              that.donate(1,"haha")
        }
  },

  //  获取用户的手机号码
  bindgetuserinfo(e){

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


  //提交到云引擎  解密换回手机号码。
   getPhoneNumber(e){
            AV.Cloud.run('getPhoneNumber', e).then(function (data) {
                     console.log(data)
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
      amount: amount * 1,
    }
    AV.Cloud.run('order', paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //支付成功后的业务逻辑
        this.booking(objectId)
        setTimeout(this.refreshOrders.bind(this), 1500);
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

  booking(id){
    console.log('进入booking流程')
    let Booking = AV.Object.extend('Booking');
    let booking = new Booking();
    booking.set('targetPost', AV.Object.createWithoutData('Post', id));
    booking.set('targetUser', AV.User.current());
    booking.save().then(function (todo) {
      console.log('objectId is ' + todo.id);
    }, function (error) {
      console.error(error);
    });
  },
  // toggleLike: function () {
  //   if (this.data.count == 0) {
  //     var status = new AV.Status();
  //     var targetArticle = AV.Object.createWithoutData('Article', this.options.articleObjectId);
  //     status.set('targetArticle', targetArticle);
  //     status.send().then(function () {}, function (err) {
  //       console.dir(err);
  //     });
  //     var query = AV.Status.statusQuery(AV.User.current());
  //     query.find().then(function (statuses) {});
  //     var count = this.data.count + 1;
  //     this.setData({
  //       count
  //     })
  //   } else {
  //     const queryUser = new AV.Query('_Status')
  //     var queryUser = AV.Status.statusQuery(AV.User.current());
  //     const queryArticle = new AV.Query('_Status')
  //     queryArticle.equalTo('targetArticle', AV.Object.createWithoutData('Article', this.options.articleObjectId));
  //     var query = AV.Query.and(queryUser, queryArticle);
  //     query.find().then(function (statuses) {
  //       var like = AV.Object.createWithoutData('_Status', statuses[0].id);
  //       like.destroy().then(function (success) {}, function (error) {});
  //     });
  //     var count = this.data.count - 1;
  //     this.setData({
  //       count
  //     })
  //   }
  // },
  // setWishList() {
  //   if (this.data.count == 0) {
  //     var status = new AV.Status();
  //     var targetArticle = AV.Object.createWithoutData('Article', this.options.articleObjectId);
  //     status.set('targetArticle', targetArticle);
  //     status.send().then(function () {}, function (err) {
  //       console.dir(err);
  //     });
  //     var query = AV.Status.statusQuery(AV.User.current());
  //     query.find().then(function (statuses) {});
  //     var count = this.data.count + 1;
  //     this.setData({
  //       count
  //     })
  //   } else {
  //     const queryUser = new AV.Query('_Status')
  //     var queryUser = AV.Status.statusQuery(AV.User.current());
  //     const queryArticle = new AV.Query('_Status')
  //     queryArticle.equalTo('targetArticle', AV.Object.createWithoutData('Article', this.options.articleObjectId));
  //     var query = AV.Query.and(queryUser, queryArticle);
  //     query.find().then(function (statuses) {
  //       var like = AV.Object.createWithoutData('_Status', statuses[0].id);
  //       like.destroy().then(function (success) {}, function (error) {});
  //     });
  //     var count = this.data.count - 1;
  //     this.setData({
  //       count
  //     })
  //   }
  // },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
       let that = this;
       if (!AV.User.current()) {
         that.setData({
           opendata: 'getUserInfo'
         })
         wx.navigateTo({
           url: '../../user/login/login'
         })
       } else if (!Boolean(AV.User.current().attributes.phone)) {
         that.setData({
           opendata: 'getPhoneNumber'
         })
       } else {

       }
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
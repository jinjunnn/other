const AV = require('../utils/av-live-query-weapp-min');
const Order = require('./order');
const { User, Query, Cloud } = require('../utils/av-live-query-weapp-min');
var app = getApp();
  //用户登录
  function login() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log('用户没有授权')
        } else {
          wx.showToast({
            title: '授权登录中',
            icon: 'loading',
            duration: 8000
          })
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              that.setData({
                hasLogin: true
              })
              var code = res.code
              console.log(code)
              wx.getUserInfo({
                withCredentials: true,
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  var paramsJson = {
                    code: code,
                    res: res,
                  }
                  AV.Cloud.run('wxLogin', paramsJson).then(function (data) {
                    AV.User.loginWithAuthDataAndUnionId({
                      uid: data.openid,
                      access_token: data.token,
                    }, 'weapp_shenhuoquan', data.unionid, {
                      unionIdPlatform: 'weixin', // 指定为 weixin 即可通过 unionid 与其他 weixin 平台的帐号打通
                      asMainAccount: false,
                    }).then(function (usr) {
                      app.globalData.userInfo = res.userInfo
                      typeof cb == "function" && cb(app.globalData.userInfo)
                      const user = AV.User.current();
                      user.set('wxname', res.userInfo.nickName);
                      user.set('userImage', res.userInfo.avatarUrl);
                      user.set('city', res.userInfo.city);
                      user.set('province', res.userInfo.province);
                      user.save().then(() => {
                        app.globalData.hasLogin = true
                        wx.hideToast()
                        wx.navigateBack({
                          delta: 1
                        })
                      }).catch(console.error);
                    }).catch(console.error);
                  }).catch(console.error);
                },
                fail: res => {
                  wx.showLoading({
                    title: '未登录',
                    mask: true,
                  })
                }
              })
            }
          });
        }
      }
    })
  }

  //PlayOrder表  修改订单状态
  function amendStasus(targetUser , status){
          var bill = AV.Object.createWithoutData('PlayOrder', targetUser);
          bill.set('status', status);
          bill.save();
  }

  //User表  修改钱包coins字段（余额）
  function amendCoins(coins){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('coins', coins);
          bill.save();
  }

  //User表  修改钱包Intergal字段（余额）
  function amendIntergal(intergal){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('Intergal', intergal);
          bill.save();
  }

  //User表  修改钱包deposit字段（余额）
  function amendDeposit(deposit,mode){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('deposit', deposit);
          bill.set('depositStatus', mode);
          bill.save();
  }

  //User表  向formId array新增加新的字段
  function addFormId(formId){
          var date = new Date();

          var FormId = AV.Object.extend('FormId');
          var form = new FormId();

          form.set('date', date);
          form.set('formId',formId);
          form.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          form.save().then(function (todo) {
            console.log(todo)
          }, function (error) {
          });
  }

  //User表  修改钱包coins字段（余额）
  function amendIncomes(incomes){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('incomes', incomes);
          bill.save();
  }

  //User表  修改钱包coins字段（余额）
  function amendWithdraw(withdraw){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('withdraw', withdraw);
          bill.save();
  }

  //User表  修改钱包intergal字段（余额）
  function amandIntergal(Intergal){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('Intergal', Intergal);
          bill.save();
  }

  //User表  修改钱包expenses字段（消费）
  function amendExpenses(expenses){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('expenses', expenses);
          bill.save();
  }

  //record表新增一条记录，cause是添加原因，cost是金额。
  function addRecord(cause , cost){
          var Record = AV.Object.extend('Record');
          var updateCoins = new Record();
          updateCoins.set('payFor', cause);
          updateCoins.set('amount',cost);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
          updateCoins.save().then(function (todo) {
          }, function (error) {
          });
  }

  //Notice添加一条通知from 是通知人，targetuser是被通知人，message是消息内容。
  function sendNotice(from , message){
      var Notice = AV.Object.extend('Notice');
      var order = new Notice();
      order.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('From', from);
      order.set('message',message);
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });
  }

  //Intergal表，添加一条通知 from 是通知人，targetuser是被通知人，message是消息内容。
  function addIntergal(way , amount){
      var Intergal = AV.Object.extend('Intergal');
      var order = new Intergal();
      order.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('way', way);
      order.increment('amount',amount);
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });
  }

  //客服消息 发送sms
  function sendSMS(number, template, others){
        AV.Cloud.requestSmsCode({
        mobilePhoneNumber: number,
        template: template,
        sign:'王者秒约',
        others: others
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
  }

  function showTip(sms, icon, fun, t) {
      if (!t) {
        t = 1000;
      }
      wx.showToast({
        title: sms,
        icon: icon,
        duration: t,
        success: fun
      })
  }
  function showModal(c, t, fun) {
    if (!t)
      t = '提示'
    wx.showModal({
      title: t,
      content: c,
      showCancel: false,
      success: fun
    })
  }



module.exports.amendIntergal = amendIntergal;  
module.exports.sendSMS = sendSMS;
module.exports.addFormId = addFormId;
module.exports.amendDeposit = amendDeposit;
module.exports.amandIntergal = amandIntergal;
module.exports.addIntergal = addIntergal;
module.exports.amendStasus = amendStasus;
module.exports.amendCoins = amendCoins;
module.exports.amendIncomes = amendIncomes;
module.exports.amendWithdraw = amendWithdraw;
module.exports.amendExpenses = amendExpenses;
module.exports.addRecord = addRecord;
module.exports.sendNotice = sendNotice;
module.exports.showTip = showTip;
module.exports.showModal = showModal;
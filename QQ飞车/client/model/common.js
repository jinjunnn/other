const AV = require('../utils/av-live-query-weapp-min');
const Order = require('./order');
const { User, Query, Cloud } = require('../utils/av-live-query-weapp-min');
var app = getApp();



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

  //User表  修改钱包coins字段（余额）
  function addHappyLot(coins){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('happyCoins', coins);
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
  function amandIntergal(intergal){
          var bill = AV.Object.createWithoutData('_User', AV.User.current().id);
          bill.increment('Intergal', intergal);
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

  //HappyCoins表，添加一条通知 from 是通知人，targetuser是被通知人，message是消息内容。
  function addHappyLotNotice(way , amount){
      var HappyCoins = AV.Object.extend('HappyCoins');
      var order = new HappyCoins();
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
  //设置用户权限
  function  setting(){
    wx.openSetting({
      success: (res) => {
                    if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                      //调用应用实例的方法获取全局数据
                                      app.getUserInfo(function (userInfo) {
                                        console.log(userInfo)
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
                              }
          })
        }
      }
    })
  }
  //查询用户的授权数据
  function querySetting(title, content){
    wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo']) {
                wx.showModal({
                  title: title,
                  content: content,
                  success: function(res) {
                    if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                      app.getUserInfo(function (userInfo) {
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
                              }
                            })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
          }
        }
      })
  }
  //查询用户的授权数据，用户取消返回‘我的页面’
  function querySettingMustTrue(title, content){
    wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo']) {
                wx.showModal({
                  title: title,
                  content: content,
                  success: function(res) {
                    if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                      app.getUserInfo(function (userInfo) {
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
                              }
                            })
                    } else if (res.cancel) {
                          wx.switchTab({
                            url: '/pages/user/user'
                          })
                    }
                  }
                })
          }
        }
      })
  }

module.exports.addHappyLot = addHappyLot;  
module.exports.addHappyLotNotice = addHappyLotNotice;  
module.exports.querySettingMustTrue = querySettingMustTrue;  
module.exports.amendIntergal = amendIntergal;  
module.exports.sendSMS = sendSMS;
module.exports.querySetting = querySetting;
module.exports.setting = setting;
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
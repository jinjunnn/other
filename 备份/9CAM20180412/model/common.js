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

  //Intergal表，添加一条通知from 是通知人，targetuser是被通知人，message是消息内容。
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
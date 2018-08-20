const AV = require('../utils/av-live-query-weapp-min');
const Order = require('./order');
const { User, Query, Cloud } = require('../utils/av-live-query-weapp-min');

  //PlayOrder表  修改订单状态
  function amendStasus(targetUser , status){
          var bill = AV.Object.createWithoutData('PlayOrder', targetUser);
          bill.set('status', status);
          bill.save();
  }

  //record表新增一条记录，cause是添加原因，cost是金额。
  function addRecord(cause,cost,user){
          var Record = AV.Object.extend('Record');
          var updateCoins = new Record();
          updateCoins.set('payFor', cause);
          updateCoins.set('amount',cost);
          updateCoins.set('targetUser',AV.Object.createWithoutData('_User', user));
          updateCoins.save().then(function (todo) {
          }, function (error) {
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

module.exports.amendStasus = amendStasus;
module.exports.addRecord = addRecord;
module.exports.showTip = showTip;
module.exports.showModal = showModal;
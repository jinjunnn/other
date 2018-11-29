const axios = require('axios');
const APPID = process.env.WEIXIN_APPID;
const APPSECRET = process.env.WEIXIN_APPSECRET;
const uuid = require('uuid/v4');
const AV = require('leanengine');
const Order = require('./order');
const wxpay = require('./wxpay');
const { getAccessToken } = require('./access-token');
var WXBizDataCrypt = require('./WXBizDataCrypt');


/**
 * 更新用户信息  包括 unionid等信息
 */

AV.Cloud.define('wxLogin', (request, response) => {
        axios.get('https://api.weixin.qq.com/sns/jscode2session', {
            params: {
              grant_type: 'authorization_code',
              appid: APPID,
              secret: APPSECRET,
              js_code:request.params.code,
            }
          }).then(({data : { openid, session_key, unionid, errcode, errmsg }}) => {
            if (errcode) {
              console.error(errcode, errmsg);
              throw new Eror(errmsg);
            }
        const appId = process.env.WEIXIN_APPID;
        const sessionKey = session_key;
        const openId = openid;
        const encryptedData = request.params.res.encryptedData;
        const iv = request.params.res.iv;
        var pc = new WXBizDataCrypt(appId, sessionKey);
        var data = pc.decryptData(encryptedData , iv);
        console.log('解密后unionid: ', data);
        getAccessToken().then(function(token) {
                              const userinfo = {
                                openid: openId,
                                token: sessionKey,
                                unionid: data.unionId,
                              };
                              response.success(userinfo);
                              }).catch(function(error) {
                                console.error("我是error= ", error);
                              });
                        }).catch(function(error) {
                        });
});

/**
 * 解密用户的手机号码
 */
AV.Cloud.define('getPhoneNumber', (request, response) => {
    const appId = process.env.WEIXIN_APPID;
    const sessionKey = request.currentUser.get('authData').weapp_shenhuoquan.access_token;
    const encryptedData = request.params.res.encryptedData;
    const iv = request.params.res.iv;
    if (!request.currentUser) {
      return response.error(new Error('用户未登录'));
    }
    var pc = new WXBizDataCrypt(appId, sessionKey);
    var data = pc.decryptData(encryptedData, iv);
    response.success(data);
});


//发送模板消息
AV.Cloud.define('sendTemplateMessage', function(request) {
          var query = new AV.Query('FormId');
          query.limit(1000);
          query.greaterThanOrEqualTo('createdAt', request.params.dateToday);
          query.include('targetUser');
          query.ascending('createdAt');
          return query.find().then(function (results) {
            results.forEach(function(result) {
                var d = new Date();
                var dateToday = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '-'
                const order = new Order();
                order.sendTemplateMessage(result.attributes.formId, result.attributes.targetUser.attributes.authData.lc_weapp.openid, dateToday, request.params.lotterys, request.params.lotterysNew)
            });
            return AV.Object.destroyAll(results);
          }).then(function (error) {
            // 异常处理
          });

});

//发送支付的模板消息
AV.Cloud.define('sendPayTemplateMessage', function(request) {
          var query1 = new AV.Query('Order');
          query1.greaterThanOrEqualTo('createdAt', request.params.dateToday);
          var query2 = new AV.Query('Order');
          query2.equalTo('status', 'SUCCESS');
          var query = AV.Query.and(query1, query2);
          query.limit(1000);
          query.include('user');
          query.ascending('createdAt');
          return query.find().then(function (results) {
            console.log(results.length)
            results.forEach(function(result) {
                var d = new Date();
                var dateToday = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' '
                const order = new Order();
                order.sendTemplateMessage(result.attributes.prepayId, result.attributes.user.attributes.authData.lc_weapp.openid, dateToday, request.params.lotterys, request.params.lotterysNew)
            });
          }).then(function (error) {
            // 异常处理
          });

});

//获取二维码
AV.Cloud.define('sendQRCode', function(request) {
          const order = new Order();
          var qRCode = order.sendQRCode(request.params.paths,request.params.scene);
          var query = new AV.Query('_User');
          console.log(999)                
          var user = AV.Object.createWithoutData('_User',request.currentUser.id);
          user.set('qRCode', qRCode);
          user.save().then(()=>{
            return true;
          });
});

/** 
 * 小程序创建订单
 */
AV.Cloud.define('order', (request, response) => {
  const user = request.currentUser;
  if (!user) {
    return response.error(new Error('用户未登录'));
  }
  const authData = user.get('authData');
  // if (!authData || !authData.lc_weapp) {
  //   return response.error(new Error('当前用户不是小程序用户'));
  // }
  const order = new Order();
  order.tradeId = uuid().replace(/-/g, '');
  order.status = 'INIT';
  order.user = request.currentUser;
  order.productDescription = request.params.productDescription;
  order.amount = request.params.amount;
  order.itemId = request.params.itemId;
  order.times = request.params.times;
  order.ip = request.meta.remoteAddress;
  if (!(order.ip && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(order.ip))) {
    order.ip = '127.0.0.1';
  }
  order.tradeType = 'JSAPI';
  const acl = new AV.ACL();
  // 只有创建订单的用户可以读，没有人可以写
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, false);
  order.setACL(acl);
  order.place().then(() => {
    console.log(`预订单创建成功：订单号 [${order.tradeId}] prepayId [${order.prepayId}]`);
    const payload = {
      appId: process.env.WEIXIN_APPID,
      timeStamp: String(Math.floor(Date.now() / 1000)),
      package: `prepay_id=${order.prepayId}`,
      signType: 'MD5',
      nonceStr: String(Math.random()),
    }
    payload.paySign = wxpay.sign(payload);
    response.success(payload);
  }).catch(error => {
    console.error(error);
    response.error(error);
  });
});

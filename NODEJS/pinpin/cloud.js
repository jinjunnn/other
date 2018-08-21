const axios = require('axios');

const APPID = process.env.WEIXIN_APPID;
const APPSECRET = process.env.WEIXIN_APPSECRET;
const uuid = require('uuid/v4');
const AV = require('leanengine');
const Order = require('./order');
const wxpay = require('./wxpay');
const { getAccessToken } = require('./access-token')
var WXBizDataCrypt = require('./WXBizDataCrypt');
var users;
var userArrayId;

/**
 * 获取转发群id  router
 */
AV.Cloud.define('groupId', (request, response) => {

    const user = request.params.user;
    const sessionKey = request.params.sessionKey;
    const appId = process.env.WEIXIN_APPID;
    const encryptedData = request.params.encryptedData;
    const iv = request.params.iv;
    console.log(request.params)
    console.log(appId)
    var pc = new WXBizDataCrypt(appId, sessionKey)
    var data = pc.decryptData(encryptedData , iv)

      // 声明类型
    var GroupShare = AV.Object.extend('GroupShare');
    var groupShare = new GroupShare();
    groupShare.set('groupInfo',data);
    groupShare.set('targetUser', AV.Object.createWithoutData('_User', user));
    groupShare.save()
});
//定时器，用于90分钟 新建一些虚假数据
AV.Cloud.define('update_lotterys', function(request){
      var query = new AV.Query('Lottery');
      query.equalTo('displayOrNot',true);
      query.limit(1000);
      query.find().then(function (results) {
        console.log(results.length)
          results.forEach(function(result) {
            var number = Math.floor(Math.random()*(result.attributes.price/5));
            result.increment('timesGet', 1);
            result.increment('timesLottery', number)
          });
          return AV.Object.saveAll(results);
        });
});
//定时器，用于90分钟 新建一些虚假数据
AV.Cloud.define('update_lotteryGet', function(request){
      var queryConfi = new AV.Query('Confi');
      queryConfi.get('5a7f18be0b616000381ac3ca').then(function (confi) {
      users = confi.attributes.users;
      }, function (error) {
        // 异常处理
      });

      var query = new AV.Query('Lottery');
      query.equalTo('displayOrNot',true);
      query.limit(1000);
      query.find().then(function (results) {
          results.forEach(function(result) {
            console.log(result.id)
            console.log(users)
            console.log(users)
            userArrayId = Math.floor(Math.random()*users.length);
            var LotteryGet = AV.Object.extend('LotteryGet');
            var lotteryGet = new LotteryGet();
            lotteryGet.set('get', true);
            lotteryGet.set('targetLottery', AV.Object.createWithoutData('Lottery',result.id));
            lotteryGet.set('targetUser', AV.Object.createWithoutData('_User',users[userArrayId]));
            lotteryGet.save().then(function(user) {
                                console.log("我是user= ", user)
                              }).catch(function(error) {
                                console.error("我是error= ", error);
                              });
          });
        });
});
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
            console.log("我是session_key"+session_key)
            console.log("我是openid"+openid)
            console.log("我是openid"+userInfo)
        const appId = process.env.WEIXIN_APPID;
        const sessionKey = session_key;
        const openid = openid;
        const encryptedData = request.params.encryptedData;
        const iv = request.params.iv;

        var pc = new WXBizDataCrypt(appId, sessionKey)
        var data = pc.decryptData(encryptedData , iv)
        console.log('解密后 data: ', data)

        getAccessToken().then(function(token) {
                              console.log('getAccessToken='+token)
                              AV.User.signUpOrlogInWithAuthDataAndUnionId({
                                uid: openid,
                                access_token: token,
                                expires_in: 1382686496
                              }, 'weixin', data.unionId, {
                                unionIdPlatform: 'weixin',
                                asMainAccount: false,
                              }).then(function(user) {
                                console.log("我是user= " + user)
                                      // that.globalData.userInfo = res.userInfo
                                      // typeof cb == "function" && cb(that.globalData.userInfo)
                                      //     var nickName = res.userInfo.nickName;
                                      //     var avatarUrl = res.userInfo.avatarUrl;
                                      //     var city = res.userInfo.city;
                                      //     var gender = res.userInfo.gender;
                                      //     var province = res.userInfo.province;
                                      //     const user = AV.User.current();
                                      //     user.set('username', nickName);
                                      //     user.set('userImage',avatarUrl);
                                      //     user.set('city', city);
                                      //     user.set('province',province);
                                      //     user.set('gender',gender);      
                                      //     user.save();
                              }).catch(function(error) {
                                console.error("我是error= ", error);
                              });
                        }).catch(function(error) {
                        });

          })

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

//定时云函数 wepay_id 发送消息
AV.Cloud.define('wepayId', (request, response) => {
  var d = new Date();
  console.log(d.getFullYear)

});

//定时云函数addID任何一个字段
AV.Cloud.define('addUserId', function(request) {
      var id = request.params.id;
      var cl = request.params.cl;

          var query = new AV.Query(cl);
          query.doesNotExist('id');
          query.limit(2);
          query.ascending('createdAt');
          return query.find().then(function (results) {
            results.forEach(function(result) {
              result.set('id', ++id);
            });
            return AV.Object.saveAll(results);
          }).then(function(results) {

          }, function (error) {
            // 异常处理
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
  if (!authData || !authData.lc_weapp) {
    return response.error(new Error('当前用户不是小程序用户'));
  }
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

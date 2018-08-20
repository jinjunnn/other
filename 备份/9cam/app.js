const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var id = 0;
var referrerInfos = {};

AV.init({
  appId: 'eKooU7lJTtg8fQ2gV6tIkqQW-gzGzoHsz',
  appKey: 'BzOCpoUOW2pfaV8PMh4JHfhC',
});

const realtime = new Realtime({
  appId: 'eKooU7lJTtg8fQ2gV6tIkqQW-gzGzoHsz',
  appKey: 'BzOCpoUOW2pfaV8PMh4JHfhC',
  region: 'cn',
  noBinary: true,
});

App({
  onLaunch: function (options) {

  },
  onHide: function () {

  },

  onShow: function (options) {

    this.login()
    this.getUserInfo()
    this.setConfi()
  },

  setConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a6492c61b69e60066f379a7').then(function (confi) {
         that.globalData.confi = confi.attributes
    }, function (error) {
      // 异常处理
    });
  },
  login: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp())
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
              var nickName = res.userInfo.nickName;
              var avatarUrl = res.userInfo.avatarUrl;
              var city = res.userInfo.city;
              var gender = res.userInfo.gender;
              var province = res.userInfo.province;
              const user = AV.User.current();
              user.set('username', nickName);
              user.set('userImage',avatarUrl);
              user.set('city', city);
              user.set('province',province);
              user.set('gender',gender);      
              user.save();
        }
      })
    }
  },
  // login: function () {
  //   console.log('登录操作')
  //   return AV.Promise.resolve(AV.User.current()).then(user =>
  //     user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
  //   ).then(user => user ? user : AV.User.loginWithWeapp()
  //   );

  //   // 登录
  //   // wx.login({
  //   //   success: res => {
  //   //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //   //     var code = res.code
  //   //       // 获取用户信息
  //   //       wx.getSetting({
  //   //         withCredentials:true,
  //   //         long:'zh_CN',
  //   //         success: res => {
  //   //             wx.getUserInfo({
  //   //               success: res => {
  //   //                 // 可以将 res 发送给后台解码出 unionId
  //   //                 console.log('登录'+ code)
  //   //                 console.log('res=')
  //   //                 console.log(res.userInfo)
  //   //                 var paramsJson = {
  //   //                     code:code,
  //   //                     res:res,
  //   //                     }
  //   //                 AV.Cloud.run('wxLogin',paramsJson).then(function(data) {
  //   //                   console.log('data=')
  //   //                   console.log(data)
  //   //                 }, function(err) {
  //   //                   console.log('err='+err)
  //   //                 });
  //   //               }
  //   //             })
  //   //         },
  //   //         fail: res => {
  //   //           console.log('获得用户数据被拒绝')
  //   //         }
  //   //       })
  //   //   }
  //   // })
  // },
  // getUserInfo: function (cb) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   } else {
  //     //调用登录接口
  //     wx.getUserInfo({
  //       withCredentials: true,
  //       success: function (res) {
  //         console.log(res)
  //         // wx.checkSession({
  //         //   success: function(){
  //         //               console.log('sessionKey有效')
  //         //               var encryptedData = res.encryptedData;
  //         //               var iv = res.iv;
  //         //               var paramsJson = {
  //         //                   sessionKey:AV.User.current().attributes.authData.lc_weapp.session_key,
  //         //                   user:AV.User.current().id,
  //         //                   encryptedData: encryptedData,
  //         //                   iv: iv,
  //         //                   }
  //         //               AV.Cloud.run('setUserInfo' ,paramsJson).then(function(data) {
  //         //                 console.log('data='+data.id)
  //         //               }, function(err) {
  //         //                 console.log('err='+err)
  //         //               });
  //         //   },
  //         //   fail: function(){
  //         //      AV.User.loginWithWeapp().then(()=>{
  //         //               console.log('sessionKey过期')
  //         //               var encryptedData = res.encryptedData;
  //         //               var iv = res.iv;
  //         //               var paramsJson = {
  //         //                   sessionKey:AV.User.current().attributes.authData.lc_weapp.session_key,
  //         //                   user:AV.User.current().id,
  //         //                   encryptedData: encryptedData,
  //         //                   iv: iv,
  //         //                   }
  //         //               AV.Cloud.run('setUserInfo' ,paramsJson).then(function(data) {
  //         //                 console.log('data='+data.id)
  //         //               }, function(err) {
  //         //                 console.log('err='+err)
  //         //               });
  //         //      })
  //         //   }
  //         // })
  //         that.globalData.userInfo = res.userInfo
  //         typeof cb == "function" && cb(that.globalData.userInfo)
  //             var nickName = res.userInfo.nickName;
  //             var avatarUrl = res.userInfo.avatarUrl;
  //             var city = res.userInfo.city;
  //             var gender = res.userInfo.gender;
  //             var province = res.userInfo.province;
  //             const user = AV.User.current();
  //             user.set('username', nickName);
  //             user.set('userImage',avatarUrl);
  //             user.set('referrerId',id)
  //             user.set('referrerInfo',referrerInfos)
  //             user.set('city', city);
  //             user.set('province',province);
  //             user.set('gender',gender);      
  //             user.save();
  //       }
  //     })
  //   }
  // },
  realtime: realtime,
  globalData: {
    userInfo: null,
    confi:null,
  }
})

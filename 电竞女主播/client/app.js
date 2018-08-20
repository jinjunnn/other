const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var id = 0;
var referrerInfos = {};

AV.init({
  appId: 'hWoybBUghBYkUEo5BnuwinY0-gzGzoHsz',
  appKey: '6Bgvtsh0cGaV8oGRvE9Li5af',
});

const realtime = new Realtime({
  appId: 'hWoybBUghBYkUEo5BnuwinY0-gzGzoHsz',
  appKey: '6Bgvtsh0cGaV8oGRvE9Li5af',
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
  // login: function () {
  //   console.log('登录成功')
  //   return AV.Promise.resolve(AV.User.current()).then(user =>
  //     user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
  //   ).then(user => user ? user : AV.User.loginWithWeapp());
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
  //         wx.checkSession({
  //           success: function(){
  //                       console.log('sessionKey有效')
  //                       var encryptedData = res.encryptedData;
  //                       var iv = res.iv;
  //                       var paramsJson = {
  //                           sessionKey:AV.User.current().attributes.authData.lc_weapp.session_key,
  //                           user:AV.User.current().id,
  //                           encryptedData: encryptedData,
  //                           iv: iv,
  //                           }
  //                       AV.Cloud.run('setUserInfo' ,paramsJson).then(function(data) {
  //                         console.log('data='+data)
  //                               console.log(12345)
  //                               console.log(AV.User.current().id)
  //                               that.globalData.userInfo = res.userInfo
  //                               typeof cb == "function" && cb(that.globalData.userInfo)
  //                                   var nickName = res.userInfo.nickName;
  //                                   var avatarUrl = res.userInfo.avatarUrl;
  //                                   var city = res.userInfo.city;
  //                                   var gender = res.userInfo.gender;
  //                                   var province = res.userInfo.province;

  //                                   console.log(nickName)

  //                                   var user = AV.Object.createWithoutData('_User', AV.User.current().id);
  //                                   user.set('username', nickName);
  //                                   user.set('userImage',avatarUrl);
  //                                   user.set('city', city);
  //                                   user.set('province',province);
  //                                   user.set('gender',gender);      
  //                                   user.save().catch(console.error);
  //                       }, function(err) {
  //                         console.log('err='+err)
  //                       });
  //           },
  //           fail: function(){
  //                       console.log('sessionKey过期')
  //              AV.User.loginWithWeapp().then(()=>{
  //                       console.log('sessionKey有效')
  //                       var encryptedData = res.encryptedData;
  //                       var iv = res.iv;
  //                       var paramsJson = {
  //                           sessionKey:AV.User.current().attributes.authData.lc_weapp.session_key,
  //                           user:AV.User.current().id,
  //                           encryptedData: encryptedData,
  //                           iv: iv,
  //                           }
  //                       AV.Cloud.run('setUserInfo' ,paramsJson).then(function(data) {
  //                                   console.log('data=')
  //                                   console.log(data)

  //                                   that.globalData.userInfo = res.userInfo
  //                                   typeof cb == "function" && cb(that.globalData.userInfo)
  //                                   var nickName = res.userInfo.nickName;
  //                                   var avatarUrl = res.userInfo.avatarUrl;
  //                                   var city = res.userInfo.city;
  //                                   var gender = res.userInfo.gender;
  //                                   var province = res.userInfo.province;

  //                                   var user = AV.Object.createWithoutData('_User', AV.User.current().id);
  //                                   user.set('userName', nickName);
  //                                   user.set('userImage',avatarUrl);
  //                                   user.set('city', city);
  //                                   user.set('province',province);
  //                                   user.set('gender',gender);      
  //                                   user.save().catch(console.error);
  //                       }, function(err) {
  //                         console.log('err='+err)
  //                       });
  //              })
  //           }
  //         })

  //       }
  //     })
  //   }
  // },
  login: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
          // 获取用户信息
          wx.getSetting({
            withCredentials:true,
            long:'zh_CN',
            success: res => {

                wx.getUserInfo({
                  withCredentials: true,
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    console.log('登录'+ code)
                    console.log('res=')
                    console.log(res)
                    var paramsJson = {
                        code:code,
                        res:res,
                        }
                    AV.Cloud.run('wxLogin',paramsJson).then(function(data) {
                      console.log('data=')
                      console.log(data)
                      console.log(data.openid)
                      console.log(data.unionId)
                      console.log(data.token)
                                AV.User.signUpOrlogInWithAuthDataAndUnionId({
                                uid: data.openid,
                                access_token: data.token,
                              }, 'weapp_dianjingzhubo', data.unionId, {
                                unionIdPlatform: 'weixin', // 指定为 weixin 即可通过 unionid 与其他 weixin 平台的帐号打通
                                asMainAccount: false,
                              }).then(function(usr) {

                                that.globalData.userInfo = res.userInfo
                                typeof cb == "function" && cb(that.globalData.userInfo)
                                    var nickName = res.userInfo.nickName;
                                    var avatarUrl = res.userInfo.avatarUrl;
                                    var city = res.userInfo.city;
                                    var gender = res.userInfo.gender;
                                    var province = res.userInfo.province;

                                    const user = AV.User.current();
                                    user.set('userName', nickName);
                                    user.set('userImage',avatarUrl);
                                    user.set('city', city);
                                    user.set('province',province);
                                    user.set('gender',gender);      
                                    user.save();
                              }).catch(console.error);
                    }).catch(console.error);
                  },
                  fail: res => {
                    // wx.showLoading({
                    //   title: '未登录',
                    //   mask:true,
                    // })
                  }
                })
            },
            fail: res => {
            }
          })
      }
    });
  },
  realtime: realtime,
  globalData: {
    userInfo: null,
    confi:null,
  }
})

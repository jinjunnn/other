const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var referrerInfo = {};

AV.init({
  appId: 'WekN4hEaRUx0bLwhjdWqBIY8-gzGzoHsz',
  appKey: '0NT62qkoVPWSW5BKHyKVEvc1',
});

const realtime = new Realtime({
 appId: 'WekN4hEaRUx0bLwhjdWqBIY8-gzGzoHsz',
 appKey: '0NT62qkoVPWSW5BKHyKVEvc1',
 region: 'cn', 
 noBinary: true,
});

App({
  onLaunch: function (options) {
    console.log(options)
    this.setConfi()
    if (options) {
      if (options.referrerInfo) {
      referrerInfo = options.referrerInfo;
      this.setAppId(options.referrerInfo.appId)
      }     
    }
  },
  onHide: function () {

  },

  onShow: function () {
    this.login()
    this.getUserInfo()
  },
  setAppId(appid){
      var query = new AV.Query('AppId');
      query.equalTo('appId', appid);
      query.find().then(function (results) {
          if (results.length) {
                var todo = AV.Object.createWithoutData('AppId',results[0].id);
                todo.increment('times',1);
                todo.save();
          } else {
                var AppId = AV.Object.extend('AppId');
                var appId = new AppId();
                appId.set('times',1);
                appId.set('appId',appid);
                appId.save()
          }
      }, function (error) {
      });
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
    console.log('登录成功')
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp());
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log(res)
          wx.checkSession({
            success: function(){
                        console.log('sessionKey有效')
                        var encryptedData = res.encryptedData;
                        var iv = res.iv;
                        var paramsJson = {
                            sessionKey:AV.User.current().attributes.authData.lc_weapp.session_key,
                            user:AV.User.current().id,
                            encryptedData: encryptedData,
                            iv: iv,
                            }
                        AV.Cloud.run('setUserInfo' ,paramsJson).then(function(data) {
                                that.globalData.userInfo = res.userInfo
                                typeof cb == "function" && cb(that.globalData.userInfo)
                                    var nickName = res.userInfo.nickName;
                                    var avatarUrl = res.userInfo.avatarUrl;
                                    var city = res.userInfo.city;
                                    var gender = res.userInfo.gender;
                                    var province = res.userInfo.province;

                                    console.log(nickName)

                                    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
                                    user.set('username', nickName);
                                    user.set('userImage',avatarUrl);
                                    user.set('city', city);
                                    user.set('province',province);
                                    user.set('gender',gender);      
                                    user.save().catch(console.error);
                        }, function(err) {
                          console.log('err='+err)
                        });
            },
            fail: function(){
                        console.log('sessionKey过期')
               AV.User.loginWithWeapp().then(()=>{
                        console.log('sessionKey有效')
                        var encryptedData = res.encryptedData;
                        var iv = res.iv;
                        var paramsJson = {
                            sessionKey:AV.User.current().attributes.authData.lc_weapp.session_key,
                            user:AV.User.current().id,
                            encryptedData: encryptedData,
                            iv: iv,
                            }
                        AV.Cloud.run('setUserInfo' ,paramsJson).then(function(data) {
                                    console.log('data=')
                                    console.log(data)

                                    that.globalData.userInfo = res.userInfo
                                    typeof cb == "function" && cb(that.globalData.userInfo)
                                    var nickName = res.userInfo.nickName;
                                    var avatarUrl = res.userInfo.avatarUrl;
                                    var city = res.userInfo.city;
                                    var gender = res.userInfo.gender;
                                    var province = res.userInfo.province;

                                    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
                                    user.set('userName', nickName);
                                    user.set('userImage',avatarUrl);
                                    user.set('city', city);
                                    user.set('province',province);
                                    user.set('gender',gender);      
                                    user.save().catch(console.error);
                        }, function(err) {
                          console.log('err='+err)
                        });
               })
            }
          })

        }
      })
    }
  },
  
  realtime: realtime,
  globalData: {
    userInfo: null,
    confi:null,
  }
})

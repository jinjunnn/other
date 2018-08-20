const AV = require('./utils/av-live-query-weapp-min');
const Realtime = require('./utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('./utils/realtime.weapp.min.js').TextMessage;
const bind = require('./utils/live-query-binding');
var id = 0;
var referrerInfos = {};

AV.init({
  appId: 'yKK7LVgpdWPHcU13D2zpz6vc-gzGzoHsz',
  appKey: 'DEuHWipyuCPfFVQr9iNmWwQu',
});

const realtime = new Realtime({
  appId: 'yKK7LVgpdWPHcU13D2zpz6vc-gzGzoHsz',
  appKey: 'DEuHWipyuCPfFVQr9iNmWwQu',
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
                              }, 'weapp_pindaoju', data.unionId, {
                                unionIdPlatform: 'weixin', // 指定为 weixin 即可通过 unionid 与其他 weixin 平台的帐号打通
                                asMainAccount: false,
                              }).then(function(usr) {
                                console.log("我是user=")
                                console.log(usr)
                                console.log(res.userInfo)
                                that.globalData.userInfo = res.userInfo
                                typeof cb == "function" && cb(that.globalData.userInfo)
                                    var nickName = res.nickName;
                                    var avatarUrl = res.avatarUrl;
                                    var city = res.city;
                                    var gender = res.gender;
                                    var province = res.province;
                                    const user = AV.User.current();
                                    user.set('username', nickName);
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

const AV = require('../../../../utils/av-live-query-weapp-min');
const common = require('../../../../model/common')
const { User, Query, Cloud } = require('../../../../utils/av-live-query-weapp-min');
const Order = require('../../../../model/order');
var app = getApp()

var price;
var coins;
var mode;
var tempAudioPath;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      settings:[[1,'个人认证'],[2,'实力认证'],[3,'设置资料'],[4,'客服审核']],
      mode:1,
      zone: ['安卓微信', '苹果微信','安卓QQ','苹果QQ'],
      rank: ['钻石', '星耀','最强王者','荣耀王者'],
      tishi:'姓名和证件号码必须为本人，提现时支付宝账号和姓名必须一致，个人信息绑定后无法进行修改',
      tags:['大神','声优','辅助','射手','刺客','上单','法师'],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mode = options.mode;
     this.setData({
      options,
      qrcode: app.globalData.confi.masterGroupRQImage,
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({ title: '大神认证'});
      
  },
  parseUser(){
      var query = new AV.Query('_User');
      query.get(AV.User.current().id).then(user => this.setData({
      user
      })).catch(console.error);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.parseUser()
    this.newMaster()
  },

  bindFirst(){
    var that = this;
    var realname = this.data.user.attributes.realname
    var idcard = this.data.user.attributes.idcard
    var idcardimage = this.data.user.attributes.idcardimage

    console.log(idcardimage)
    console.log(realname)
    console.log(idcard)

    if (!idcardimage) {
      common.showTip("请上传手持身份证照片", "loading");
    }
    else if (!realname) {
      common.showTip("请输入真实姓名", "loading");
    }
    else if (!idcard) {
      common.showTip("请输入身份证号码", "loading");
    }
    else {
      that.setData({
        mode:2
      })
  }
  },

  bindTwo(){
    var that = this;
    var zoneIndex = this.data.zoneIndex
    var rankIndex = this.data.rankIndex
    var rankimage = this.data.user.attributes.rankImage

    console.log(zoneIndex)
    console.log(rankIndex)
    console.log(rankimage)

    if (!zoneIndex) {
      common.showTip("请选择大区", "loading");
    }
    else if (!rankIndex) {
      common.showTip("请选择最高段位", "loading");
    }
    else if (!rankimage) {
      common.showTip("请上传最高段位截图", "loading");
    }
    else {
      that.setData({
        mode:3
      })
  }
  },

  bindThree(){
    var that = this;
    if (!that.data.content) {
      common.showTip("请输入服务简介", "loading");
    } else{
      var todo = AV.Object.createWithoutData('Master', this.data.master.id);
      todo.set('serviceText', that.data.content);
      todo.save().catch(console.error);
      that.setData({
        mode:4
      })
    }
  },

  bindFour(){
      var todo = AV.Object.createWithoutData('Master', this.data.master.id);
      todo.set('status', 2);
      todo.save().catch(console.error);

      wx.navigateBack({
        delta: 2
      })

  },

  ongetphonenumber: function(e) {
      console.log(e.detail.iv)
      console.log(User.current().attributes.authData.weapp_dianjingwanjia.access_token)
      var paramsJson = {
          user:AV.User.current().id,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey:User.current().attributes.authData.weapp_dianjingwanjia.access_token,
          }
      if (e.detail.iv) {
          wx.checkSession({
            success: function(){
              //session_key 未过期，并且在本生命周期一直有效
              console.log('登录状态未过期')
              Cloud.run('updatePhone' ,paramsJson)
            },
            fail: function(){
              app.login().then(() => Cloud.run('updatePhone' ,paramsJson))
            }
          })
      } else {
        common.showModal('您好请授权手机号码作为登录账号。', '提示')
      }
  },
  bindZone(e){
    var zoneIndex = e.detail.value;
    this.setData({
      zoneIndex: e.detail.value
    })
    var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
    todo.set('zone', this.data.zone[this.data.zoneIndex]);
    todo.save();
  },

  bindUpdateUserImages: function () {
         var that = this;
         wx.chooseImage({
         count: 9,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success: function(res) {
                  var tempFilePath = res.tempFilePaths[0];
                  res.tempFilePaths.map(tempFilePath => () => new AV.File('filename', {
                  blob: {
                  uri: tempFilePath,
                  },
        }).save()).reduce(
        (m, p) => m.then(v => AV.Promise.all([...v, p()])),
        AV.Promise.resolve([])
        ).then(files => that.upUserImage({images:files.map(file => file.url())})).catch(console.error);
        }
        });
  },
  upUserImage(url){
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master.id)
             .then(function(query){
                console.log(query)
                query.set('userImages', url);
                query.save();
                  that.setData({
                    userImage: url
                })
              })
  }, 

  bindRank(e){
    var rankIndex = e.detail.value;
    this.setData({
      rankIndex: e.detail.value
    })
    var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
    todo.set('toprank', this.data.rank[this.data.rankIndex]);
    todo.save().catch(function(error) {
      // catch 方法写在 Promise 链式的最后，可以捕捉到全部 error
      console.error(error);
    })
  },

  bindUpdateImage(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => that.upImage(file.url())
        )
        .catch(console.error);
      }
    });
  },

  upImage(url){
  var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
  todo.set('idcardimage', url);
  todo.save();
            this.setData({
              image: url
          })
  }, 

  bindUpdateRankImage(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => that.upRankImage(file.url())
        )
        .catch(console.error);
      }
    });
  },

  upRankImage(url){
  var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
  todo.set('rankImage', url);
  todo.save();
            this.setData({
              rankimage: url
          })
  }, 

  newMaster(){
    var that = this;
    var query = new AV.Query('Master');
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    query.equalTo('targetUser', user);
    query.count().then(function (count) {
        if (count===0) {
              var Master = AV.Object.extend('Master');
              var master = new Master();
              master.set('targetUser',AV.User.current())
              master.set('mode', Number(mode))
              master.save()
                    .then(function (master) {
                        that.queryMaster()
                      });
        } else {
              that.queryMaster()
        }
    });
  },
  
  queryMaster(){
      var query = new AV.Query('Master');
      var user = AV.Object.createWithoutData('_User', AV.User.current().id);
      query.equalTo('targetUser', user);
      query.include('targetUser');
      query.first().then(master => 
        this.setData({
          master
        })
      ).catch(console.error);
  },

  bindStartAudio(){
    var that = this;
    wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.record']) {
                wx.authorize({
                    scope: 'scope.record',
                    success() {
                        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                        wx.startRecord({
                          success: function(res) {
                            console.log(res.tempFilePath)
                            tempAudioPath = res.tempFilePath 
                                new AV.File('file-name', {
                                  blob: {
                                    uri: tempAudioPath,
                                  },
                                }).save().then(
                                  file => that.upAudio(file.url())
                                )
                                .catch(console.error);
                          },
                          fail: function(res) {
                             //录音失败
                          }
                        })
                    }
                })
            } else {
                  wx.startRecord({
                    success: function(res) {
                          tempAudioPath = res.tempFilePath 
                          new AV.File('file-name', {
                            blob: {
                              uri: tempAudioPath,
                            },
                          }).save().then(
                            file => that.upAudio(file.url())
                          )
                          .catch(console.error);
                    },
                    fail: function(res) {
                       //录音失败
                    }
                  })
            }
        }
    })
  },

  upAudio(url){
  var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
  todo.set('userAudio', url);
  todo.save();
            this.setData({
              userAudio: url
          })
  }, 

  bindEndAudio(){

    wx.stopRecord()
    this.setData({
      tempAudioPath:tempAudioPath
    })


  },
  bindPlayAudio(){
    var that = this;
    console.log(tempAudioPath)
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.data.userAudio
    innerAudioContext.onPlay(() => {
        console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
    })
  },

  bindConcelAudio(){
        this.setData({
      tempAudioPath:null
    })

  },

  updateContent(e){
    this.setData({
      content:e.detail.value
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
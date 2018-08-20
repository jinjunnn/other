const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
var app = getApp();
var that = this;
var shareTimes = 10;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    times:23212,
    month:6,
    days:[1,2,3,4,5,6,7],
    intergal:0,
    image:'http://lc-xfs1iy3e.cn-n1.lcfile.com/ee8bb6f8a608274875fc.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       common.querySettingredirectTo('../user/login/login?method=1&returnurl=../../punch/punch')
       this.setConfi('5a6492c61b69e60066f379a7')

  },

  setConfi(objectId){
    var that = this;
    var query = new AV.Query('Confi');
    query.get(objectId).then(function (confi) {
         that.setData({
          confi:confi.attributes,
        })
    }, function (error) {
      // 异常处理
    });
  },

  //打开公众平台页面
  bindOpenPublic(){
    wx.navigateTo({
      url: './public/public'
    })
  },
  
  //签到
  bindQiandao(){

        common.showModal('恭喜您获得20积分。','打卡成功')
        var SignIn = AV.Object.extend('SignIn');
        var updateCoins = new SignIn();
        var that = this;

        updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
        updateCoins.save().then(function (todo) {
        }, function (error) {
        });

        common.addIntergal('签到', 20)
        common.sendNotice('会员中心' , '尊敬的会员，通过打卡，您获得了20积分，请再接再厉。')
        common.amendIntergal(20)

        var query = new AV.Query('_User');
        query.get(AV.User.current().id).then(function (user) {
          console.log(user)
            that.setData({
              signin:1,
              intergal:user.attributes.Intergal,
            })
        }, function (error) {
          // 异常处理
        });


  },

  //抽奖
  bindLottery(){
    wx.switchTab({
      url: '/pages/lottery/lottery'
    })
  },

  //积分夺宝
  bindIntergal(){
    wx.navigateTo({
      url: '/pages/lottery/detail/lottery'
    })

  },

  //职业代练
  bindShangfen(){
    wx.navigateToMiniProgram({
      appId: "wxc7569f6191eed045",
      path: "/pages/index/dailian/dailian",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })

  },

  //普通陪玩
  bindPeiwan(){
    wx.navigateToMiniProgram({
      appId: "wxc7569f6191eed045",
      path: "pages/index/index",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })

  },

  //皮肤销售
  bindPifu(){
    wx.navigateToMiniProgram({
      appId: "wx4996164e74b59c5c",
      path: "pages/index/index",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })
  },

  //账号交易
  bindZhanghao(){
    wx.navigateToMiniProgram({
      appId: "wx4af5627b21d7b379",
      path: "pages/trade/trade",
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(AV.User.current())
    var d = new Date();
    var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);

      var that = this;
      var queryBuyer = new AV.Query('SignIn');
      queryBuyer.equalTo('targetUser', AV.Object.createWithoutData('_User', AV.User.current().id));
      var querySeller = new AV.Query('SignIn');
      querySeller.greaterThan('createdAt', today );
      var query = AV.Query.and(queryBuyer, querySeller);

      query.count().then(function (count){
            that.setData({
              month:d.getMonth()+1,
              signin:count,
              days:[d.getDate(),new Date(d.getTime()+ 86400000).getDate(),new Date(d.getTime()+ 86400000*2).getDate(),new Date(d.getTime()+ 86400000*3).getDate(),new Date(d.getTime()+ 86400000*4).getDate(),new Date(d.getTime()+ 86400000*5).getDate(),new Date(d.getTime()+ 86400000*6).getDate()]
            })
      })

      var query1 = new AV.Query('Share');
      query1.equalTo('targetUser', AV.Object.createWithoutData('_User', AV.User.current().id));
      var query2 = new AV.Query('Share');
      query2.greaterThan('createdAt', today );
      var queryShare = AV.Query.and(query1, query2);

      queryShare.count().then(function (count){
          shareTimes = count;
      })

      var queryUser = new AV.Query('_User');
      queryUser.get(AV.User.current().id).then(function (user) {
        console.log(user)
          that.setData({
            intergal:user.attributes.Intergal,
          })
      }, function (error) {
        // 异常处理
      });


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
    return {
      title: app.globalData.confi.punchPage.title,
      path: app.globalData.confi.punchPage.path,
      imageUrl:app.globalData.confi.punchPage.imageUrl,
      success: function(res) {

            if (shareTimes > 3) {
                    var Share = AV.Object.extend('Share');
                    var updateCoins = new Share();
                    var that = this;

                    updateCoins.set('targetUser',AV.Object.createWithoutData('_User', AV.User.current().id));
                    updateCoins.set('way','签到页面分享');
                    updateCoins.save().then(function (todo) {
                    }, function (error) {
                    });

                    common.addIntergal('分享打卡页面', 20)
                    common.amendIntergal(20)
                    common.sendNotice('会员中心' , '尊敬的会员，通过分享打卡页面，您获得了20积分，请再接再厉。')
            } else {
                    common.showModal('您好，您今日分享获得的积分已达上线，请明日继续。',)
            }

      }
    }
  }
})
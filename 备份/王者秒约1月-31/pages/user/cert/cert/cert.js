const AV = require('../../../../utils/av-live-query-weapp-min');
const common = require('../../../../model/common');
var objectId;
var mode;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [['苹果端', '安卓端'], ['微信大区', 'QQ大区'], ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜']],
    priceArray: [5,6,7,8,9,10,12,15,18,20],
    orderTimeArray:['时间自由，随时可以接单','我是学生，课余时间接单','我是白领，下班后接单','喜爱夜生活，午后一直到凌晨都可以接单','心好累，暂退江湖'],
    priceIndex:0,
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
  sendMessage(){

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mode = options.mode;
  },
  bindChangeUserVideo(){
    var that = this;
    wx.chooseVideo({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            var tempFilePath = res.tempFilePath;
            new AV.File('file-name', {
              blob: {
                uri: tempFilePath,
              },
            }).save().then(
              file => that.upUserVideo(file.url())
            ).catch(console.error);
          }
    });
  },
  upUserVideo(url){
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master.id)
             .then(function(query){
                console.log(query)
                query.set('userVideo', url);
                query.save();
                  that.setData({
                    userVideo: url
                })
              })
  }, 

  bindChangeVideo(){
    var that = this;
    wx.chooseVideo({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            var tempFilePath = res.tempFilePath;
            new AV.File('file-name', {
              blob: {
                uri: tempFilePath,
              },
            }).save().then(
              file => that.upVideo(file.url())
            ).catch(console.error);
          }
    });
  },

  upVideo(url){
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master.id)
             .then(function(query){
                console.log(query)
                query.set('video', url);
                query.save();
                  that.setData({
                    video: url
                })
              })
  }, 

  //暂时不开通音频
  bindChangeAudio(){

  },
  bindChangeCombatImage: function () {
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
        ).then(files => that.upCombatImage({images:files.map(file => file.url())})).catch(console.error);
        }
        });
  },
  upCombatImage(url){
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master.id)
             .then(function(query){
                console.log(query)
                query.set('combatImages', url);
                query.save();
                  that.setData({
                    combatImage: url
                })
              })
  }, 

  bindChangeUserImage: function () {
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

  bindChangeImage(){
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
  todo.set('image', url);
  todo.save();
            this.setData({
              image: url
          })
  },  

  bindPriceChange: function(e) {
    console.log('Price', e.detail.value)
    var priceIndex = e.detail.value;
    this.setData({
      priceIndex: e.detail.value
    })

        var query = new AV.Query('Master');
        var price = this.data.priceArray[e.detail.value];
        query.get(this.data.master.id)
             .then(function(query){
              query.set('priceIndex', priceIndex);
              query.set('price', Number(price));
              query.save();
            })
  },

  bindOrderTimeChange: function(e) {
    console.log('orderTime', e.detail.value)
    var orderTime = e.detail.value;
    this.setData({
      orderTime: e.detail.value
    })
    console.log(orderTime)
        var query = new AV.Query('Master');
        query.get(this.data.master.id)
             .then(function(query){
              query.set('orderTime', Number(orderTime));
              query.save();
            })
  },

  bindMultiPickerChange: function (e) {
    console.log('段位点击确定时触发', e.detail.value)
    var rank = e.detail.value;
    this.setData({
      multiIndex: e.detail.value
    })
    var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
    todo.set('rank', rank);
    todo.save();
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('王者荣耀修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  //提交储存信息
  submitTap() {
  var title = this.data.master.attributes.title
  var serviceText = this.data.master.attributes.serviceText
  var image = this.data.master.attributes.targetUser.attributes.image

  var cells = this.data.master.attributes.targetUser.attributes.cells
  var gameName = this.data.master.attributes.targetUser.attributes.gameName
  var nickname = this.data.master.attributes.targetUser.attributes.nickname
    if (!title) {
      common.showTip("请输入封面标题", "loading");
    }
    else if (!serviceText) {
      common.showTip("请输入服务说明", "loading");
    }
    else if (!image) {
      common.showTip("请上传封面", "loading");
    }
    else if (!cells) {
      common.showTip("请设置手机号码", "loading");
    }
    else if (!gameName) {
      common.showTip("请设置游戏昵称", "loading");
    }
    else if (!nickname) {
      common.showTip("请设置昵称", "loading");
    }
    else {
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master.id)
             .then(function(query){
                console.log(query)
                query.set('status', 2);
                query.set('mode',Number(mode));
                query.save();
                  common.showModal("我们将会在三个工作日之内进行反馈，请留意通知中心。","提交成功");
              })
             that.newMaster()
  }
  },
  submitTapNavToProfile(){
    wx.navigateTo({
        url: '../../index/detail/detail?objectId='+this.data.master.id
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.newMaster()
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
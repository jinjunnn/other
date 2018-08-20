const AV = require('../../../utils/av-live-query-weapp-min');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [['苹果端', '安卓端'], ['微信大区', 'QQ大区'], ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜']],
    priceArray: [5,6,7,8,9,10,12,15,18,20],
    orderTimeArray:['时间自由，随时可以接单','我是学生，课余时间接单','我是白领，下班后接单','喜爱夜生活，午后一直到凌晨都可以接单','心好累，暂退江湖'],
    priceIndex:null,
  },

  queryMaster(){
    var query = new AV.Query('Master');
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    query.equalTo('targetUser', user);
    query.count().then(function (count) {
        if (count===0) {
              var Master = AV.Object.extend('Master');
              var coins = new Master();

              coins.set('targetUser',AV.User.current())
              coins.save()

              return;
        } else {
          return;
        }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.queryMaster()
      var query = new AV.Query('Master');
      var user = AV.Object.createWithoutData('_User', AV.User.current().id);
      query.equalTo('targetUser', user);
      query.include('targetUser');
      query.find().then(master => this.setData({
          master
        })).catch(console.error);
  
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
        query.get(this.data.master[0].id)
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

  bindChangeCombatImage(){
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
              file => that.upCombatImage(file.url())
            ).catch(console.error);
          }
    });
  },
  upCombatImage(url){
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master[0].id)
             .then(function(query){
                console.log(query)
                query.set('combatImage', url);
                query.save();
                  that.setData({
                    combatImage: url
                })
              })
  }, 

  bindChangeUserImage(){
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
              file => that.upUserImage(file.url())
            ).catch(console.error);
          }
    });
  },

  upUserImage(url){
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master[0].id)
             .then(function(query){
                console.log(query)
                query.set('userImage', url);
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
            ).catch(console.error);
          }
    });
  },

  upImage(url){
        var that = this;
        var query = new AV.Query('Master');
        query.get(this.data.master[0].id)
             .then(function(query){
                console.log(query)
                query.set('image', url);
                query.save();
                  that.setData({
                    image: url
                })
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
        query.get(this.data.master[0].id)
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
        query.get(this.data.master[0].id)
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  }
})
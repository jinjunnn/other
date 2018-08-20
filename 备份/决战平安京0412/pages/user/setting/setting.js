const AV = require('../../../utils/av-live-query-weapp-min');


Page({
  data: {
    multiArray: [['苹果端', '安卓端'], ['大阴阳师', '阴阳大允','阴阳少允', '阴阳大属','阴阳少属', '得生业','修生业']],
    array: ['男', '女'],
    multiIndex: [0, 0],
  },
  onLoad: function (options) {
      console.log(options)
  },

  bindSexChange: function(e) {
    console.log('性别', e.detail.value)
    var sex = e.detail.value;
    this.setData({
      sex: e.detail.value
    })
    var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
    todo.set('sex', sex);
    todo.save();
  },

  bindMultiPickerChange: function (e) {
    console.log('段位单点', e.detail.value)
    var that = this;
    var rank = e.detail.value;
    this.setData({
      multiIndex: e.detail.value
    })
    var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
    todo.set('rank', rank);
    todo.save()
        .then(() => {
            that.parseUser()
        })
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  bindDateChange: function(e) {
    console.log('日期', e.detail.value)
    var birthday = e.detail.value;
    this.setData({
      birthday: e.detail.value
    })
    var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
    todo.set('birthday', birthday);
    todo.save();
  },

  bindRegionChange: function (e) {
    var region = e.detail.value;
    console.log('地理位置', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    var todo = AV.Object.createWithoutData('_User', AV.User.current().id);
    todo.set('region', region);
    todo.save();
  },

  setImage(){
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

  onReady: function () {



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
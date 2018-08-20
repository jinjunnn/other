const AV = require('../../../utils/av-live-query-weapp-min');


Page({
  data: {
    multiArray: [['苹果端', '安卓端'], ['微信大区', 'QQ大区'], ['荣耀王者', '最强王者','至尊星耀', '永恒钻石','尊贵铂金', '荣耀黄金','秩序白银', '倔强青铜']],
    region: ['广东省', '深圳', '南山区'],
    array: ['男', '女'],

    // image: null,
    // nickname:'',
    sex: 0,
    // multiIndex:[0,0,0],
    // birthday: '1970-01-01',

  },
  onLoad: function (options) {
      console.log(options)

      var query = new AV.Query('_User');
      query.get(AV.User.current().id).then(user => this.setData({
      user
      })).catch(console.error);
  },

  bindPickerChange: function(e) {
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

    console.log("chenggong")
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
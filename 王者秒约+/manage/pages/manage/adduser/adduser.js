const AV = require('../../../utils/av-live-query-weapp-min');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   var query = new AV.Query('Confi');
          query.get('5a7f18be0b616000381ac3ca').then(function (todo) {
              var users = todo.attributes.setUsers.length;
                 for (var i = users - 1; i >= 0; i--) {
                  console.log(todo.attributes.setUsers[i])
                   that.addUser(todo.attributes.setUsers[i])
                 }
  })


  },
  addUser(users){
      var user = new AV.User();
      user.setUsername(users);
      user.setPassword('cat!@#123');
      user.signUp().then(function (loginedUser) {
      }, function (error) {
      });
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
    var a = [];
    console.log(123)
          var confi = AV.Object.createWithoutData('Confi', '5a7f18be0b616000381ac3ca');
          confi.set('setUsers', a);
          confi.save();
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
let plugin = requirePlugin("myPlugin")
let routeInfo = {
  startLat: 39.90469, //起点纬度 选填
  startLng: 116.40717, //起点经度 选填
  startName: "我的位置", // 起点名称 选填
  endLat: 39.94055, // 终点纬度必传
  endLng: 116.43207, //终点经度 必传
  endName: "来福士购物中心", //终点名称 必传
}

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
         routeInfo = {
          endLat: Number(options.endlat), // 终点纬度必传
          endLng: Number(options.endlong), //终点经度 必传
          endName: options.endtitle, //终点名称 必传
        }
        let that = this;
        that.setData({
          routeInfo : routeInfo
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
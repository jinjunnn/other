const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');


Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  queryOrder(status){
    wx.setNavigationBarTitle({
      title: status+'的订单'
    })
    var query = new AV.Query('PlayOrder');
    query.descending('createdAt');
    query.equalTo('status', status);
    query.include('targetSeller');
    query.include('targetBuyer');
    query.limit(50);
    query.find().then(order => this.setData({
      order
    })).catch(console.error);

  },
  bindDeleteOrder(event){
    console.log(event.currentTarget.dataset.user)
    console.log(event.currentTarget.dataset.amount)
    console.log(event.currentTarget.dataset.id)
    //将订单状态修改为已退款  
    //在用一个then函数，将用户targetBuyer的user表expense表做减法
    //RECORD表增加一条消息，用户已退款  xxx元。
    var todo = AV.Object.createWithoutData('PlayOrder', event.currentTarget.dataset.id);
    todo.set('status', '已退款');
    todo.save().then(()=>{
        common.addRecord('用户主动退款' , Number(event.currentTarget.dataset.amount), event.currentTarget.dataset.user)
        wx.navigateBack({
          delta: 1
        })
    })


  },
  bindSubmit(event){
    wx.showModal({
      title: '提示',
      content: '是否永久删除陪练？',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.user)
          var bill = AV.Object.createWithoutData('Master', event.currentTarget.dataset.user);
          bill.set('status', 5)
          bill.save();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindChange(event){
    console.log(event.detail.current)
    if (event.detail.current == 1) {
           this.queryOrder('已取消')
    } else if (event.detail.current == 2) {
           this.queryOrder('已接单')
    } else if (event.detail.current == 3) {
           this.queryOrder('已完成')
    } else if (event.detail.current == 0) {
           this.queryOrder('已支付')
    } else{
           this.queryOrder('已退款')
    }
  },

  bindCopyCells(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.user,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            common.showTip('已复制')
          }
        })
      }
    })
  },

  bindCopyGameName(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.user,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            common.showTip('已复制')
          }
        })
      }
    })
  },

  bindCopyWeChatID(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.user,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            common.showTip('已复制')
          }
        })
      }
    })
  },

  onLoad: function (options) {

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
      this.queryOrder('已支付')
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

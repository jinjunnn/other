const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');
var page_index = 0;
var page_size = 1000;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  queryOrder(status,mode){
    var query1 = new AV.Query('Master');
    query1.equalTo('status', status);
    var query2 = new AV.Query('Master');
    query2.equalTo('mode', mode);
    var query = AV.Query.and(query2, query1);

    query.descending('createdAt');
    query.include('targetUser');
    query.limit(page_size);
    query.find().then(order => this.setData({
      order
    })).catch(console.error);

  },

  queryOrderPrior(status){
    var query1 = new AV.Query('Master');
    query1.equalTo('status', status);
    var query2 = new AV.Query('Master');
    query2.equalTo('prior', true);

    var query = AV.Query.and(query2, query1);

    query.descending('createdAt');
    query.include('targetUser');
    query.limit(page_size);
    query.find().then(order => this.setData({
      order
    })).catch(console.error);
  },

  bindPassFail(event){
    var todo = AV.Object.createWithoutData('Master', event.currentTarget.dataset.user);
    todo.set('status',4);
    todo.save()
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
  },

  bindDeleteUser(event){
    var todo = AV.Object.createWithoutData('Master', event.currentTarget.dataset.user);
    todo.set('status',5);
    todo.save()
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
  },

  bindPriorDisplay(event){
    console.log(event.currentTarget.dataset.user)
    var todo = AV.Object.createWithoutData('Master', event.currentTarget.dataset.user);
    todo.set('prior',true);
    todo.save()
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
  },

  bindConcelPriorDisplay(event){
    var todo = AV.Object.createWithoutData('Master', event.currentTarget.dataset.user);
    todo.set('prior',false);
    todo.save()
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
  },

  bindAmendMode(event){
    console.log(event.currentTarget.dataset.mode)

    var todo = AV.Object.createWithoutData('Master', event.currentTarget.dataset.user);
    todo.set('mode',Number(event.currentTarget.dataset.mode));
    todo.save()
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
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
      wx.setNavigationBarTitle({title:'普通陪打'})
      this.queryOrder(3,3)
    } else if (event.detail.current == 2) {
      wx.setNavigationBarTitle({title:'主页优先显示订单'})
      this.queryOrderPrior(3)
    } else if (event.detail.current == 3) {
      wx.setNavigationBarTitle({title:'职业陪打'})
      this.queryOrder(3,1)
    } else if (event.detail.current == 4) {
      wx.setNavigationBarTitle({title:'职业代练'})
      this.queryOrder(3,4)
    } else if (event.detail.current == 0) {
      wx.setNavigationBarTitle({title:'美女陪打'})
      this.queryOrder(3,2)
    } else{
           this.queryOrder('已退款')
    }
  },

  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.queryOrder(3,2)
      wx.setNavigationBarTitle({
        title: '美女陪打'
      })  },

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
      page_index = ++page_index
      this.reFrish();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common');


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  queryOrder(i){
    var query1 = new AV.Query('Trade');
    query1.greaterThan('bond',0);
    var query2 = new AV.Query('Trade');
    query2.equalTo('status',i);
    var query = AV.Query.and(query1, query2);

    query.descending('createdAt');
    query.include('targetUser');
    query.find().then(order => this.setData({
      order
    })).catch(console.error);
  },
  bindSubmit(event){
    wx.showModal({
      title: '提示',
      content: '买家下单后，找不到卖家联系方式，下架商品？',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.user)
          var bill = AV.Object.createWithoutData('Trade', event.currentTarget.dataset.user);
          bill.set('status', 5)//状态是5意味着，这个订单买家下单后无服务。
          bill.save();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindUpShop(event){
    wx.showModal({
      title: '提示',
      content: '上架交易',
      success: function (res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.user)
          var bill = AV.Object.createWithoutData('Trade', event.currentTarget.dataset.user);
          bill.set('status', 3)//状态是5意味着，这个订单买家下单后无服务。
          bill.save();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindConcel(event){
    wx.showModal({
      title: '提示',
      content: '是否支付完成，准备退款？',
      success: function (res) {
        if (res.confirm) {
          var bill = AV.Object.createWithoutData('Trade', event.currentTarget.dataset.id);
          bill.set('bond', 0);
          bill.set('status', 4)
          bill.save().then(()=>{
            common.addRecord('用户主动退款',event.currentTarget.dataset.amount,event.currentTarget.dataset.user)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
  bindChange(event){
    console.log(event.detail.current)
    if (event.detail.current == 1) {
      wx.setNavigationBarTitle({title: '用户上架'})
      this.queryOrder(1)
    } else if (event.detail.current == 2) {
      wx.setNavigationBarTitle({title: '用户下架'})
      this.queryOrder(2)
    } else if (event.detail.current == 3) {
      wx.setNavigationBarTitle({title: '已退款订单'})
      this.queryOrder(4)
    } else if (event.detail.current == 4) {
      wx.setNavigationBarTitle({title: '已强制取消订单'})
      this.queryOrder(5)
    } else if (event.detail.current == 0) {
      wx.setNavigationBarTitle({title: '在售商品'})
      this.queryOrder(3)
    } else{
           this.queryOrder('已退款')
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({title: '在售商品'})
    this.queryOrder(3) 
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
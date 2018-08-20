const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
const { User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');
const Order = require('../../model/order');
var app = getApp();
var objectId;


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  // 出现和隐藏弹出框
 // showModal: function () {
 //    // 显示遮罩层
 //    var animation = wx.createAnimation({
 //      duration: 200,
 //      timingFunction: "linear",
 //      delay: 0
 //    })
 //    this.animation = animation
 //    animation.translateY(300).step()
 //    console.log(animation.export())
 //    this.setData({
 //      animationData: animation.export(),
 //      showModalStatus: true
 //    })
 //    setTimeout(function () {
 //      animation.translateY(0).step()
 //      this.setData({
 //        animationData: animation.export()
 //      })
 //    }.bind(this), 200)
 //  },
 //  hideModal: function () {
 //    // 隐藏遮罩层
 //    var animation = wx.createAnimation({
 //      duration: 200,
 //      timingFunction: "linear",
 //      delay: 0
 //    })
 //    this.animation = animation
 //    animation.translateY(300).step()
 //    this.setData({
 //      animationData: animation.export(),
 //    })
 //    setTimeout(function () {
 //      animation.translateY(0).step()
 //      this.setData({
 //        animationData: animation.export(),
 //        showModalStatus: false
 //      })
 //    }.bind(this), 200)
 //  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.objectId)
      this.queryItem(options.objectId)
  },
  queryItem(objectId){
      var that = this;
      var query = new AV.Query('Item');
      query.include('targetUser');
      query.get(objectId).then(function (item) {
            that.setData({
                  item:item
            })
      }, function (error) {
        // 异常处理
      });
  },


  bindBuy(){
    var that = this;
    console.log(this.data.item.attributes.name)
    console.log(this.data.item.attributes.price2)
    console.log(this.data.item.attributes.id)

    that.donate(this.data.item.attributes.name, this.data.item.attributes.price2, this.data.item.attributes.id,1)
    // that.showModal()
  },

  //确认订单
  donate(productDescription,amount,itemId,times) {
    var that = this;
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: productDescription,
      amount: amount * 100,
      itemId:itemId,
      times:times,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        //支付成功后的业务逻辑

        setTimeout(that.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },

  //更新订单
  refreshOrders() {
    return new Query(Order)
      .equalTo('user', User.current())
      .equalTo('status', 'SUCCESS')
      .descending('createdAt')
      .find()
      .then(orders => this.setData({ 
        orders: orders.map(order => Object.assign(order.toJSON(), {
          paidAt: order.paidAt.toLocaleString(),
        }))
      }))
      .catch(console.error);
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
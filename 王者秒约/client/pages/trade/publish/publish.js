var Trade = require('../../../model/trade');
const AV = require('../../../utils/av-live-query-weapp-min');
var common = require('../../../model/common');
const Order = require('../../../model/order');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');

var coins;

Page({

  data: { 
    images:[],
    title: '', 
    content: '', 
  },

  onLoad: function (options) {
       common.querySetting( '提醒','发布交易商品需获取您用户基础权限。')
  },

  updateContent({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      content: value
    });
  },

  updateTitle({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      title: value
    });
  },

  updatePrice({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      amount: value
    });
  },
  //上传照片
  upImg: function () {
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
        ).then(files => that.setData({images:files.map(file => file.url())})).catch(console.error);
        }
        });
  },

  //提交储存信息
  submitTap() {
  var that = this;
  var content = this.data.content;
  var title = this.data.title;
  var images = this.data.images;
  var amount = Number(this.data.amount)
  var cells = this.data.cells
    if (!title) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!content) {
      common.showTip("内容不能为空", "loading");
    }
    else if (!amount) {
      common.showTip("价格不能为空", "loading");
    }
    else if (!images) {
      common.showTip("请上传图片", "loading");
    }
    else {
      var bond = amount * 0.05
      console.log(bond)
      if (bond > 5) {
          that.bindBuy(amount,content,title,images,cells,bond)
      } else {
         bond = 5;
         that.bindBuy(amount,content,title,images,cells,bond)
      }

    }
  },
 //点击购买
  bindBuy: function (amount, content, title, images, cells, bond) {
          var that = this;
          // common.addFormId(e.detail.formId)
          var productDescription ="交易保证金";
          if (bond < coins) {
                  wx.showModal({
                    title: '支付保证金',
                    content: '使用余额支付'+ bond +'元保证金。',
                    success: function(res) {
                      if (res.confirm) {
                        that.donate2("交易保证金", amount, content, title, images, cells, bond)       
                      } else if (res.cancel) {
                      }
                    }
                  })   
              return true;
          } else {
                  wx.showModal({
                    title: '支付保证金',
                    content: '请支付'+ bond +'元保证金。',
                    success: function(res) {
                      if (res.confirm) {
                        that.donate("交易保证金", amount, content, title, images, cells, bond)       
                      } else if (res.cancel) {
                        //do something
                      }
                    }
                  })
          }
  },
  //确认订单 orderMode = 3 就是交易订金订单
  donate(productDescription, amount, content, title, images, cells, bond) {
    var that = this;
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: productDescription,
      amount: bond * 100,
      orderMode:3,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        //这些个价格还没有。
          new Trade({ 
                amount:amount, 
                content: content, 
                title: title, 
                images: images,
                status: 1,
                cells: cells,
                bond: bond,
                targetUser:AV.User.current(),
          }).save().then((article) => {
                wx.navigateBack({
                  delta: 1
                })
          }
          ).catch(console.error);

        //新增一条交易记录
        common.addRecord('交易保证金', -Number(bond))

        //expenses字段增加
        common.amendExpenses(Number(bond))

        //发一条通知
        common.sendNotice('秒约交易' , '您好，您已经成功上线交易商品，缴纳保证金'+ bond +'元。')

        wx.navigateBack({
          delta: 1
        })

        setTimeout(that.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },

    //账户余额支付
  donate2(productDescription, amount, content, title, images, cells, bond) {
    var that = this;

        //新增一条交易记录
        common.addRecord('交易保证金', -Number(bond))

        //expenses字段增加
        common.amendExpenses(Number(bond))

        //发一条通知
        common.sendNotice('秒约交易' , '您好，您已经成功上线交易商品，缴纳保证金'+ bond +'元。')

        //修改coins数量
        common.amendCoins(-Number(bond))

        wx.navigateBack({
          delta: 1
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
  // //添加一条订单记录
  // saveOrder(){
  //     var Deposit = AV.Object.extend('Deposit');
  //     var order = new Deposit();
  //     order.set('targetBuyer',AV.Object.createWithoutData('_User', AV.User.current().id));
  //     order.set('status','已支付');
  //     order.set('deposit',true)
  //     order.set('amount',Number(price))
  //     order.save().then(function (todo) {
  //     }, function (error) {
  //       console.error(error);
  //     });
  // },
  onReady: function () {
    var that = this;
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then(function (results) {
    coins = results.attributes.coins;
    that.setData({
      coins:results
    })
    }, function (error) {
    });
  },

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
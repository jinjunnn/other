                                      // pages/publish/publish.js
const AV = require('../../utils/av-live-query-weapp-min');
var common = require('../../model/common');
const Order = require('../../model/order');
const Item = require('../../model/item');
const { User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');

var coins;

Page({

  data: { 
    images1:[],
    images2:[],
    images3:[],
    name: '', 
    subname: '', 
    price1: '', 
    price2: '', 
    amount: '', 
  },

  onLoad: function (options) {

  },

  updateName({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      name: value
    });
  },

  updateSubname({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      subname: value
    });
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

  updatePrice1({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      price1: value
    });
  },

  updatePrice2({
  detail: {
    value
  }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      price2: value
    });
  },

  updateAmount({
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
  upImg1: function () {
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
        ).then(files => that.setData({images1:files.map(file => file.url())})).catch(console.error);
        }
        });
  },
  //上传照片
  upImg2: function () {
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
        ).then(files => that.setData({images2:files.map(file => file.url())})).catch(console.error);
        }
        });
  },
  //上传照片
  upImg3: function () {
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
        ).then(files => that.setData({images3:files.map(file => file.url())})).catch(console.error);
        }
        });
  },
  //提交储存信息
  submitTap(name, subname, images1, images2, images3, content, price1, price2, brand, amount) {

    if (!name) {
      common.showTip("标题不能为空", "loading");
    }
    // else if (!subname) {
    //   common.showTip("内容不能为空", "loading");
    // }
    // else if (!images1) {
    //   common.showTip("价格不能为空", "loading");
    // }
    // else if (!images2) {
    //   common.showTip("请上传图片", "loading");
    // }
    // else if (!images3) {
    //   common.showTip("内容不能为空", "loading");
    // }
    // else if (!content) {
    //   common.showTip("价格不能为空", "loading");
    // }
    // else if (!price1) {
    //   common.showTip("请上传图片", "loading");
    // }
    // else if (!price2) {
    //   common.showTip("内容不能为空", "loading");
    // }
    // else if (!brand) {
    //   common.showTip("价格不能为空", "loading");
    // }
    // else if (!amount) {
    //   common.showTip("请上传图片", "loading");
    // }
    else {
            new Item({ 
                  name:'name', 
                  subname:'subname', 
                  productGoods:this.data.images1,
                  productParameters: this.data.images2,
                  productNotice: this.data.images3,
                  content: 'content',
                  price1: 400, 
                  price2: 300, 
                  targetBrand: AV.Object.createWithoutData('Brand', '12345'), 
                  targetTopic: AV.Object.createWithoutData('Topic', '12345'), 
                  amount: 400, 
                  targetUser:AV.User.current(),
            }).save().then((article) => {
                  wx.navigateTo({
                    url: '../list/article/article'
                  })
            }
            ).catch(console.error);
        }
  },
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
// pages/publish/publish.js
const AV = require('../../utils/av-live-query-weapp-min');
var common = require('../../model/common');
var app = getApp()


var title;
var city;
var district;
var address;
var lat;
var lng;

Page({

  data: { 
    item:null,
    selAddress: null,
    height: 20, 
    images:[],//上传的照片
    title: '', //post的标题
    editDraft: null, //编辑的文件
    tags: ['美食圈', 'K歌圈', '电影圈', '桌游圈', '户外圈', '手工圈', '跑步圈', '其他'],//tags
    tagIndex: null,//TAGS INDEX
    date:null,//如果没有显示选择日期，如果有，显示具体的日期
    time:null,//如果没有选择时间，如果有显示具体的时间
    deadlineDate:null,//报名截止日期
    deadlineTime:null,//报名截止时间
    budget:null,
    booking_fee:null,
    miniPerson:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    miniPersonIndex:null,
    maxiPerson: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,25,30,40,50,100],
    maxiPersonIndex: null,
    icons:{
      arrow: 'https://lc-WekN4hEa.cn-n1.lcfile.com/06ba759ae13616b49b55.png',//箭头符号的地址
      title: '../../image/主题.png', //post标题title的icons
      date: '../../image/活动日期.png', //日期的icons
      time: '../../image/活动时间.png', //时间的ICONS
      deadlineDate: '../../image/截止日期.png', //日期的icons
      deadlineTime: '../../image/截止时间.png', //时间的icons
      miniperson: '../../image/人数少.png', //最低人数人的icons
      maxiperson: '../../image/人数多.png', //最高人的icons
      budget: '../../image/预算.png', //预算的icons
      booking_fee: '../../image/订金.png', //订金的isons
      tag:'../../image/话题.png',//标签的icons
      location: '../../image/地点.png'
    }
  },

  onLoad: function (options) {
        // this.upImg()//上传图片

  },

  //选择标签
  bindSetTag(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tagIndex: e.detail.value
    })
  },

  //设置地理位置信息
  bindSetLocation(){
    wx.navigateTo({
      url: './map/map'
    })
  },

  //将标题储存
  bindUpdateTitle: function ({
    detail: {
      value
    }
  }) {
    console.log('存储标题')
    if (!value) return;
    this.setData({
      title: value
    });
  },

  //设置日期
  bindSetDate(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //设置时间
  bindSetTime(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },


  //设置最小人数
  bindSetMiniPerson(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      miniPersonIndex: e.detail.value
    })
  },

  //设置最多人数
  bindSetMaxiPerson(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      maxiPersonIndex: e.detail.value
    })
  },

  //设置预算
  bindSetBudget(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      budget: e.detail.value
    })
  },

  //设置订金
  bindSetBookingFee(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      booking_fee: e.detail.value
    })
  },

  //设置报名截止日期
  bindSetDeadlineDate(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      deadlineDate: e.detail.value
    })
  },

  //设置报名截止时间
  bindSetDeadlineTime(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      deadlineTime: e.detail.value
    })
  },
  //添加并存储内容
  bindUpdateContent: function ({
    detail: {
      value
    }
  }) {
    console.log('设置文本内容')
    if (!value) return;
    this.setData({
      content: value
    });
  },

  //上传订单
  bindSubmitPost(){

    let d1 = this.data.date + 'T' + this.data.time  + ':00.000+08:00';
    let d2 = this.data.deadlineDate + 'T' + this.data.deadlineTime  + ':00.000+08:00';
    let dating = new Date(Date.parse(d1));
    let deadline = new Date(Date.parse(d1));
    console.log(d1)
    console.log(d2)

  if (!this.data.title) {
    common.showTip("请输入主题", "loading");
  } else if (!this.data.images) {
    common.showTip("请上传图片", "loading");

  } else if (!this.data.tagIndex) {
    common.showTip("请选择标签", "loading");
  // } else if (!this.data.location) {
  //   common.showTip("请选择地点", "loading");

  } else if (!this.data.date) {
    common.showTip("请选择活动日期", "loading");
  } else if (!this.data.time) {
    common.showTip("请选择活动时间", "loading");

  } else if (!this.data.miniPersonIndex) {
    common.showTip("最低报名人数", "loading");
  } else if (!this.data.maxiPersonIndex) {
    common.showTip("最高报名人数", "loading");

  } else if (!this.data.budget) {
    common.showTip("请输入预算", "loading");
  // } else if (!this.data.booking_fee) {
  //   common.showTip("请输入订金", "loading");

  } else if (!this.data.deadlineDate) {
    common.showTip("请选择报名截止日期", "loading");
  } else if (!this.data.deadlineTime) {
    common.showTip("请选择报名截止时间", "loading");

  } else if (!this.data.content) {
    common.showTip("请输入活动内容", "loading");

  } else if (d2 > d1) {
    common.showTip("报名截止时间超出", "loading");
  } else if (this.data.miniPersonIndex > this.data.maxiPersonIndex) {
    common.showTip("最高报名人数过少", "loading");
  } else {

    var Post = AV.Object.extend('Post');
    var post = new Post();
    let geo = new AV.GeoPoint(this.data.item.location.lat,this.data.item.location.lng);

    console.log(location)
    post.set('title', this.data.title);
    post.set('tag', this.data.tags[this.data.tagIndex]);
    post.set('geo', geo);
    post.set('location', location);
    post.set('shopName', this.data.item.title);
    post.set('address', this.data.item.address);
    post.set('images', this.data.images);
    post.set('dating', dating);
    post.set('miniPersonIndex', this.data.miniPerson[this.data.miniPersonIndex]);
    post.set('maxiPersonIndex', this.data.maxiPerson[this.data.maxiPersonIndex]);
    post.set('budget', this.data.budget);
    // post.set('booking_fee', this.data.booking_fee);
    post.set('deadline', deadline);
    post.set('content', this.data.content);
    post.set('targetUser', AV.User.current());

    post.save().then(function (todo) {
          common.showTip("报名成功", "success");
          wx.switchTab({
            url: '../postlist/postlist'
          })
    }, function (error) {
      console.error(error);
    });


  }
  },


  //图片部署在leancloud上传照片
  upImg: function () {
    console.log('上传图片')
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


 
  onReady: function () {
  
  },

  onShow: function (options) {

    //这段代码是将map来回的数据存储到data中
        let that = this;
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.data.selAddress == "") {
          that.getUserAddress(that.data.userId);
        } else {
          that.setData({ //将携带的参数赋值
            address: currPage.data.item
          });
        }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**s
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
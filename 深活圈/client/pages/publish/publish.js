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
    height: 20, 
    images:[],
    article:[], 
    title: '请输入地点', 
    summary: '', 
    what: '',
    why: '',
    editDraft: null, 

    mode:1,
    tags: ['美食圈', 'K歌圈', '电影圈', '桌游圈', '户外圈', '手工圈', '跑步圈', '其他'],
    tagIndex: 0,
    date:"选择日期",
    time:"选择时间",
    icons:{
      arrow: 'https://lc-WekN4hEa.cn-n1.lcfile.com/06ba759ae13616b49b55.png',
      title:'',
      date:'',
      time:'',
      person:'',
      budget:'', //预算
      booking_fee:'',//订金
      tag:'',
      location:''
    }
  },

  onLoad: function (options) {
        this.upImg()

  },

  //选择标签
  bindSetTag() {
    console.log('选择标签')
  },

  //设置地理位置信息
  bindSetLocation(){
    console.log('设置地理位置')
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
  bindSetDate(){
console.log('设置日期')
  },

  //设置时间
  bindSetTime() {
console.log('设置时间')
  },


  //设置最小人数
  bindSetMiniPerson(){
console.log('设置最小人数')
  },

  //设置最多人数
  bindSetMaxiPerson(){
console.log('设置最多人数')
  },

  //设置预算
  bindSetBudget(){
console.log('设置预算')
  },

  //设置订金
  bindSetBookingFee(){
console.log('设置订金')
  },

  //设置报名截止日期
  bindSetDeadlineDate(){
console.log('设置报名截止日期')
  },

  //设置报名截止时间
  bindSetDeadlineTime() {
console.log('设置报名截止时间')
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

  bindgetuserinfo(){

  },

  //上传订单
  bindSubmitPost(){
    console.log('上传订单')
  // var summary = this.data.summary
  // var what = this.data.what
  // var why = this.data.why
  // var cell = this.data.cell
  // var likes = this.data.likes
  // var images = this.data.images
  // if (!title) {
  //   common.showTip("地点不能为空", "loading");
  // } else if (!summary) {
  //   common.showTip("标题不能为空", "loading");
  // } else if (!images) {
  //   common.showTip("请上传图片", "loading");
  // } else {
  //   new Article({
  //     address: address,
  //     cell: cell,
  //     lat: Number(lat),
  //     lng: Number(lng),
  //     city: city,
  //     district: district,
  //     likes: 0,
  //     summary: summary,
  //     title: title,
  //     what: what,
  //     why: why,
  //     images: this.data.images,
  //     targetUser: AV.User.current(),
  //   }).save().then((article) => {
  //     wx.navigateTo({
  //       url: '../list/article/article'
  //     })
  //   }).catch(console.error);

  // }
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
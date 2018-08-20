
var is;
var long = ''
;
var users;

var que=new Array();
const AV = require('../../../utils/av-live-query-weapp-min');
var common = require('../../../model/common');
const Order = require('../../../model/order');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
var lotteryTodayObjectId;
var amount = 20;
var amountreal = 0;
var arrUser = [];
var arrLottery = [];
var lotterys = [];
var lengths ;


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

  },
  bindConfirm(){
    var that = this;
    wx.showModal({
      title: '警告!',
      content: '此操作，将修改中奖表的数据，请确认后再进行修改。',
      success: function (res) {
        if (res.confirm) {
              that.math1()
              
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  queryObjectId(){
        var query = new AV.Query('LotteryToday');
        query.descending('createdAt');
        query.first().then(function (data) {
          lotteryTodayObjectId = data.attributes.targetLottery.id
        }, function (error) {
        }).then( function () {
              var queryLottery = new AV.Query('LotteryToday');
              queryLottery.equalTo('targetLottery', AV.Object.createWithoutData('Lottery', lotteryTodayObjectId));
              queryLottery.limit(1000);
              queryLottery.find().then(function (results) {
                  lotterys = results;
                  lengths = results.length;
              }, function (error) {
              }).then(function (){
                          //这段代码生成了一个1000以内的随机数；
                          while(arrLottery.length < amount){
                              var bFlag = true;
                              var number = Math.floor(Math.random()*lengths);
                              if(arrLottery.length == 0){
                                  arrLottery.push(number);
                              }
                              for(var i=0;i<arrLottery.length;i++){
                                  if(number == arrLottery[i]){
                                      bFlag = false;
                                  }
                              }
                              if(bFlag){
                                 arrLottery.push(number); 
                              }
                          }
                          console.log(lotterys[arrLottery[i]].id)
                          for (var i = 0; i < amount ; i++) {
                            if (i < amount-amountreal) {
                                var todo = AV.Object.createWithoutData('LotteryToday', lotterys[arrLottery[i]].id);
                                // 修改属性
                                todo.set('get', true);
                                console.log(users[arrUser[i]])
                                todo.set('targetUser', AV.Object.createWithoutData('_User', users[arrUser[i]]));
                                // 保存到云端
                                todo.save();

                            } else {
                                var todo = AV.Object.createWithoutData('LotteryToday', lotterys[arrLottery[i]].id);
                                todo.set('get', true);
                                todo.save();
                            }

                               
                          }

              });
        })
  },

  //把user变成数组形式
  updateUsers(){
    for (var i = 532 - 1; i >= 0; i--) {
      is = long.substr(0,24)
      long = long.substr(24)
      var queueA=que.push(is);
    }
    console.log(que)
    var confi = AV.Object.createWithoutData('Confi', '5a7f18be0b616000381ac3ca');
    confi.addUnique('users', que);
    confi.save()
  },

  math1(){
      var that = this;
      var query = new AV.Query('Confi');
      query.get('5a7f18be0b616000381ac3ca').then(function (confi) {
        console.log(confi.attributes.users)
      users = confi.attributes.users;
        //下面这段代码的意思是生成一个随机数；
        while(arrUser.length < amount - amountreal){
            var bFlag = true;
            var number = Math.floor(Math.random()*users.length);
            if(arrUser.length == 0){
                arrUser.push(number);
            }
            for(var i=0;i<arrUser.length;i++){
                if(number == arrUser[i]){
                    bFlag = false;
                }
            }
            if(bFlag){
               arrUser.push(number); 
            }
        }
        console.log(arrUser)
        console.log(users)
        that.queryObjectId()
      }, function (error) {
        // 异常处理
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
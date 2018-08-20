const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var price;
var title;
var app = getApp();
var objectId;
var p;
var p1 = 0;
var p2 = 0;
// r1青铜； r2白银； r3黄金； r4铂金； r5钻石； r6星耀； r7王者1-10；r8王者10-20； r9王者20-30；
var r1 = 5;
var r2 = 6;
var r3 = 8;
var r4 = 10;
var r5 = 15;
var r6 = 25;
var r7 = 40;
var r8 = 50;
var r9 = 60;
var a;
var b;
Page({

  /**
   * 页面的初始数据⒈Ⅰ ⒉Ⅱ ⒊Ⅲ ⒋Ⅳ ⒌Ⅴ
   */
  data: {
    multiArray1: [['倔强青铜','秩序白银','荣耀黄金','尊贵铂金','永恒钻石','至尊星耀', '最强王者'],['Ⅲ段', 'Ⅱ段', 'Ⅰ段'], ['1星','2星','3星']],
    multiIndex1: [0, 0, 0],
    multiArray2: [['倔强青铜','秩序白银','荣耀黄金','尊贵铂金','永恒钻石','至尊星耀', '最强王者'],['Ⅲ段', 'Ⅱ段', 'Ⅰ段'], ['1星','2星','3星']],
    multiIndex2: [0, 0, 0],
    array1:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73],
    array2:[90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150],
    index1:0,
    index2:0,
    zoneArray:['苹果微信区','安卓微信区','苹果QQ区','安卓QQ区'],
    zoneIndex:0,
    a:1,
    b:1,
    p1:0,
    p2:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.querySetting( '提醒','使用职业代练功能需要先获得您的用户权限。')
    wx.showShareMenu({
      withShareTicket: true
    })
    title = options.title;
    objectId = options.objectId;
  },
  //点击购买
  bindBuy: function () {
      var that = this;

      //由于目前用户在账户上的资金一直不可能太多，因此不做判断。
      price = (this.data.p2 - this.data.p1)*this.data.a*this.data.b;
      console.log(price)
      if (this.data.p2 > this.data.p1) {
      wx.showModal({
      title: '微信支付',
      content: '价格为'+ price +'元，使用微信支付。',
      success: function(res) {
        if (res.confirm) {
          that.donateBuy()
        } else if (res.cancel) {
          return false;
        }
      }
    })
      } else {
      wx.showModal({
          title: '目标段位过低',
          content: '目标段位需要高于启始段位。',
          success: function(res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
          })
      }
  },  
  //兑换购买
  exchange(){
          //成功后的业务逻
          this.buyRecord()
          common.amendCoins(-price)
          common.amendExpenses(- (-price))
          common.addRecord(title+'购买' , -price)
          common.sendNotice('上分团队' , '恭喜您购买成功。请完善资料，以便我们客服人员联系您。您也可以联系客服。')
          wx.navigateTo({
           url: '../../user/notice/notice'
          })
  },
  //刷新订单，用户完成订单后刷新订单为“success”
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
  //增加1条购买记录
  buyRecord(){
          var from = this.data.multiArray1[0][this.data.multiIndex1[0]] + this.data.multiArray1[1][this.data.multiIndex1[1]] + this.data.multiArray1[2][this.data.multiIndex1[2]];
          var to = this.data.multiArray2[0][this.data.multiIndex2[0]] + this.data.multiArray2[1][this.data.multiIndex2[1]] + this.data.multiArray2[2][this.data.multiIndex2[2]];
          var zone = this.data.zoneArray[this.data.zoneIndex];
          var TeamOrder = AV.Object.extend('TeamOrder');
          // 新建对象
          var order = new TeamOrder();
          var targetTeam = AV.Object.createWithoutData('Team', objectId);
          order.set('targetTeam',targetTeam);
          order.set('title',title);
          order.set('from',from);
          order.set('to',to);
          order.set('zone',zone);
          order.set('targetUser',AV.User.current());
          order.set('status',false)
          order.save()
  },
  //创建购买订单
    donateBuy() {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: title+'订单',
      amount: price * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //成功后的业务逻辑
        this.buyRecord()
        common.addRecord(title+'订单' , -price)
        common.amendExpenses(- (-price))
        //发送一条中奖的消息
        common.sendNotice('上分团队' , '恭喜您购买成功。请完善资料，以便我们客服人员联系您。您也可以联系客服。')
        //发送一条sms
        this.sendSMS()
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        })         
        wx.navigateTo({
               url: '../../user/notice/notice'
        });
        setTimeout(this.refreshOrders.bind(this), 1500);
      }
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    })
  },
  //发送短消息
  sendSMS(){
        AV.Cloud.requestSmsCode({
        mobilePhoneNumber: '17704054310',
        template: '大神团订单',
        sign:'王者秒约'
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
  },
  
  bindPickerChange1: function(e) {
    this.setData({
      index1: e.detail.value
    })
      var v = e.detail.value;
        switch (v) {
          case '0':
            a = 1.2;
            break;
          case '1':
            a = 1;            
            break;
          case '2':
            a = 1;
            break;
        }
        this.setData({a:a});
  },

  bindZoneChange: function(e) {
    this.setData({
      zoneIndex: e.detail.value
    })
    console.log(this.data.zoneArray[this.data.zoneIndex])
  },

  bindPickerChange2: function(e) {
    this.setData({
      index2: e.detail.value
    })
      var v = e.detail.value;
        switch (v) {
          case '0':
            b = 1.5;
            break;
          case '1':
            b = 1.2;            
            break;
          case '2':
            b = 1;
            break;
        }
        this.setData({b:b});
  },

  bindMultiPickerChange1: function (e) {
    this.setData({
      multiIndex1: e.detail.value
    })
    var v = e.detail.value;
        switch (v[0]) {
          case 0:
            p1 = (v[1]*3+v[2])*r1;
            break;
          case 1:
            p1 = (v[1]*3+v[2])*r2 + 9*r1;
            break;
          case 2:
            p1 = (v[1]*4+v[2])*r3 +9*r2 + 9*r1 ;
            break;
          case 3:
            p1 = (v[1]*4+v[2])*r4 + 16*r3 +9*r2 + 9*r1;
            break;
          case 4:
            p1 = (v[1]*5+v[2])*r5 + 16*r4 + 16*r3 +9*r2 + 9*r1;
            break;
          case 5:
            p1 = (v[1]*5+v[2])*r6 + 25*r5 + 16*r4 + 16*r3 +9*r2 + 9*r1;
            break;
          case 6:
            p1 = (v[1]*5+v[2])*r7 + 25*r6 + 25*r5 + 16*r4 + 16*r3 +9*r2 + 9*r1;
            break;
        }
        this.setData({
          p1:p1
        })
  },
  bindMultiPickerColumnChange1: function (e) {
    var data = {
      multiArray1: this.data.multiArray1,
      multiIndex1: this.data.multiIndex1
    };
    data.multiIndex1[e.detail.column] = e.detail.value;
    if (e.detail.column==0) {
        switch (e.detail.value) {
          case 0:
                data.multiArray1[1] = ['Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['1星','2星','3星'];
            break;
          case 1:
                data.multiArray1[1] = ['Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星'];
            break;
          case 2:
                data.multiArray1[1] = ['Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星','4星'];
            break;
          case 3:
                data.multiArray1[1] = ['Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星','4星'];
            break;
          case 4:
                data.multiArray1[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星','4星','5星'];
            break;
          case 5:
                data.multiArray1[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星','4星','5星'];
            break;
          case 6:
                data.multiArray1[1] = ['Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星','4星','5星','6星','7星','8星','9星','10星','11星','12星','13星','14星','15星','16星','17星','18星','19星','20星'];
            break;
        }
    } else {

    }
    this.setData(data);
  },
  bindMultiPickerChange2: function (e) {
    this.setData({
      multiIndex2: e.detail.value
    })
    var v = e.detail.value;
        switch (v[0]) {
          case 0:
            p2 = (v[1]*3+v[2])*r1;
            break;
          case 1:
            p2 = (v[1]*3+v[2])*r2 + 9*r1;
            break;
          case 2:
            p2 = (v[1]*4+v[2])*r3 +9*r2 + 9*r1 ;
            break;
          case 3:
            p2 = (v[1]*4+v[2])*r4 + 16*r3 +9*r2 + 9*r1;
            break;
          case 4:
            p2 = (v[1]*5+v[2])*r5 + 16*r4 + 16*r3 +9*r2 + 9*r1;
            break;
          case 5:
            p2 = (v[1]*5+v[2])*r6 + 25*r5 + 16*r4 + 16*r3 +9*r2 + 9*r1;
            break;
          case 6:
            p2 = (v[1]*5+v[2])*r7 + 25*r6 + 25*r5 + 16*r4 + 16*r3 +9*r2 + 9*r1;
            break;
        }
        this.setData({p2:p2});
  },
  bindMultiPickerColumnChange2: function (e) {
    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    if (e.detail.column==0) {
        switch (e.detail.value) {
          case 0:
                data.multiArray2[1] = ['Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray2[2] = ['1星','2星','3星'];
            break;
          case 1:
                data.multiArray2[1] = ['Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray2[2] = ['0星','1星','2星','3星'];
            break;
          case 2:
                data.multiArray2[1] = ['Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray2[2] = ['0星','1星','2星','3星','4星'];
            break;
          case 3:
                data.multiArray2[1] = ['Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray2[2] = ['0星','1星','2星','3星','4星'];
            break;
          case 4:
                data.multiArray2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray2[2] = ['0星','1星','2星','3星','4星','5星'];
            break;
          case 5:
                data.multiArray2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray2[2] = ['0星','1星','2星','3星','4星','5星'];
            break;
          case 6:
                data.multiArray2[1] = ['Ⅰ段'];
                data.multiArray2[2] = ['0星','1星','2星','3星','4星','5星','6星','7星','8星','9星','10星','11星','12星','13星','14星','15星','16星','17星','18星','19星','20星'];
            break;
        }
    } else {

    }
    this.setData(data);
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
    var that = this;
    var query = new AV.Query('_User');
    query.get(User.current().id).then(function (user) {
          that.setData({
            user
          })
    }, function (error) {
      // 异常处理
    });
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
  bindSendSMS(){
    common.sendSMS('18312538628', '客服消息')
    common.sendSMS('17704054310', '客服消息')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.confi.rankSharePage.title,
      path: app.globalData.confi.rankSharePage.path,
      imageUrl:app.globalData.confi.rankSharePage.imageUrl,
      success: function(res) {
          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res){
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var paramsJson = {
                  user:AV.User.current().id,
                  encryptedData: encryptedData,
                  iv: iv,
                  sessionKey:User.current().attributes.authData.lc_weapp.session_key,
                  }
              Cloud.run('groupId' ,paramsJson)
            }
          })
      }
    }
  }
})
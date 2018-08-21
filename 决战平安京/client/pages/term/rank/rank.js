const AV = require('../../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const Order = require('../../../model/order');
var price;
var title;
var objectId;
var p;
var p1 = 0;
var p2 = 0;
var r1 = 5;
var r2 = 10;
var r3 = 15;
var r4 = 20;
var a;
var b;
Page({

  /**
   * 页面的初始数据⒈Ⅰ ⒉Ⅱ ⒊Ⅲ ⒋Ⅳ ⒌Ⅴ
   */
  data: {
    multiArray1: [['修胜业','得生业','阴阳少属','阴阳大属','阴阳少允','阴阳大允', '大阴阳师'],['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'], ['1星','2星','3星']],
    multiIndex1: [0, 0, 0],
    multiArray2: [['修胜业','得生业','阴阳少属','阴阳大属','阴阳少允','阴阳大允', '大阴阳师'],['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'], ['1星','2星','3星']],
    multiIndex2: [0, 0, 0],
    array1:['少于20个','20个以上'],
    array2:['少于30个','30-60个','60个以上'],
    index1:0,
    index2:0,
    a:1.2,
    b:1.5,
    p1:0,
    p2:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
          var TeamOrder = AV.Object.extend('TeamOrder');
          // 新建对象
          var order = new TeamOrder();
          var targetTeam = AV.Object.createWithoutData('Team', objectId);
          order.set('targetTeam',targetTeam);
          order.set('title',title)
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
        mobilePhoneNumber: '18312538628',
        template: '大神团订单',
        sign:'王者秒约'
        }).then(function(){
              //调用成功
            }, function(err){
              //调用失败
        });
  },
  bindPickerChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
      var v = e.detail.value;
      console.log(v)
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
  bindPickerChange2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex1: e.detail.value
    })
    var v = e.detail.value;
        switch (v[0]) {
          case 0:
            p1 = (v[1]*3+v[2])*r1;
            console.log(p1)
            break;
          case 1:
            p1 = (v[1]*3+v[2])*r1 + 15*r1;
            console.log(p1)            
            break;
          case 2:
            p1 = (v[1]*4+v[2])*r1 + 30*r1;
            console.log(p1) 
            break;
          case 3:
            p1 = (v[1]*4+v[2])*r2 + 20*r1 +30*r1;
            console.log(p1) 
            break;
          case 4:
            p1 = (v[1]*5+v[2])*r2 + 20*r1 +30*r1 +25*r2;
            console.log(p1) 
            break;
          case 5:
            p1 = (v[1]*5+v[2])*r3 + 20*r1 +30*r1 +25*r2 +25*r2;
            console.log(p1) 
            break;
          case 6:
            p1 = (v[1]*5+v[2])*r4 + 20*r1 +30*r1 +25*r2 +25*(r2+r3);
            console.log(p1) 
            break;
        }
        this.setData({
          p1:p1
        })
  },
  bindMultiPickerColumnChange1: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray1: this.data.multiArray1,
      multiIndex1: this.data.multiIndex1
    };
    data.multiIndex1[e.detail.column] = e.detail.value;
    if (e.detail.column==0) {
        switch (e.detail.value) {
          case 0:
                data.multiArray1[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['1星','2星','3星'];
            break;
          case 1:
                data.multiArray1[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星'];
            break;
          case 2:
                data.multiArray1[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiArray1[2] = ['0星','1星','2星','3星','4星'];
            break;
          case 3:
                data.multiArray1[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex2: e.detail.value
    })
    var v = e.detail.value;
        switch (v[0]) {
          case 0:
            p2 = (v[1]*3+v[2])*r1;
            console.log(p2)
            break;
          case 1:
            p2 = (v[1]*3+v[2])*r1 + 15*r1;
            console.log(p2)            
            break;
          case 2:
            p2 = (v[1]*4+v[2])*r1 + 30*r1;
            console.log(p2) 
            break;
          case 3:
            p2 = (v[1]*4+v[2])*r2 + 20*r1 +30*r1;
            console.log(p2) 
            break;
          case 4:
            p2 = (v[1]*5+v[2])*r2 + 20*r1 +30*r1 +25*r2;
            console.log(p2) 
            break;
          case 5:
            p2 = (v[1]*5+v[2])*r3 + 20*r1 +30*r1 +25*r2 +25*r2;
            console.log(p2) 
            break;
          case 6:
            p2 = (v[1]*5+v[2])*r4 + 20*r1 +30*r1 +25*r2 +25*(r2+r3);
            console.log(p2) 
            break;
        }
        this.setData({p2:p2});
  },
  bindMultiPickerColumnChange2: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    if (e.detail.column==0) {
        switch (e.detail.value) {
          case 0:
                data.multiIndex2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiIndex2[2] = ['1星','2星','3星'];
            break;
          case 1:
                data.multiIndex2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiIndex2[2] = ['0星','1星','2星','3星'];
            break;
          case 2:
                data.multiIndex2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiIndex2[2] = ['0星','1星','2星','3星','4星'];
            break;
          case 3:
                data.multiIndex2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiIndex2[2] = ['0星','1星','2星','3星','4星'];
            break;
          case 4:
                data.multiIndex2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiIndex2[2] = ['0星','1星','2星','3星','4星','5星'];
            break;
          case 5:
                data.multiIndex2[1] = ['Ⅴ段','Ⅳ段','Ⅲ段', 'Ⅱ段', 'Ⅰ段'];
                data.multiIndex2[2] = ['0星','1星','2星','3星','4星','5星'];
            break;
          case 6:
                data.multiIndex2[1] = ['Ⅰ段'];
                data.multiIndex2[2] = ['0星','1星','2星','3星','4星','5星','6星','7星','8星','9星','10星','11星','12星','13星','14星','15星','16星','17星','18星','19星','20星'];
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
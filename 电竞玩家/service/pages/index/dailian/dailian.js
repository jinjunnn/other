const Realtime = require('../../../utils/realtime.weapp.min.js').Realtime;
const TextMessage = require('../../../utils/realtime.weapp.min.js').TextMessage;
const AV = require('../../../utils/av-live-query-weapp-min');
const common = require('../../../model/common')
const { User, Query, Cloud } = require('../../../utils/av-live-query-weapp-min');
const Order = require('../../../model/order');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:'',
    mode: 1,

    beginRank: [['倔强青铜Ⅲ段','倔强青铜Ⅱ段','倔强青铜Ⅰ段','秩序白银Ⅲ段','秩序白银Ⅱ段','秩序白银Ⅰ段','荣耀黄金Ⅳ段','荣耀黄金Ⅲ段','荣耀黄金Ⅱ段','荣耀黄金Ⅰ段','尊贵铂金Ⅳ段','尊贵铂金Ⅲ段','尊贵铂金Ⅱ段','尊贵铂金Ⅰ段','永恒钻石Ⅴ段','永恒钻石Ⅳ段','永恒钻石Ⅲ段','永恒钻石Ⅱ段','永恒钻石Ⅰ段','至尊星耀Ⅴ段','至尊星耀Ⅳ段','至尊星耀Ⅲ段','至尊星耀Ⅱ段','至尊星耀Ⅰ段', '最强王者'], ['1星','2星','3星']],
    endRank: [['倔强青铜Ⅲ段','倔强青铜Ⅱ段','倔强青铜Ⅰ段','秩序白银Ⅲ段','秩序白银Ⅱ段','秩序白银Ⅰ段','荣耀黄金Ⅳ段','荣耀黄金Ⅲ段','荣耀黄金Ⅱ段','荣耀黄金Ⅰ段','尊贵铂金Ⅳ段','尊贵铂金Ⅲ段','尊贵铂金Ⅱ段','尊贵铂金Ⅰ段','永恒钻石Ⅴ段','永恒钻石Ⅳ段','永恒钻石Ⅲ段','永恒钻石Ⅱ段','永恒钻石Ⅰ段','至尊星耀Ⅴ段','至尊星耀Ⅳ段','至尊星耀Ⅲ段','至尊星耀Ⅱ段','至尊星耀Ⅰ段', '最强王者'], ['1星','2星','3星']],
    peilianrank:['倔强青铜Ⅲ段','倔强青铜Ⅱ段','倔强青铜Ⅰ段','秩序白银Ⅲ段','秩序白银Ⅱ段','秩序白银Ⅰ段','荣耀黄金Ⅳ段','荣耀黄金Ⅲ段','荣耀黄金Ⅱ段','荣耀黄金Ⅰ段','尊贵铂金Ⅳ段','尊贵铂金Ⅲ段','尊贵铂金Ⅱ段','尊贵铂金Ⅰ段','永恒钻石Ⅴ段','永恒钻石Ⅳ段','永恒钻石Ⅲ段','永恒钻石Ⅱ段','永恒钻石Ⅰ段','至尊星耀Ⅴ段','至尊星耀Ⅳ段','至尊星耀Ⅲ段','至尊星耀Ⅱ段','至尊星耀Ⅰ段', '最强王者'],
    games:['王者荣耀','绝地求生','刺激战场','英雄联盟'],
    zones:['微信-IOS','微信-安卓','QQ-IOS','QQ-安卓'],
    stars:[3,3,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,1],
    times:[3,4,5,6,7,8,9,10],
    timeIndex:0,
    gameIndex:0,
    zoneIndex:0,
    peilianindex:0,
    beginIndex:[0,0],
    endIndex:[0,0],
    p1:0,
    p2:0,
    pricePeilian:[],
    priceDailian:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setConfi()
  },

  setConfi(){
    var that = this;
    var query = new AV.Query('Confi');
    query.get('5a6492c61b69e60066f379a7').then(function (confi) {
         that.setData({
            pricePeilian : confi.attributes.price.peilian,
            priceDailian : confi.attributes.price.dailian,
            image: confi.attributes.price.image,
            confi: confi.attributes,
         }) 
    }, function (error) {
      // 异常处理
    });
  },

  bindgetuserinfo(e){
    console.log(e)
    console.log(AV.User.current())
    if (e.detail.userInfo) {
      if (!AV.User.current()) {
        app.login()
      } else {
        console.log('用户已登录')
      }
        
    } else {
        console.log('用户未授权')
    }
  },

  bindDLOrder(){
      var that = this;
      //由于目前用户在账户上的资金一直不可能太多，因此不做判断。
      var price = this.data.p2 - this.data.p1;
      console.log(price)
      if (this.data.endIndex[0] > this.data.beginIndex[0]) {
          that.donateBuy(AV.User.current().attributes.id+'的代练订单',this.data.beginRank[0][this.data.beginIndex[0]]+this.data.beginRank[1][this.data.beginIndex[1]],this.data.endRank[0][this.data.endIndex[0]]+this.data.endRank[1][this.data.endIndex[1]], this.data.zones[this.data.zoneIndex], price)
      } else {
      wx.showModal({
          title: '提醒',
          content: '目标段位需要高于启始段位。',
          success: function(res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
          })
      }
  },

  bindPLOrder(){
      var that = this;
      //由于目前用户在账户上的资金一直不可能太多，因此不做判断。
      var price = this.data.pricePeilian[this.data.peilianindex];
      var times = this.data.times[this.data.timeIndex];
      console.log(price)
      console.log(times)
      console.log(this.data.peilianrank[this.data.peilianindex])
      that.donateBuy2(AV.User.current().attributes.id+'的代练订单',price,times,)


  },
  //增加1条购买记录
  buyRecord(title,from,to,zone,price){
          var TeamOrder = AV.Object.extend('TeamOrder');
          // 新建对象
          var order = new TeamOrder();
          order.set('title',title);
          order.set('from',from);
          order.set('to',to);
          order.set('zone',zone);
          order.set('targetUser',AV.User.current());
          order.set('status',false);
          order.set('amount',price);
          order.save()
  },

  //增加1条购买记录
  buyRecord2(price,times){
      var ExpertOrder = AV.Object.extend('ExpertOrder');
      var order = new ExpertOrder();
      order.set('targetBuyer',AV.Object.createWithoutData('_User', AV.User.current().id));
      order.set('status','已支付');
      //这里后续可以设置多局购买。
      order.set('times',times)
      order.set('rank', this.data.peilianrank[this.data.peilianindex])
      order.set('price', Number(price))
      order.set('price2', Number(price) - 3)
      order.set('amount',Number(price) * times)
      order.set('zone', this.data.zones[this.data.zoneIndex])
      order.set('amount2',Number(price) *times - 5*times )
      order.save().then(function (todo) {
      }, function (error) {
        console.error(error);
      });
  },
  //创建陪打订单，
  donateBuy2(title,price,times) {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: title,
      amount: price * times * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //成功后的业务逻辑
        if (this.data.mode==1) {
          this.buyRecord(title,from,to,zone,price)
        } else {
          this.buyRecord2(title,price,times)
        }
        
        common.addRecord(title , -price*times)
        common.amendExpenses(- (-price*times))
        //发送一条中奖的消息
        common.sendNotice('官方陪代练' , '恭喜您下单成功，请您尽快完善个人信息资料，或通过客服对话与客服取得联系。')
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
  //创建代打订单
  donateBuy(title,from,to,zone,price) {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
      var paramsJson = {
      productDescription: title,
      amount: price * 100,
    }
    Cloud.run('order' ,paramsJson).then((data) => {
      wx.hideToast();
      data.success = () => {
        //成功后的业务逻辑
        if (this.data.mode==1) {
          this.buyRecord(title,from,to,zone,price)
        } else {
          this.buyRecord2(title,from,to,zone,price)
        }
        
        common.addRecord(title , -price)
        common.amendExpenses(- (-price))
        //发送一条中奖的消息
        common.sendNotice('官方陪代练' , '恭喜您下单成功，请您尽快完善个人信息资料，或通过客服对话与客服取得联系。')
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
  transforMode1(){
    this.setData({mode:1})
  },

  transforMode2(){
    this.setData({mode:2})
  },

  bindGameNameChange(e){
    this.setData({gameIndex:Number(e.detail.value)})
  },

  bindZoneChange(e){
    this.setData({zoneIndex:Number(e.detail.value)})
  },

  bindBeginChange(e){
    this.setData({begin:Number(e.detail.value)})
  },

  bindBeginChange: function (e) {
    this.setData({
      beginIndex: e.detail.value
    })
    var v = e.detail.value;
    var p1 =0;
    if (this.data.mode == 1) {
      console.log('代练')
            for (var i = 0; i < v[0]; i++) {
                p1 = p1 + this.data.priceDailian[i] * this.data.stars[i];
            }
                p1 = p1 + v[1] * this.data.priceDailian[v[0]] + this.data.priceDailian[v[0]];
                console.log(p1)
                this.setData({p1:p1});
    } else {
      console.log('陪练')
            for (var i = 0; i < v[0]; i++) {
                p1 = p1 + this.data.pricePeilian[i] * this.data.stars[i];
            }
                p1 = p1 + v[1] * this.data.pricePeilian[v[0]] + this.data.pricePeilian[v[0]];
                console.log(p1)
                this.setData({p1:p1});
    }
  },
  bindBeginPriceChange(e){
    console.log('bindBeginPriceChange')
    console.log(e.detail.value)
    this.setData({peilianindex:Number(e.detail.value)})
  },

  bindTimesChange(e){
    console.log('bindTimesChange')
    console.log(e.detail.value)
    this.setData({timeIndex:Number(e.detail.value)})
  },

  bindMultiPickerBeginChange: function (e) {
    console.log('woshi bindMultiPickerBeginChange')
    console.log(e.detail)
    console.log(e.detail.column)
    console.log(e.detail.value)
    var data = {
      beginRank: this.data.beginRank,
      beginIndex: this.data.beginIndex
    };
    data.beginIndex[e.detail.column] = e.detail.value;
    if (e.detail.column==0) {
        switch (e.detail.value) {
          case 0:
                data.beginRank[1] = ['1星','2星','3星'];
            break;
          case 1:
                data.beginRank[1] = ['1星','2星','3星'];
            break;
          case 2:
                data.beginRank[1] = ['1星','2星','3星'];
            break;
          case 3:
                data.beginRank[1] = ['1星','2星','3星'];
            break;
          case 4:
                data.beginRank[1] = ['1星','2星','3星'];
            break;
          case 5:
                data.beginRank[1] = ['1星','2星','3星'];
            break;
          case 6:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 7:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 8:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 9:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 10:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 11:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 12:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 13:
                data.beginRank[1] = ['1星','2星','3星','4星'];
            break;
          case 14:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 15:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 16:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 17:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 18:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 19:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 20:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 21:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 22:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 23:
                data.beginRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 24:
                data.beginRank[1] = ['1星','2星','3星','4星','5星','6星','7星','8星','9星','10星','11星','12星','13星','14星','15星','16星','17星','18星','19星','20星'];
            break;
        }
    } else {

    }
    this.setData(data);
  },

  bindEndChange: function (e) {
    this.setData({
      endIndex: e.detail.value
    })
    var v = e.detail.value;
    var p2 = 0;
    if (this.data.mode == 1) {
            if (v[0] > this.data.beginIndex[0]  || v[0]==24) {
                for (var i = 0; i < v[0]; i++) {
                    p2 = p2 + this.data.priceDailian[i] * this.data.stars[i];
                }
                    p2 = p2 + v[1] * this.data.priceDailian[v[0]] + this.data.priceDailian[v[0]];
                    console.log(p2)
                    this.setData({p2:p2});
            } else {
                console.log('目标段位需大于基础段位')
            }
    } else {
            if (v[0] > this.data.beginIndex[0]  || v[0]==24) {
                for (var i = 0; i < v[0]; i++) {
                    p2 = p2 + this.data.pricePeilian[i] * this.data.stars[i];
                }
                    p2 = p2 + v[1] * this.data.pricePeilian[v[0]] + this.data.pricePeilian[v[0]];
                    console.log(p2)
                    this.setData({p2:p2});
            } else {
                console.log('目标段位需大于基础段位')
            }
    }


  },
  bindMultiPickerEndChange: function (e) {
    var data = {
      endRank: this.data.endRank,
      endIndex: this.data.endIndex
    };
    data.endIndex[e.detail.column] = e.detail.value;
    if (e.detail.column==0) {
        switch (e.detail.value) {
          case 0:
                data.endRank[1] = ['1星','2星','3星'];
            break;
          case 1:
                data.endRank[1] = ['1星','2星','3星'];
            break;
          case 2:
                data.endRank[1] = ['1星','2星','3星'];
            break;
          case 3:
                data.endRank[1] = ['1星','2星','3星'];
            break;
          case 4:
                data.endRank[1] = ['1星','2星','3星'];
            break;
          case 5:
                data.endRank[1] = ['1星','2星','3星'];
            break;
          case 6:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 7:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 8:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 9:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 10:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 11:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 12:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 13:
                data.endRank[1] = ['1星','2星','3星','4星'];
            break;
          case 14:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 15:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 16:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 17:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 18:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 19:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 20:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 21:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 22:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 23:
                data.endRank[1] = ['1星','2星','3星','4星','5星'];
            break;
          case 24:
                data.endRank[1] = ['1星','2星','3星','4星','5星','6星','7星','8星','9星','10星','11星','12星','13星','14星','15星','16星','17星','18星','19星','20星'];
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
    return {
      title: this.data.confi.price.title,
      path: this.data.confi.price.path,
      imageUrl:this.data.confi.price.imageUrl,
      success: function(res) {
      }
    }
  }
})
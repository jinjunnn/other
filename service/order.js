const AV = require('leanengine');
const axios = require('axios');
const wxpay = require('./wxpay');
const {
  validateSign,
  handleError,
} = require('./utils');
const { getAccessToken } = require('./access-token')

class Order extends AV.Object {
  get tradeId() { return this.get('tradeId'); }
  set tradeId(value) { this.set('tradeId', value); }

  get amount() { return this.get('amount'); }
  set amount(value) { this.set('amount', value); }

  get user() { return this.get('user'); }
  set user(value) { this.set('user', value); }

  get gamename() { return this.get('gamename'); }
  set gamename(value) { this.set('gamename', value); }

  get orderMode() { return this.get('orderMode'); }
  set orderMode(value) { this.set('orderMode', value); }

  get productDescription() { return this.get('productDescription'); }
  set productDescription(value) { this.set('productDescription', value); }

  get status() { return this.get('status'); }
  set status(value) { this.set('status', value); }

  get ip() { return this.get('ip'); }
  set ip(value) { this.set('ip', value); }

  get tradeType() { return this.get('tradeType'); }
  set tradeType(value) { this.set('tradeType', value); }

  get prepayId() { return this.get('prepayId'); }
  set prepayId(value) { this.set('prepayId', value); }

  place() {
    return new Promise((resolve, reject) => {
      // 参数文档： https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
      wxpay.createUnifiedOrder({
        openid: this.user.get('authData').weapp_wanjia.openid,
        body: this.productDescription,
        out_trade_no: this.tradeId,
        total_fee: this.amount,
        spbill_create_ip: this.ip,
        notify_url: process.env.WEIXIN_NOTIFY_URL,
        trade_type: this.tradeType,
      }, function (err, result) {
        console.log(err, result);
        if (err) return reject(err);
        return resolve(result);
      });
    }).then(handleError).then(validateSign).then(({
      prepay_id,
    }) => {
      this.prepayId = prepay_id;
      return this.save();
    });
  }
  //发布from notice 模板消息
  sendTemplateMessage(formId,openid,date,lotterys,lotterysNew){
              const data = {
              touser: openid,
              template_id: 'dete4tUeMpwASpZlpEEgnD_VP8PDKetplYYCKAEq758',
              form_id: formId,
              page:'pages/lottery/lottery',
              data: {
                "keyword1": {
                  "value": lotterys,
                },
                "keyword2": {
                  "value": '今日免费皮肤'+lotterysNew+'抽奖活动已经开启，请点击查看。' ,
                },
                "keyword3": {
                  "value": '昨日中奖结果已经公布，点击查看中奖名单。' ,
                },
                "keyword4": {
                  "value": '48小时以内',
                },
              },
              emphasis_keyword: 'keyword1.DATA',
            };
            console.log('send notice: ', data);
            return getAccessToken().then(accessToken =>
              axios.post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send', data, {
                params: {
                  access_token: accessToken,
                },
              }).then(({data}) => {
                console.log(data);
              })
            );
  }
  //向系统获取二维码
  sendQRCode(paths,scene){
            return getAccessToken().then(accessToken =>
              axios.post(paths, {
                params: {
                  access_token: accessToken,
                  scene:scene,
                },
              }).then(({data}) => {
                console.log(data);
                return data;
              })
            );
        return;
  }


  //发布普通模板消息
  sendNotice() {
    if (this.orderMode == 0) {
            const data = {
              touser: this.user.get('authData').weapp_shenhuoquan.uid,
              template_id: '1yQqhgnC5KXVm-f-ja0W5sUGZvSiQU-_YG7Rz1gFdgQ',
              form_id: this.prepayId,
              page:'pages/lottery/lottery',
              data: {
                "keyword1": {
                  "value": this.gamename,
                },
                "keyword2": {
                  "value": '王者荣耀',
                },
                "keyword3": {
                  "value": `${this.amount / 100} 元`,
                },
                "keyword4": {
                  "value": '您可以直接加对方游戏ID,赶紧邀请大神吧！',
                },
              },
              emphasis_keyword: 'keyword1.DATA',
            };
            console.log('send notice: ', data);
            return getAccessToken().then(accessToken =>
              axios.post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send', data, {
                params: {
                  access_token: accessToken,
                },
              }).then(({data}) => {
                console.log(data);
              })
            );
        return;
    } else {
            const data = {
              touser: this.user.get('authData').weapp_shenhuoquan.uid,
              template_id: 'D4Chi9j3dl-aUdiFLIiHbAP_HYGcxHi-oX9zlUzyBNE',
              form_id: this.prepayId,
              page:'pages/lottery/lottery',
              data: {
                "keyword1": {
                  "value": `${this.amount / 100} 元`,
                },
                "keyword2": {
                  "value": this.productDescription ,
                },
              },
              emphasis_keyword: 'keyword1.DATA',
            };
            console.log('send notice: ', data);
            return getAccessToken().then(accessToken =>
              axios.post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send', data, {
                params: {
                  access_token: accessToken,
                },
              }).then(({data}) => {
                console.log(data);
              })
            );
    }
  }
}
AV.Object.register(Order);

module.exports = Order;
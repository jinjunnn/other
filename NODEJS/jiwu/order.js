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
      wxpay.createUnifiedOrder({
        openid: this.user.get('authData').lc_weapp.openid,
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
  sendFormIdNotice(objectId, formId){
     console.log('成功发送通知')
  }

  sendWePayNotice(objectId, wepayId){
        const data = {
              touser: this.user.get('authData').lc_weapp.openid,
              template_id: 'PFqAw9zySvJ9dOy5-DB9_OIUOxSikft08JfmKBKctFk',
              form_id: wepayId,
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
  }
  sendNotice() {
    if (this.orderMode == 0) {
            const data = {
              touser: this.user.get('authData').lc_weapp.openid,
              template_id: 'PFqAw9zySvJ9dOy5-DB9_OIUOxSikft08JfmKBKctFk',
              form_id: this.prepayId,
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
              touser: this.user.get('authData').lc_weapp.openid,
              template_id: 'RsqxQbk47v0A-UswZd6DJqr0UXTH-LcVJwjJIvxsSCc',
              form_id: this.prepayId,
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
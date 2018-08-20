const { User } = require('../../utils/av-live-query-weapp-min');

Page({
  data: {
  },
  onLoad: function() {
    this.setData({
      user: User.current(),
    });
  },

});
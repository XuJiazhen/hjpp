const app = getApp()

Page({
  data: {

  },

  onLoad: function (options) {
    const _this = this

    wx.request({
      url: `${app.globalData.baseUrl}/article`,
      method: 'GET',
      header: {
        'x-user-token': wx.getStorageSync('skey'),
        'x-user-id': wx.getStorageSync('openid')
      },
      success(res) {
        console.log('GET ARTICLES: ', res);
      },
      fail(err) {
        console.log(err);
      }
    })
  },
})
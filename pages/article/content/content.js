const app = getApp()

Page({
  data: {
    url: '',
    title: '',
    pic: '',
    id: '',
    shared: false,
    realUserInfo: {}
  },

  onLoad: async function (options) {
    const _this = this
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })

    if (!options.id) {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('acceptDataFromOpenerPage', function (data) {

        _this.setData({
          url: data.url,
          title: data.title,
          pic: data.pic,
        })
      })
    } else {
      try {
        const userInfo = await _this.getUserInfo(options.id)

        _this.setData({
          shared: true,
          realUserInfo: userInfo.data,
          url: decodeURIComponent(options.url),
          id: options.id
        })
        console.log('REQUESTED USERINFO: ', userInfo, options);
      } catch (error) {
        console.log('GET USERINFO FAILED: ', error);
      }
    }
  },

  onShareAppMessage(e) {
    const realUserInfo = wx.getStorageSync('realUserInfo')

    return {
      path: `/pages/article/content/content?id=${realUserInfo.id}&url=${encodeURIComponent(e.webViewUrl)}`,
      title: this.data.title,
    }
  },

  getUserInfo(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.baseUrl}/activity/userInfo/${id}`,
        method: 'GET',
        header: {
          'x-user-token': wx.getStorageSync('skey'),
          'x-user-id': wx.getStorageSync('openid')
        },
        success(res) {
          if (res && res.statusCode === 200) {
            resolve(res.data)
          } else {
            console.log('GET USERINFO FAILED: ', res);
          }
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

  toActivityListPage(e) {
    wx.navigateTo({
      url: `/pages/captain/list/list?id=${this.data.id}&from=article`,
    })
  },

  onMakePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.realUserInfo.cellphone
    })
  }
})
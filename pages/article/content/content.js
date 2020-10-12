Page({
  data: {
    url: '',
    avatarSrc: '',
    title: '',
    pic: '',
    realUserInfo: {}
  },

  onLoad: function (options) {
    const _this = this
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      _this.setData({
        url: data.url,
        title: data.title,
        pic: data.pic,
        realUserInfo: wx.getStorageSync('realUserInfo'),
        avatarSrc: 'https://thirdwx.qlogo.cn/mmopen/vi_32/WkCOvOmryLd5fxiaUUxNS49cUsF3zTKeumqRibNIvLRamoHSw34vE5jMIdf4picGvJp3r7XG91JY7xxrG8WD1KfVA/132'
      })
    })

  },

  onShareAppMessage(e) {
    return {
      title: this.data.title,
    }
  },
})
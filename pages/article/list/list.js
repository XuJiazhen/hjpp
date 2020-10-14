const app = getApp()

Page({
  data: {
    articles: {},
    list: []
  },

  onLoad: function (options) {
    const _this = this

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      _this.setData({
        articles: data.data,
        list: data.data.data
      })
    })
  },

  toArticleContentPage(e) {
    const {
      url,
      title,
      pic
    } = e.currentTarget.dataset

    wx.navigateTo({
      url: '/pages/article/content/content',
      success(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          url,
          title,
          pic
        })
      }
    })
  },
})
const app = getApp()

Page({
  data: {
    template: {},
    imagePath: ''
  },

  onLoad: function (options) {
    const _this = this
    const realUserInfo = wx.getStorageSync('realUserInfo')

    wx.showLoading({
      title: '正在生成',
      success() {
        _this.onGeneratePoster(options.id, realUserInfo.id, options.title)
      }
    })
  },

  onGeneratePoster(id, uid, title) {
    const _this = this
    wx.request({
      url: `${app.globalData.baseUrl}/activity/qrcode`,
      method: 'POST',
      data: {
        src: `/pages/activity/activity?id=${id}&uid=${uid}`
      },
      header: {
        'x-user-token': wx.getStorageSync('skey'),
        'x-user-id': wx.getStorageSync('openid')
      },
      success(res) {
        const qrCode = res.data.img
        const template = {
          background: '/assets/images/poster_cover.png',
          width: '604rpx',
          height: '936rpx',
          borderRadius: '0',
          views: [{
            type: "text",
            text: `【${title}】`,
            css: {
              top: "152rpx",
              left: "100rpx",
              color: 'red',
              fontSize: "36rpx",
              fontWeight: 'bold',
            },
          }, {
            type: 'image',
            url: qrCode,
            css: {
              bottom: '10%',
              left: '202rpx',
              width: '200rpx',
              height: '226rpx',
              mode: 'scaleToFill'
            },
          }],
        }
        _this.setData({
          template
        })

      }
    })
  },

  onImgOK(e) {
    wx.hideLoading({
      success: (res) => {
        this.setData({
          imagePath: e.detail.path
        })
      },
    })
  },

  imgErr(e) {
    console.log('GENERATE POSTER FAILED: ', e);
  },

  onSaveImage(e) {
    const _this = this
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.imagePath,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          mask: true,
          success() {
            _this.setData({
              showQRCode: false
            })
          }
        })
      },
      fail(err) {
        console.log(err);
      }
    })
  }
})
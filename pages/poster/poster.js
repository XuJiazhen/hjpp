Page({
  data: {
    template: {},
    imagePath: ''
  },

  onLoad: function (options) {
    const _this = this
    wx.showLoading({
      title: '正在生成',
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {

      const template = {
        background: '/assets/images/poster_cover.png',
        width: '604rpx',
        height: '936rpx',
        borderRadius: '0',
        views: [{
          type: "text",
          text: `【${data.title}】`,
          css: {
            top: "152rpx",
            left: "100rpx",
            fontSize: "36rpx",
            fontWeight: 'bold',
          },
        }, {
          type: 'image',
          url: data.qrCode,
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
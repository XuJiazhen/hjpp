const app = getApp()

Page({

  data: {
    features: ['如何查看项目', '团长有什么权力', '如何申请团长权限', '如何参与拼团', '参与拼团活动规则', '参与拼团利益好处']
  },

  onLoad: function (options) {
    this.setData({
      wh: wx.getSystemInfoSync().windowHeight
    })
  },
})
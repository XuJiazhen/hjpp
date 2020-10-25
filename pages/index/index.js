const app = getApp();

Page({
  data: {
    navBarInfo: {},
    curTab: 1,
    curPage: 1,
    lastPage: 1,
    newPage: {},
    newPageData: [],
    indexCarousels: [],
    indexProjects: {},
    tabs: [],
    top: Number,
    isBottom: false
  },

  onTabTap(e) {
    this.setData({
      curTab: e.detail.curTab,
      top: 0,
      isBottom: false
    })
  },

  onPageChange(e) {
    this.setData({
      curPage: e.detail.curPage,
      lastPage: e.detail.lastPage
    })
  },

  onShow() {
    if (wx.getStorageSync('refresh')) {
      const project = this.selectComponent('#project')
      project.requestNewPage(this.data.curTab)
      wx.setStorageSync('refresh', false)
    }
  },

  onLoad() {
    this.setData({
      navBarInfo: app.globalData.navBarInfo,
    });
    
    const _this = this

    wx.request({
      url: `${app.globalData.baseUrl}/getHomeRecommend`,
      method: 'GET',
      success(res) {
        _this.setData({
          indexCarousels: res.data.info.carousel,
          indexProjects: res.data.info.list,
          tabs: res.data.info.menu
        })

      }
    })
  },

  onScrollToLower(e) {
    if (this.data.curPage === this.data.lastPage) {
      this.setData({
        isBottom: true
      })
      return
    }

    const _this = this

    wx.request({
      url: `${app.globalData.baseUrl}/getHomeRecommend?page=${this.data.curPage + 1}&index=${this.data.curTab}`,
      method: 'GET',
      success(res) {
        _this.setData({
          newPage: {
            cur: res.data.info.list.current_page,
            last: res.data.info.list.last_page,
            data: res.data.info.list.data
          },
        })
      }
    })
  },
});

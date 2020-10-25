App({
  onLaunch() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    try {
      const systemInfo = wx.getSystemInfoSync()
      const statusBarHeight = systemInfo.statusBarHeight
      const menuButtonRect = wx.getMenuButtonBoundingClientRect()
      const navBarHeight = statusBarHeight + menuButtonRect.height + (menuButtonRect.top - statusBarHeight) * 2
      Object.assign(this.globalData.navBarInfo, { menuButtonRect, statusBarHeight, navBarHeight })

      wx.login({
        success: (res) => {
          wx.request({
            url: 'https://api.huijianfc.cn/cd/wx/mp/login',
            data: {
              code: res.code
            },
            success: res => {
              console.log('LOGIN INFO: ', res);
              const skey = res.data.data.session_key
              const openid = res.data.data.openid
              const realUserInfo = res.data.user_info

              wx.setStorageSync('skey', skey)
              wx.setStorageSync('openid', openid)
              wx.setStorageSync('realUserInfo', realUserInfo)
              wx.setStorageSync('refresh', false)
              wx.setStorageSync('isLogin', true)

              if (realUserInfo.user_type === 'visitor') {
                wx.setStorageSync('isRegistered', false)
              } else {
                wx.setStorageSync('isRegistered', true)
              }

              this.globalData.skey = skey
              this.globalData.openid = openid
              this.globalData.userType = res.data.user_info.user_type
            },
            complete: res => {
              wx.hideLoading()
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: res => {
                        this.globalData.userInfo = res.userInfo

                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })

    } catch (error) {
      console.error(error);
    }
  },
  globalData: {
    navBarInfo: {},
    baseUrl: 'https://api.huijianfc.cn/cd/wx/mp',
    skey: '',
    openid: '',
    flag: 0
  },
})
App({
  onLaunch() {
    const _this = this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })

    wx.checkSession({
      success(res) {
        console.log('SESSION OK: ', res);

        wx.login({
          success: (res) => {
            wx.request({
              url: 'https://api.huijianfc.cn/cd/wx/mp/login',
              data: {
                code: res.code
              },
              success: (res) => {
                console.log('LOGIN INFO: ', res);
                if (res.data.status === 200) {
                  wx.hideLoading()

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

                  _this.globalData.skey = skey
                  _this.globalData.openid = openid
                  _this.globalData.userType = res.data.user_info.user_type

                  if (_this.onLoginCallback) {
                    _this.onLoginCallback(1)
                  }
                }

              }
            })
          }
        })

      },
      fail(err) {
        console.log('SESSION EXPIRED: ', err);

        wx.login({
          success: (res) => {
            wx.request({
              url: 'https://api.huijianfc.cn/cd/wx/mp/login',
              data: {
                code: res.code
              },
              success: (res) => {
                console.log('LOGIN INFO: ', res);

                if (res.data.status === 200) {
                  wx.hideLoading()

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

                  _this.globalData.skey = skey
                  _this.globalData.openid = openid
                  _this.globalData.userType = res.data.user_info.user_type

                  if (_this.onLoginCallback) {
                    _this.onLoginCallback(1)
                  }
                }
              }
            })
          }
        })

      }
    })

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

    wx.getSystemInfo({
      success: (res) => {
        let menuButtonRect = wx.getMenuButtonBoundingClientRect()
        let statusBarHeight = res.statusBarHeight
        let navBarHeight = statusBarHeight + menuButtonRect.height + (menuButtonRect.top - statusBarHeight) * 2
        Object.assign(this.globalData.navBarInfo, { menuButtonRect, statusBarHeight, navBarHeight })
      },
    })
  },
  globalData: {
    navBarInfo: {},
    baseUrl: 'https://api.huijianfc.cn/cd/wx/mp',
    skey: '',
    openid: '',
    flag: 0
  },
})
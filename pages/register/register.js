const app = getApp();

Page({
	data: {
		navBarInfo: {},
		encryptedData: '',
		iv: '',
		skey: '',
		openid: '',
		name: '',
		phone: '',
		id: Number,
		uid: Number
	},

	onSubmit(e) {
		const name = this.data.name
		const phone = this.data.phone
		const _this = this

		if (!name) {
			wx.showToast({
				title: '请输入姓名',
				icon: 'none'
			})
			return
		}
		if (!phone) {
			wx.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}
		if (!/^1[3-9]\d{9}$/.test(phone)) {
			wx.showToast({
				title: '请输入正确的手机号',
				icon: 'none'
			})
			return
		}

		wx.request({
			url: `${app.globalData.baseUrl}/register`,
			method: 'POST',
			data: {
				name,
				phone,
				encryptedData: this.data.encryptedData,
				iv: this.data.iv
			},
			header: {
				'x-user-token': this.data.skey,
				'x-user-id': this.data.openid
			},
			success(res) {
				wx.setStorageSync('isRegistered', true)
				wx.setStorageSync('realUserInfo', res.data.user_info)

				const pages = getCurrentPages()
				const prevPage = pages[pages.length - 2]

				if (prevPage && _this.data.uid) {
					prevPage.setData({
						refresh: true
					})
					wx.showToast({
						title: '注册成功',
						icon: 'success',
						success() {
							setTimeout(() => {
								wx.reLaunch({
									url: `/pages/activity/activity?id=${_this.data.id}&uid=${_this.data.uid}`,
								})
							}, 1000);
						}
					})

				} else {
					wx.showToast({
						title: '注册成功',
						icon: 'success',
						success() {
							setTimeout(() => {
								wx.reLaunch({
									url: '/pages/index/index',
								})
							}, 1000);
						}
					})
				}

			},
			fail(err) {
				console.log(err)
			}
		})
	},

	onInputName(e) {
		this.setData({
			name: e.detail.value
		})
	},

	onInputPhone(e) {
		this.setData({
			phone: e.detail.value
		})
	},

	onClear(e) {
		this.setData({
			name: '',
			phone: ''
		})
	},

	getPhoneNumber(e) {
		const _this = this
		wx.request({
			url: `${app.globalData.baseUrl}/getPhoneNumber`,
			method: 'POST',
			data: {
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv
			},
			header: {
				'x-user-token': this.data.skey,
				'x-user-id': this.data.openid
			},
			success(res) {
				_this.setData({
					phone: res.data.data.phoneNumber
				})
			}
		})
	},

	onLoad(options) {
		const skey = wx.getStorageSync('skey')
		const openid = wx.getStorageSync('openid')

		this.setData({
			navBarInfo: app.globalData.navBarInfo,
			encryptedData: options.encryptedData,
			iv: options.iv,
			skey,
			openid,
			id: options.id,
			uid: options.uid
		});
	},
})
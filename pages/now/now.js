const app = getApp()

Page({
	data: {
		my_activities: {},
		joining_activities: {},
		created: [],
		attended: [],
		isRegistered: Boolean
	},

	onLoad: function (options) {
		wx.showLoading({
			title: '正在加载',
			mask: true,
		})

		const isRegistered = wx.getStorageSync('isRegistered')

		this.setData({
			isRegistered
		})

		if (isRegistered) {
			this.getActivityList()
		} else {
			wx.hideLoading()
		}
	},

	onShow() {
		wx.showLoading({
			title: '正在加载',
			mask: true,
		})

		const isRegistered = wx.getStorageSync('isRegistered')

		this.setData({
			isRegistered
		})

		if (isRegistered) {
			this.getActivityList()
		} else {
			wx.hideLoading()
		}
	},

	getActivityList() {
		const _this = this

		wx.request({
			url: `${app.globalData.baseUrl}/activity/list`,
			method: 'GET',
			header: {
				'x-user-token': app.globalData.skey,
				'x-user-id': app.globalData.openid
			},
			success(res) {
				console.log('ACTIVITY LIST: ', res);

				if (res.data.status === 200 && res.data) {
					wx.hideLoading()
					const data = res.data.data
					const { my_activities } = data
					const { joining_activities } = data

					if (my_activities) {
						const created = []
						my_activities.list.forEach((item) => {
							created.push(item.project)
						})
						_this.setData({
							my_activities: my_activities.list,
							created
						})
					}

					if (joining_activities) {
						const attended = []
						joining_activities.list.forEach((item) => {
							attended.push(item.project)
						})
						_this.setData({
							joining_activities: joining_activities.list,
							attended
						})
					}
				}
			},
			fail(err) {
				wx.hideLoading()
			},
			complete() {
				wx.hideLoading()
			}
		})
	},

})
const app = getApp()

Page({

	data: {
		clinchedList: []
	},

	onLoad: function (options) {
		this.getClinchedList()
	},

	getClinchedList() {
		const _this = this
		wx.request({
			url: `${app.globalData.baseUrl}/mine/dealList`,
			method: 'GET',
			header: {
				'x-user-token': app.globalData.skey,
				'x-user-id': app.globalData.openid
			},
			success(res) {
				console.log('CLINCHED LIST: ', res);

				_this.setData({
					clinchedList: res.data.data
				})
			}
		})
	}
})
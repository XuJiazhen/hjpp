const app = getApp()

Page({
	data: {
		searchText: '',
		searched: []
	},

	onLoad: function (options) {

	},

	onSearchInput(e) {
		this.setData({
			searchText: e.detail.value
		})
	},

	onSearch(e) {
		const _this = this
		wx.showLoading()

		wx.request({
			url: `${app.globalData.baseUrl}/search`,
			method: 'GET',
			data: {
				text: _this.data.searchText
			},
			header: {
				'x-user-token': wx.getStorageSync('skey'),
				'x-user-id': wx.getStorageSync('openid')
			},
			success(res) {
				console.log('SEARCHED DATA:  ', res);
				wx.hideLoading()

				_this.setData({
					searched: res.data.list
				})
			},
			fail(err) {
				console.log(err);
			}
		})
	}
})
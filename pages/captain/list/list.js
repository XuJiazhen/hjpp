const app = getApp();

Page({
	data: {
		activities: []
	},

	onLoad: function (options) {
		const _this = this
		const url = options.from ? `activity/captainActivities/${options.id}` : `mine/member/info?id=${options.id}`

		wx.request({
			url: `${app.globalData.baseUrl}/${url}`,
			method: 'GET',
			header: {
				'x-user-token': wx.getStorageSync('skey'),
				'x-user-id': wx.getStorageSync('openid')
			},
			success(res) {
				console.log('GET ALL ACTIVITIES: ', res);

				_this.setData({
					activities: _this.data.activities.concat(res.data.data.activities)
				})
			},
			fail(err) {
				console.log(err);
			}
		})
	},
})
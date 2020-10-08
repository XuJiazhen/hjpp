const app = getApp();

Page({

	data: {
		activities: []
	},

	onLoad: function (options) {
		const index = options.index

		switch (index) {
			case '3':
				this.getJoinedTeams(index)
				break;
			case '4':
				this.getVisitedTeams(index)
				break;
			case '5':
				this.getSettledTeams(index)
				break;
			default:
				break;
		}
	},

	getJoinedTeams(index) {
		const _this = this

		wx.request({
			url: `${app.globalData.baseUrl}/mine/joinedActivities`,
			method: 'GET',
			header: {
				'x-user-token': wx.getStorageSync('skey'),
				'x-user-id': wx.getStorageSync('openid')
			},
			success(res) {
				console.log('GET ALL JOINED TEAMS: ', res);

				_this.setData({
					activities: _this.data.activities.concat(res.data.data)
				})
			},
			fail(err) {
				console.log(err);
			}
		})
	},

	getVisitedTeams(index) {
		console.log(index);
	},

	getSettledTeams(index) {
		console.log(index);
	},

	toListPage(e) {
		const id = e.currentTarget.dataset.id

		wx.navigateTo({
			url: `/pages/captain/list/list?id=${id}`,
		})
	}
})
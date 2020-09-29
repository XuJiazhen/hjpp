const app = getApp();

Page({

	data: {
		members: []
	},

	onLoad: function (options) {
		const index = options.index

		switch (index) {
			case '0':
				this.getAllMembers(index)
				break;
			case '1':
				this.getVisitedMembers(index)
				break;
			case '2':
				this.getSettledMembers(index)
				break;
			default:
				break;
		}
	},

	getAllMembers(index) {
		const _this = this

		wx.request({
			url: `${app.globalData.baseUrl}/mine/members`,
			method: 'GET',
			header: {
				'x-user-token': wx.getStorageSync('skey'),
				'x-user-id': wx.getStorageSync('openid')
			},
			success(res) {
				console.log('GET ALL MEMBERS: ', res);

				_this.setData({
					members: _this.data.members.concat(res.data.data)
				})
			},
			fail(err) {
				console.log(err);
			}
		})
	},

	getVisitedMembers(index) {
		console.log(index);
	},

	getSettledMembers(index) {
		console.log(index);
	},

	toListPage(e) {
		const id = e.currentTarget.dataset.id

		wx.navigateTo({
			url: `/pages/captain/list/list?id=${id}`,
		})
	}
})
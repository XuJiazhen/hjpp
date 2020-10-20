const app = getApp()

Page({

	data: {
		billStatus: ['全部', '等待中', '已拒绝', '已打款', '支付失败'],
		list: [],
		billList: [],
		idx: 0
	},

	onLoad: function (options) {
		this.getBillList()
	},

	getBillList() {
		const _this = this
		wx.request({
			url: `${app.globalData.baseUrl}/mine/withdraw/list`,
			method: 'GET',
			header: {
				'x-user-token': app.globalData.skey,
				'x-user-id': app.globalData.openid
			},
			success(res) {
				console.log('BILL LIST: ', res);

				_this.setData({
					list: res.data.data,
					billList: res.data.data
				})
			}
		})
	},

	onStatusTap(e) {
		const idx = e.currentTarget.dataset.idx
		let billList = []

		switch (idx) {
			case 0:
				billList = this.data.list
				break;
			case 1:
				billList = this.data.list.filter((item) => {
					return item.status === 'wait'
				})
				break;
			case 2:
				billList = this.data.list.filter((item) => {
					return item.status === 'refused'
				})
				break;
			case 3:
				billList = this.data.list.filter((item) => {
					return item.status === 'paid'
				})
				break;
			case 4:
				billList = this.data.list.filter((item) => {
					return item.status === 'failed'
				})
				break;
		}

		this.setData({
			idx,
			billList
		})
	}
})
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
	},

	onWithdraw(e) {
		const _this = this
		const { id } = e.currentTarget.dataset

		wx.showModal({
			title: '是否发起提现申请',
			cancelText: '否',
			cancelColor: '#935557',
			confirmText: '是',
			confirmColor: '#568690',
			success(res) {
				if (res.confirm) {
					wx.request({
						url: `${app.globalData.baseUrl}/mine/withdraw/${id}/apply`,
						method: 'POST',
						data: {
							_method: 'PUT'
						},
						header: {
							'x-user-token': app.globalData.skey,
							'x-user-id': app.globalData.openid
						},
						success(res) {
							console.log('WITHDRAW: ', res);

							if (res.statusCode === 200 && res.data.msg === 'SUCCESS') {
								wx.showToast({
									title: '已提交审核',
									icon: 'success',
									success() {
										const clinchedList = _this.data.clinchedList.filter((item) => {
											return item.id !== id
										})

										_this.setData({
											clinchedList
										})
									}
								})
							} else {
								wx.showToast({
									title: res.data.msg,
								})
							}
						}
					})

				}
			}
		})
	}
})
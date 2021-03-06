const app = getApp();

Page({
	data: {
		realUserInfo: {},
		isRegistered: false,
		optionHeight: Number,
		wh: Number,
		carousels: [
			{
				id: 15,
				pic: "http://img.huijianfc.com/CITY+PARK_自定义px_2020-05-18-0.png"
			},
			{
				id: 19,
				pic: "http://img.huijianfc.com/宏润达·上城_自定义px_2020-05-17-0.png"
			}
		],
		options: [
			{
				icon: 'icon-accountmultiple',
				text: '我的团员'
			},
			{
				icon: 'icon-bx-bell',
				text: '成员到访'
			},
			{
				icon: 'icon-bx-dollar',
				text: '成员成交'
			},
			{
				icon: 'icon-city',
				text: '参与项目'
			},
			{
				icon: 'icon-bxs-user',
				text: '到访项目'
			},
			{
				icon: 'icon-gavel',
				text: '已购房产'
			},
			{
				icon: 'icon-bookopen',
				text: '公司介绍'
			},
			{
				icon: 'icon-pencilbox',
				text: '意见反馈'
			},
			{
				icon: 'icon-help',
				text: '使用说明'
			}
		],
		totalIncome: 0
	},

	onLoad(options) {
		const _this = this

		this.setData({
			isRegistered: wx.getStorageSync('isRegistered'),
			realUserInfo: wx.getStorageSync('realUserInfo'),
		});

		const query = wx.createSelectorQuery()
		query.select('#option').boundingClientRect((rect) => {
			this.setData({
				optionHeight: rect.width
			})
		}).exec()

		wx.getSystemInfo({
			success(res) {
				_this.setData({
					wh: res.windowHeight
				})
			},
		})
	},

	onShow() {
		this.setData({
			isRegistered: wx.getStorageSync('isRegistered'),
		})
	},

	onGetUserInfo(e) {
		const userInfo = e.detail.userInfo
		const encryptedData = e.detail.encryptedData
		const iv = e.detail.iv

		if (!userInfo) return

		this.toRegisterPage(encryptedData, iv)
	},

	toRegisterPage(encryptedData, iv) {
		wx.navigateTo({
			url: `/pages/register/register?encryptedData=${encryptedData}&iv=${iv}`,
		})
	},

	onShareAppMessage(e) {
		return {
			title: '慧建拼拼',
			path: `/pages/index/index`,
			imageUrl: this.data.carousels[0].pic
		}
	},

	onOptionTap(e) {
		const index = e.currentTarget.dataset.index
		const captain = [0, 1, 2]
		const member = [3, 4, 5]
		const other = [6, 7, 8]

		if (captain.indexOf(index) !== -1) {
			console.log('CAPTAIN: ', index);

			this.toCaptainPage(index)
		}

		if (member.indexOf(index) !== -1) {
			console.log('MEMBER: ', index);

			this.toMemberPage(index)
		}

		if (other.indexOf(index) !== -1) {
			console.log('OTHER: ', index);

			switch (index) {
				case 6:
					this.toCompanyPage(index)
					break;
				case 7:
					this.toFeedbackPage(index)
					break;
				case 8:
					this.toInstructionPage(index)
				default:
					break;
			}
		}
	},

	toCaptainPage(index) {
		wx.navigateTo({
			url: `/pages/captain/captain?index=${index}`,
		})
	},

	toMemberPage(index) {
		wx.navigateTo({
			url: `/pages/member/member?index=${index}`,
		})
	},

	toCompanyPage(index) {
		wx.navigateTo({
			url: `/pages/company/company?index=${index}`,
		})
	},

	toFeedbackPage(index) {
		wx.navigateTo({
			url: `/pages/feedback/feedback?index=${index}`,
		})
	},

	toInstructionPage(index) {
		wx.navigateTo({
			url: `/pages/instruction/instruction?index=${index}`,
		})
	},

	onWithdraw(e) {
		wx.navigateTo({
			url: '/pages/withdraw/withdraw',
		})
	},

	onIncome(e) {
		wx.navigateTo({
			url: '/pages/income/income',
		})
	}
})
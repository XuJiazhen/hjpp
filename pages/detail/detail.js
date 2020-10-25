const app = getApp()

Page({
	data: {
		id: '',
		detail: [],
		album: [],
		index: 0,
		info: {},
		showQrcode: false
	},

	onLoad: function (options) {
		console.log(options);

		const _this = this

		wx.request({
			url: `${app.globalData.baseUrl}/getProjectInfo?id=${options.id}`,
			method: 'GET',
			header: {
				'x-user-token': app.globalData.skey,
				'x-user-id': app.globalData.openid
			},
			success(res) {
				console.log('PROJECT DETAIL: ', res)

				const { info } = res.data

				const detail = [

					{
						label: '开发商',
						text: info.developer
					},
					{
						label: '关键字',
						text: info.keywords
					},
					{
						label: '停车位',
						text: info.parking_number
					},
					{
						label: '物业费',
						text: info.property_manage_fee + ' 平/月'
					},
					{
						label: '产权期',
						text: info.term + ' 年'
					},
					{
						label: '住宅面积',
						text: info.building_area
					},
					{
						label: '绿化面积',
						text: info.green_rate + ' %'
					},
					{
						label: '物业公司',
						text: info.property_manage
					},
					{
						label: '成交方式',
						text: info.payment
					}
				]

				const album = info.album

				album.forEach((item) => {
					const l = item.values.length
					item.rows = parseInt((l / 3) + (l % 3 > 0 ? 1 : 0)) > 3 ? 3 : parseInt((l / 3) + (l % 3 > 0 ? 1 : 0))

					if (l > 9) {
						item.values.pop()
					}
				})


				_this.setData({
					info,
					id: options.id,
					project: info,
					detail,
					album,
					isThisCaptain: info.activity_caption,
					isThisMember: info.activity_member
				})
			}
		})
	},

	onShow() {
		const pages = getCurrentPages();
		const curPage = pages[pages.length - 1];
		const _this = this


		if (this.data.refresh) {
			wx.request({
				url: `${app.globalData.baseUrl}/getProjectInfo?id=${curPage.options.id}`,
				method: 'GET',
				header: {
					'x-user-token': app.globalData.skey,
					'x-user-id': app.globalData.openid
				},
				success(res) {
					console.log('PROJECT DETAIL: ', res)

					const { info } = res.data

					const detail = [
						{
							label: '住宅面积',
							text: info.building_area
						},
						{
							label: '绿化面积',
							text: info.green_rate + ' %'
						},
						{
							label: '开发商',
							text: info.developer
						},
						{
							label: '关键字',
							text: info.keywords
						},
						{
							label: '停车位',
							text: info.parking_number
						},
						{
							label: '物业公司',
							text: info.property_manage
						},
						{
							label: '物业费',
							text: info.property_manage_fee + ' 平/月'
						},
						{
							label: '产权期',
							text: info.term + ' 年'
						},
						{
							label: '成交方式',
							text: info.payment
						}
					]

					let album = []
					if (info.album && info.album.length !== 0) {
						album.concat(info.album)
					}

					album.forEach((item) => {
						const l = item.values.length
						item.rows = parseInt((l / 3) + (l % 3 > 0 ? 1 : 0)) > 3 ? 3 : parseInt((l / 3) + (l % 3 > 0 ? 1 : 0))

						if (l > 9) {
							item.values.pop()
						}
					})

					_this.setData({
						id: curPage.options.id,
						project: info,
						detail: detail,
						album,
						isThisCaptain: info.activity_caption,
						isThisMember: info.activity_member
					})
				}
			})
		}
	},

	onTabTap(e) {
		this.setData({
			index: e.currentTarget.dataset.index
		})
	},

	onGetUserInfo(e) {
		const errMsg = e.detail.errMsg
		const deny = errMsg.substring(errMsg.indexOf('deny'))

		const realUserInfo = wx.getStorageSync('realUserInfo')
		const isLogin = wx.getStorageSync('isLogin')
		const isRegistered = wx.getStorageSync('isRegistered')

		if (deny === 'deny') return

		if (!isLogin) {
			this.toLogin(e)
		} else if (!isRegistered && !realUserInfo.name) {
			this.toRegister(e)
		} else if (realUserInfo.user_type !== 'captain') {
			this.toAudit(e)
		} else {
			this.toInitiateOrder(e)
		}

	},

	toPin(e) {
		const captainId = this.data.isThisCaptain
		const memberId = this.data.isThisMember

		if (captainId) {
			wx.navigateTo({
				url: `/pages/activity/activity?id=${captainId}`,
			})
		}

		if (memberId) {
			wx.navigateTo({
				url: `/pages/activity/activity?id=${memberId}`,
			})
		}
	},

	toLogin(e) {
		const _this = this
		wx.showModal({
			title: '还未登录，是否登录',
			cancelText: '否',
			cancelColor: '#935557',
			confirmText: '是',
			confirmColor: '#568690',
			success(res) {
				if (res.confirm) {
					wx.getUserInfo({
						success(res) {
							console.log('登录成功：', res);

							wx.setStorageSync('isLogin', true)
							wx.showToast({
								title: '登录成功',
								icon: 'success',
								success() {
									const isRegistered = wx.getStorageSync('isRegistered')
									const realUserInfo = wx.getStorageSync('realUserInfo')

									if (!isRegistered && !realUserInfo.name) {
										_this.toRegister(e)
									} else if (!realUserInfo.user_type === 'captain') {
										_this.toAudit(e)
									} else {
										wx.setStorageSync('isRegistered', true)
										_this.toInitiateOrder(e)
									}
								}
							})
						},
						fail(err) {
							console.log('登录失败：', err);
						}
					})

				}
				if (res.cancel) {
					wx.showToast({
						title: '取消登录',
						icon: 'none'
					})
					return
				}
			}
		})
	},

	toRegister(e) {
		wx.showModal({
			title: '您是游客',
			content: '是否前往完善个人信息？',
			cancelText: '取消',
			cancelColor: '#935557',
			confirmText: '前往',
			confirmColor: '#568690',
			success(res) {

				if (res.confirm) {
					wx.navigateTo({
						url: `/pages/register/register?encryptedData=${e.detail.encryptedData}&iv=${e.detail.iv}`,
					})
				}
				if (res.cancel) {
					console.log('取消前往')
				}
			}
		})
	},

	toAudit(e) {
		const _this = this
		wx.showModal({
			title: '发起拼团失败',
			content: '检测到您的身份不是团长，是否申请成为团长？',
			cancelText: '否',
			cancelColor: '#935557',
			confirmText: '是',
			confirmColor: '#568690',
			success(res) {
				if (res.confirm) {
					wx.showLoading({
						title: '正在发起申请',
						success(res) {
							wx.request({
								url: `${app.globalData.baseUrl}/applyForCaptain`,
								method: 'PUT',
								header: {
									'x-user-token': app.globalData.skey,
									'x-user-id': app.globalData.openid
								},
								success(res) {
									console.log('APPLY SUCCESS: ', res)
									wx.setStorageSync('realUserInfo', res.data.info)
									wx.hideLoading({
										success() {
											wx.showToast({
												title: '已发起申请',
												icon: 'success',
												success() {
													_this.setData({
														showQrcode: true
													})
												}
											})
										},
									})
								},
							})
						}
					})
				}
				if (res.cancel) {
					wx.showToast({
						title: '已取消',
						icon: 'none'
					})
				}
			}
		})
	},

	toInitiateOrder(e) {
		const _this = this
		const money = _this.data.info.activity_info.captain_prize.split('.')[0].toString() + '元'
		wx.showModal({
			title: '是否发起拼团？',
			content: `成为团长，每拼团成交一个客户，可得${money}奖金`,
			cancelText: '否',
			cancelColor: '#935557',
			confirmText: '是',
			confirmColor: '#568690',
			success(res) {
				if (res.confirm) {
					wx.showLoading({
						title: '正在发起',
						success() {
							wx.request({
								url: `${app.globalData.baseUrl}/activity/create`,
								method: 'POST',
								data: {
									project_id: _this.data.id
								},
								header: {
									'x-user-token': app.globalData.skey,
									'x-user-id': app.globalData.openid
								},
								success(res) {
									wx.hideLoading()
									wx.setStorageSync('refresh', true)
									console.log('PIN CREATED INFO: ', res)

									if (res.statusCode === 200 && res.data) {
										wx.navigateTo({
											url: `/pages/activity/activity?id=${res.data.new_id}`,
										})
									}
								}
							})

						}
					})
				}
				if (res.cancel) {
					wx.showToast({
						title: '已取消',
						icon: 'none'
					})
					return
				}
			}
		})
	},

	onOpenLocation(e) {
		wx.openLocation({
			latitude: Number(this.data.info.latitude),
			longitude: Number(this.data.info.longitude),
			address: this.data.info.address,
			name: this.data.info.project_name
		})
	},

	prevent(e) {
		return false
	},

	hideQrcode(e) {
		this.setData({
			showQrcode: false
		})
	},

	onPreviewImage(e) {
		const album = this.data.album[this.data.index].values.map(item=>{
			return item.src
		})
		
		wx.previewImage({
			urls: album,
			showMenu: true
		})
	}
})
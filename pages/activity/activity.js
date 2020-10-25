const app = getApp()

Page({
	data: {
		id: '',
		uid: '',
		list: Array,
		project: Object,
		captain: Object,
		members: Array,
		other: Array,
		deadline: String,
		countDown: '',
		detail: {},
		isThisCaptain: Boolean,
		isThisMember: Boolean,
		wxUserInfo: Object,
		showMemberCard: false,
		member: {}
	},

	onLoad: function (options) {
		console.log('OPTIONS: ', options);

		wx.showLoading({
			title: '正在载入',
			mask: true
		})

		if (options.id) {
			this.setData({
				id: options.id
			})
		}

		if (options.uid) {
			this.setData({
				uid: options.uid
			})
		}

		const _this = this
		const pages = getCurrentPages()
		const prevPage = pages[pages.length - 2]

		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})

		if (prevPage) {
			prevPage.setData({
				refresh: true
			})

			_this.getDetailByNid(options.id)
		} else {
			_this.getDetailByUid(options.id, options.uid)
		}

	},

	onShareAppMessage(e) {
		const realUserInfo = wx.getStorageSync('realUserInfo')

		if (this.data.isThisCaptain) {
			return {
				title: `发起了【${this.data.project.project_name}】的拼团，买房拼团省首付，赶快来参加吧`,
				path: `/pages/activity/activity?id=${this.data.id}&uid=${realUserInfo.id}`,
				imageUrl: this.data.project.pic
			}
		}

		if (this.data.isThisMember) {
			return {
				title: `参加了【${this.data.project.project_name}】的拼团，拼团买房得优惠，赶快来参加吧`,
				path: `/pages/activity/activity?id=${this.data.id}&uid=${realUserInfo.id}`,
				imageUrl: this.data.project.pic
			}
		}

		return {
			title: `【${this.data.project.project_name}】开启拼团买房得优惠活动啦，赶快来参加吧`,
			path: `/pages/activity/activity?id=${this.data.id}&uid=${realUserInfo.id}`,
			imageUrl: this.data.project.pic
		}
	},

	onGetUserInfo(e) {
		const wxUserInfo = e.detail.userInfo
		if (!wxUserInfo) return

		this.setData({
			wxUserInfo,
			isLogin: true
		})
		wx.setStorageSync('isLogin', true)

		this.toJoin(e)
	},

	toJoin(e) {
		const _this = this
		wx.showModal({
			title: '是否加入拼团',
			cancelText: '否',
			cancelColor: '#935557',
			confirmText: '是',
			confirmColor: '#568690',
			success(res) {
				if (res.confirm) {
					const realUserInfo = wx.getStorageSync('realUserInfo')
					if (realUserInfo.user_type === 'member' || realUserInfo.user_type === 'captain') {
						_this.setData({
							isRegistered: true
						})
						wx.setStorageSync('isRegistered', true)
						_this.onJoin(_this.data.id)
					}
					if (realUserInfo.user_type === 'visitor') {
						_this.toRegisterPage(e)
					}
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

	onJoin(nid) {
		const _this = this

		wx.showLoading({
			title: '正在加入',
			icon: 'none',
			mask: true,
			success(res) {
				wx.request({
					url: `${app.globalData.baseUrl}/activity/join?activity_id=${nid}`,
					method: 'POST',
					header: {
						'x-user-token': wx.getStorageSync('skey'),
						'x-user-id': wx.getStorageSync('openid')
					},
					success(res) {
						if (res.data.status === 200 && res.data) {
							wx.showToast({
								title: '已加入',
								icon: 'none',
								success(res) {
									wx.request({
										url: `${app.globalData.baseUrl}/activity/info?id=${nid}`,
										method: 'GET',
										header: {
											'x-user-token': wx.getStorageSync('skey'),
											'x-user-id': wx.getStorageSync('openid')
										},
										success(res) {
											console.log('PINTUAN INFO: ', res);

											if (res.statusCode === 200 && res.data) {
												wx.hideLoading()
												const {
													id,
													project,
													captain,
													members,
													other_activities
												} = res.data.data

												_this.onCountDown(project.activity_info.finish_time)
												_this.setData({
													id,
													project,
													captain,
													members,
													other_activities,
													deadline: project.activity_info.finish_time,
													isThisMember: true
												})
											} else {
												console.log('ERRPR: ', res)
											}
										}
									})
								}
							})
						}

					},
					fail(err) {
						console.log('ERROR: ', err);

						wx.hideLoading()
					}
				})
			}
		})
	},

	toRegisterPage(e) {
		const _this = this

		wx.showModal({
			title: '身份信息不完整',
			content: '是否前往完善身份信息？',
			cancelText: '取消',
			cancelColor: '#935557',
			confirmText: '前往',
			confirmColor: '#568690',
			success(res) {
				if (res.confirm) {
					wx.navigateTo({
						url: `/pages/register/register?encryptedData=${e.detail.encryptedData}&iv=${e.detail.iv}&id=${_this.data.id}&uid=${_this.data.uid}`,
					})
				}
				if (res.cancel) {
					console.log('取消前往')
				}
			}
		})
	},

	getDetailByNid(nid) {
		const _this = this

		wx.request({
			url: `${app.globalData.baseUrl}/activity/info?id=${nid}`,
			method: 'GET',
			header: {
				'x-user-token': wx.getStorageSync('skey'),
				'x-user-id': wx.getStorageSync('openid')
			},
			success(res) {
				console.log('PINTUAN INFO: ', res);

				if (res.statusCode === 200 && res.data) {
					wx.hideLoading()
					const userId = wx.getStorageSync('realUserInfo').id
					const {
						id,
						project,
						captain,
						members,
						other_activities
					} = res.data.data

					_this.onCountDown(project.activity_info.finish_time)

					const isThisCaptain = Number(captain.id) === Number(userId)
					const isThisMember = members.some((item) => {
						return Number(item.pivot.member_id) === Number(userId)
					})

					const list = []
					list.push(project)

					const other = []
					if (other_activities && other_activities.length !== 0) {
						other_activities.forEach((item) => {
							other.push(item.project)
						})
					}

					const detail = [{
							label: '开发商',
							text: project.developer
						},
						{
							label: '面积段',
							text: project.on_sale_building
						},
						{
							label: '物业费',
							text: project.property_manage_fee + ' 平/月'
						},
						{
							label: '产权期',
							text: project.term + ' 年'
						},
						{
							label: '物业公司',
							text: project.property_manage
						},
					]

					console.log('IS THIS CAPTAIN: ', isThisCaptain);
					console.log('IS THIS MEMBER: ', isThisMember);

					_this.setData({
						id,
						list,
						project,
						captain,
						members,
						other,
						other_activities,
						detail,
						deadline: project.activity_info.finish_time,
						isThisCaptain,
						isThisMember
					})

				} else {
					console.log('SERVER ERRPR:', res)
				}
			}
		})
	},

	getDetailByUid(nid, uid) {
		const _this = this

		wx.login({
			success: (res) => {
				wx.request({
					url: 'https://api.huijianfc.cn/cd/wx/mp/login',
					data: {
						code: res.code
					},
					success: (res) => {
						console.log('ACTIVITY-LOGIN INFO: ', res);

						const skey = res.data.data.session_key
						const openid = res.data.data.openid
						wx.setStorageSync('skey', skey)
						wx.setStorageSync('openid', openid)
						wx.setStorageSync('realUserInfo', res.data.user_info)

						wx.request({
							url: `${app.globalData.baseUrl}/activity/info?id=${nid}&uid=${uid}`,
							method: 'GET',
							header: {
								'x-user-token': skey,
								'x-user-id': openid
							},
							success(res) {
								console.log('PINTUAN INFO: ', res);

								if (res.statusCode === 200 && res.data) {
									wx.hideLoading()
									const userId = wx.getStorageSync('realUserInfo').id
									const {
										id,
										project,
										captain,
										members,
										other_activities
									} = res.data.data

									_this.onCountDown(project.activity_info.finish_time)

									const isThisCaptain = Number(userId) === Number(uid) || wx.getStorageSync('realUserInfo').name === captain.name
									const isThisMember = members.some((item) => {
										return Number(item.pivot.member_id) === Number(userId)
									})

									const list = []
									list.push(project)

									const other = []
									if (other_activities.length && other_activities.length !== 0) {
										other_activities.forEach((item) => {
											other.push(item.project)
										})
									}

									const detail = [{
											label: '开发商',
											text: project.developer
										},
										{
											label: '面积段',
											text: project.on_sale_building
										},
										{
											label: '物业费',
											text: project.property_manage_fee + ' 平/月'
										},
										{
											label: '产权期',
											text: project.term + ' 年'
										},
										{
											label: '面积段',
											text: project.on_sale_building
										},
										{
											label: '物业公司',
											text: project.property_manage
										},
									]

									console.log('IS THIS CAPTAIN: ', isThisCaptain);
									console.log('IS THIS MEMBER: ', isThisMember);

									_this.setData({
										id,
										list,
										project,
										captain,
										members,
										other,
										other_activities,
										detail,
										deadline: project.activity_info.finish_time,
										isThisCaptain,
										isThisMember
									})
								} else {
									console.log('SERVER ERROR:', res)
								}
							}
						})

					}
				})
			}
		})
	},

	onMakePhoneCall(e) {
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.phonenumber
		})
	},

	toUserPage(e) {
		const userId = e.currentTarget.dataset.id
		const list = this.data.list
		wx.navigateTo({
			url: `/pages/user/user?userId=${userId}`,
			success: res => {
				res.eventChannel.emit('acceptDataFromOpenerPage', {
					list
				})
			}
		})
	},

	onCountDown(deadline) {
		const date = deadline.replace(/-/g, '/')
		setInterval(() => {
			const now = new Date()
			const end = new Date(date)
			const seconds = parseInt((end.getTime() - now.getTime()) / 1000)
			const d = parseInt(seconds / 3600 / 24)
			const h = parseInt(seconds / 3600 % 24)
			const m = parseInt(seconds / 60 % 60)
			const s = parseInt(seconds % 60)

			const countDown = `${d}:${h}:${m}:${s}`
			this.setData({
				countDown
			})
		}, 1000);
	},

	onGenerateQRCode(e) {
		wx.navigateTo({
			url: `/pages/poster/poster?id=${this.data.id}&title=${this.data.project.project_name}`,
		})
	},

	showMemberCard(e) {
		if (!this.data.isThisCaptain) return
		const { avatar, name, phone } = e.currentTarget.dataset

		this.setData({
			showMemberCard: true,
			member: {
				avatar,
				name,
				phone
			}
		})
	},

	closeMemberCard(e) {
		this.setData({
			showMemberCard: false
		})
	},

	makePhoneCall(e) {
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.phone,
		})
	},

	onMemberCardMaskTap(e) {
		this.setData({
			showMemberCard: false
		})
	},

	prevent(e) {
		return false
	}
})
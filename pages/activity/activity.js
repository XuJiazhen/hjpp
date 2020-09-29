const app = getApp()

Page({
	data: {
		id: Number,
		uid: Number,
		list: Array,
		project: Object,
		captain: Object,
		members: Array,
		other: Array,
		isThisCaptain: Boolean,
		isThisMember: Boolean,
		wxUserInfo: Object
	},

	onLoad: function (options) {
		console.log(options);

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

		return {
			title: this.data.project.project_name,
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
						console.log(res);

						if (res.data.status === 200 && res.data) {

							wx.showToast({
								title: '已加入',
								icon: 'none',
								success(res) {
									console.log(res);

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
												const { id, project, captain, members, other_activities } = res.data.data

												const isThisCaptain = Number(id) === Number(nid)
												let isThisMember = false
												members.forEach((item) => {
													isThisMember = Number(item.pivot.activity_id) === Number(id)
												})

												_this.setData({
													id,
													project,
													captain,
													members,
													other_activities,
													isThisCaptain,
													isThisMember
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
					const { id, project, captain, members, other_activities } = res.data.data
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
									const { id, project, captain, members, other_activities } = res.data.data
									const isThisCaptain = Number(userId) === Number(uid)
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
		const list = JSON.stringify(this.data.list)
		wx.navigateTo({
			url: `/pages/user/user?userId=${userId}&list=${list}`,
		})
	}

})
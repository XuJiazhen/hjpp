const app = getApp()



Component({
	properties: {
		curTab: {
			type: Number,
			observer(n) {
				this.requestNewPage(n)
			}
		},
		newPage: {
			type: Object,
			observer(n) {
				if (!Object.keys(n).length) return

				this.setData({
					curPage: n.cur,
					lastPage: n.last,
					list: this.data.list.concat(n.data)
				})

				this.onPageChange(n.cur, n.last)
			}
		},
		navBarHeight: {
			type: Number
		},
		indexCarousels: {
			type: Array,
			observer(n) {
				this.setData({
					carousels: n
				})
			}
		},
		indexProjects: {
			type: Object,
			observer(n) {
				this.setData({
					projects: n
				})
			}
		},
		isBottom: {
			type: Boolean,
			value: false
		}
	},

	data: {
		carousels: [],
		projects: {},
		list: [],
		curPage: 1,
		lastPage: 1,
	},

	methods: {
		toDetail(e) {
			wx.navigateTo({
				url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
			})
		},
		onPageChange(curPage, lastPage) {
			this.triggerEvent('pageChange', {
				curPage,
				lastPage
			})
		},
		requestNewPage(n) {
			const _this = this
			wx.request({
				url: `${app.globalData.baseUrl}/getHomeRecommend?index=${n}`,
				method: 'GET',
				success(res) {
					_this.setData({
						carousels: res.data.info.carousel,
						projects: res.data.info.list,
						list: res.data.info.list.data,
						curPage: res.data.info.list.current_page,
						lastPage: res.data.info.list.last_page
					})

					_this.onPageChange(res.data.info.list.current_page, res.data.info.list.last_page)

				}
			})
		}
	},
})
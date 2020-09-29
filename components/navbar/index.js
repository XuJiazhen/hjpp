const app = getApp();

Component({
	properties: {
		index: {
			type: Boolean,
			value: false
		},
		noTitle: {
			type: Boolean,
			value: false
		},
		tabs: {
			type: Array,
			value: []
		},
		bgColor: {
			type: String,
			value: '#ffffff'
		},
		center: {
			type: Boolean,
			value: false
		},
		centerText: {
			type: String,
			value: ''
		}
	},

	data: {
		navBarInfo: null,
		curTab: 1,
	},

	methods: {
		switchTab(e) {
			this.setData({
				curTab: e.currentTarget.dataset.index,
			});

			this.triggerEvent('tabTap', { curTab: this.data.curTab })
		},
		onSearchBoxTap(e) {
			wx.navigateTo({
				url: '/pages/search/search',
			})
		},

	},

	lifetimes: {
		attached() {
			this.setData({
				navBarInfo: app.globalData.navBarInfo,
			});
		},
	}
})

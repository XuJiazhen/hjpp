// components/project-item/index.js
Component({

	properties: {
		list: {
			type: Array,
			value: [],
		},
		activity: {
			type: Boolean,
			value: false,
		},
		isUser: {
			type: Boolean,
			value: false
		}
	},

	data: {

	},

	methods: {
		toDetail(e) {
			if (this.data.activity) {
				wx.navigateTo({
					url: `/pages/activity/activity?id=${e.currentTarget.dataset.id}`,
				})
			} else if (this.data.isUser) {
				wx.navigateTo({
					url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}&isUser=${true}`,
				})
			} else {
				wx.navigateTo({
					url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
				})
			}
		},
	}
})

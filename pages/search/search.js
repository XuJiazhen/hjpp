Page({
	data: {
		searchText: ''
	},

	onLoad: function (options) {

	},

	onSearch(e) {
		this.setData({
			searchText: e.detail.value
		})
	}
})
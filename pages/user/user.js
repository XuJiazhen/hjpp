Page({
	data: {
		userId: Number,
		list: Array,
		tools: [
			{
				icon: 'icon-bxs-video',
				text: '看视频'
			},
			{
				icon: 'icon-bxs-image',
				text: '效果图'
			},
			{
				icon: 'icon-bxs-building',
				text: '户型图'
			},
			{
				icon: 'icon-bxs-bed',
				text: '样板间'
			},
			{
				icon: 'icon-bxs-landscape',
				text: '实景图'
			},
		]
	},

	onLoad: function (options) {
		const userId = options.userId
		const list = JSON.parse(options.list)

		this.setData({
			userId,
			list
		})
	},
})
const app = getApp()

Page({
	data: {
		userId: '',
		list: [],
		albums: [],
		tools: [{
				icon: 'icon-bxs-video',
				text: '看视频',
				type: 'video'
			},
			{
				icon: 'icon-bxs-image',
				text: '效果图',
				type: 'effect'
			},
			{
				icon: 'icon-bxs-building',
				text: '户型图',
				type: 'structure'
			},
			{
				icon: 'icon-bxs-bed',
				text: '样板间',
				type: 'sample'
			},
			{
				icon: 'icon-bxs-landscape',
				text: '实景图',
				type: 'reality'
			},
		]
	},

	onLoad: function (options) {
		const userId = options.userId
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('acceptDataFromOpenerPage', (data) => {
			console.log('ACCEPTED DATA: ', data)
			wx.request({
				url: `${app.globalData.baseUrl}/project/album/${data.list[0].id}`,
				method: 'GET',
				header: {
					'x-user-token': wx.getStorageSync('skey'),
					'x-user-id': wx.getStorageSync('openid')
				},
				success: res => {
					console.log('GET ALBUMS: ', res);

					this.setData({
						userId,
						list: data.list,
						albums: res.data.data
					})
				},
				complete: res => {
					this.setData({
						userId,
						list: data.list
					})
				}
			})
		})
	},

	onItemClick(e) {
		const {
			type
		} = e.currentTarget.dataset

		const album = this.data.albums.filter((item) => {
			return item.type.type === type
		})

		wx.navigateTo({
			url: `/pages/user/${type}/${type}`,
			success: res => {
				res.eventChannel.emit('acceptDataFromOpenerPage', {
					type,
					album: album.length === 0 ? [] : album[0].photo_list
				})
			}
		})
	}
})
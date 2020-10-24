Page({
  data: {
    data: null
  },

  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log('ACCEPTED DATA: ', data)
      this.setData({
        data
      })
    })
  },
})
const app = getApp()

Page({
  data: {
    selections: ['程序错误', '优化建议', '数据缺失/错误', '其它'],
    images: [],
    selected: [],
    description: '',
    contacts: ''
  },

  onLoad: function (options) {
    this.setData({
      wh: wx.getSystemInfoSync().windowHeight
    })
  },

  onChooseImage(e) {
    const _this = this

    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const {
          tempFilePaths,
        } = res

        const images = []

        if (tempFilePaths.length >= 6) {
          _this.setData({
            images: tempFilePaths
          })
        } else {
          tempFilePaths.forEach(item => {
            images.push(item)
          })
        }

        if (_this.data.images.concat(images).length > 6) {
          const tempImages = _this.data.images.concat(images)
          tempImages.length = 6
          _this.setData({
            images: tempImages
          })
        } else {
          _this.setData({
            images: _this.data.images.concat(images)
          })
        }

        console.log(_this.data.images.length);
      }
    })
  },

  onRemove(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)

    this.setData({
      images
    })
  },

  onSelectionTap(e) {
    const index = e.currentTarget.dataset.index
    const selected = []

    if (this.data.selected.indexOf(index) !== -1) {
      const temp = this.data.selected.filter(item => {
        return item !== index
      })
      this.setData({
        selected: temp
      })
    } else {
      selected.push(index)
      this.setData({
        selected: this.data.selected.concat(selected)
      })
    }
  },

  onDescInput(e) {
    this.setData({
      description: e.detail.value
    })
  },

  onContactsInput(e) {
    this.setData({
      contacts: e.detail.value
    })
  },

  onSubmit(e) {
    const subjects = []
    this.data.selected.forEach(item=>{
      subjects.push(this.data.selections[item])
    })
    const images = this.data.images
    const description = this.data.description
    const contacts = this.data.contacts

    console.log(subjects);
    console.log(images);
    console.log(description);
    console.log(contacts);
  }
})
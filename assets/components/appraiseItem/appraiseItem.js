Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {
    stars: {
      type: Array,
      value: [0,0,0,0,0]
    },
    time: {
      type: String,
      value: ''
    },
  },
  attached() {
    if (this.properties.item.score) {
      let temp = []
      for(var i = 0; i<parseInt(this.properties.item.score); i++) {
        temp.push(1)
      }
      for(var i = this.properties.item.score; i<5; i++) {
        temp.push(0)
      }
      this.setData({
        stars: temp
      })
    }
    if (this.properties.item.update_time) {
      let temp = ''
      temp = this.properties.item.update_time.split(' ')[0]
      this.setData({
        time: temp
      })
    }
  },
  methods: {

  }
})

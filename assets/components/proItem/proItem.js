Component({
  properties: {
    imgUrls: {
      type: String,
      value: []
    },
    goodDetaill: {
      type: Object,
      value: {}
    }
  },
  attached() {
    // console.log(this.properties.goodDetaill)
  },
  data: {

  },
  methods: {
    onJump() {
      this.triggerEvent("onJump");
    }
  }

})

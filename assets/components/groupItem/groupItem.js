Component({
  properties: {
    type: {
      type: String,
      value: 'default'
    },
    item: {
      type: Object,
      value: {}
    },
    timeDes: {
      type: String,
      value: {}
    }
  },
  data: {

  },
  methods: {
    onJump() {
      this.triggerEvent("onJump");
    }
  }
})

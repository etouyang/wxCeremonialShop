Component({
  properties: {
    type: {
      type: String,
      value: 'default' // default, second, group, shop, detail
    },
    title: {
      type: String,
      value: ''
    },
    timeShow: {
      type: String,
      value: ''
    },
    timeDes: {
      type: String,
      value: ''
    }
  },
  data: {

  },
  methods: {
    moreFuc() {
      this.triggerEvent("moreFuc");
    },
  }
})

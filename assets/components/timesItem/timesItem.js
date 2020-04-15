Component({
  properties: {
    times: {
      type: Array,
      value: []
    },
    timerDes: {
      type: String,
      value: ''
    },
    currentIdx: {
      type: Number,
      value: 2
    }
  },
  attached() {
    // console.log(this.properties.goodDetaill)
  },
  methods: {
    selectIdx(e) {
      var idx = e.currentTarget.dataset.index;
      this.triggerEvent("selectIdx", {idx});
    }
  }
})

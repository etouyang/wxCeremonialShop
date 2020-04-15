Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    onJumpDetail() {
      this.triggerEvent("onJumpDetail", {item: this.data.item});
    }
  }
})

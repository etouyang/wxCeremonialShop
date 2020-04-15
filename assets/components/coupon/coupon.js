const app = getApp()
Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: 'default' //unUsed, used, outTime
    }
  },
  data: {
    screenHeight: 800,
  },
  methods: {
    gotoUse() {
      this.triggerEvent("gotoUse", {item: this.data.item});
    },
    getCoupon() {
      this.triggerEvent("getCoupon", {item: this.data.item});
    },
  }
})

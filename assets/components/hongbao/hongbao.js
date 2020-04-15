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
    shopStore() {
      this.triggerEvent("shopStore");
    },
    keFuStore() {
      this.triggerEvent("keFuStore");
    },
    gotoCar() {
      this.triggerEvent("gotoCar");
    },
    addCar() {
      this.triggerEvent("addCar");
    },
    buyNow() {
      this.triggerEvent("buyNow");
    },
  }
})

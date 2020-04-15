const app = getApp()
Component({
  properties: {
    cprice: {
      type: String,
      value: ''
    },
    price: {
      type: String,
      value: ''
    },
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
    singleBuy() {
      this.triggerEvent("singleBuy");
    },
    buyNow() {
      this.triggerEvent("buyNow");
    },
  }
})

const App = getApp()
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    titleStyle: {
      type: String,
      value: ''
    },
    headStyle: {
      type: String,
      value: ''
    },
    leftImg: {
      type: String,
      value: ''
    },
    rightImg: {
      type: String,
      value: ''
    }
  },
  data: {
    normalNav: App.globalData.normalNav,
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  methods: {
    leftFuc() {
      this.triggerEvent("leftFuc");
    },
    rightFuc() {
      this.triggerEvent("rightFuc");
    }
  }
})

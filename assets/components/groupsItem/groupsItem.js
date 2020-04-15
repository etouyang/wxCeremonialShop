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
    gotoGroup(){
      this.triggerEvent("gotoGroup");
    }
  }
})

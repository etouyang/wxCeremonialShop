const app = getApp()
Component({
  properties: {
    propArray: {
      type: Array,
      value: [],
    }
  },
  methods: {
    choiceAddress:function(e){
      var idx = e.target.dataset.index;
      this.triggerEvent("choiceAddress", {idx});
    }
  }
})

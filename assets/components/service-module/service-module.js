import create from '../../../utils/create'
create({
  properties: {
    items: {
      type: Array,
      value: []
    }
  },
  data: {
    indicatorDots: false, //小点
    indicatorColor: "white",//指示点颜色
    activeColor: "coral",//当前选中的指示点颜色
    autoplay: false, //是否自动轮播
    duration: 300, //滑动时间
  },
  methods: {
    search(event) {
      this.store.data.search = {}
      this.update()
      let index = event.currentTarget.dataset.bindex
      let item = this.data.items[0][index]
      const payload = {"cid": item.category_id, "page": 1, "from": "home"}
      wx.navigateTo({
        url:'/pages/search/search?payload=' + JSON.stringify(payload)
      })
    }
  }
})
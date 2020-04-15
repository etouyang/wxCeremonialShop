// components/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls: {
      type: Array,
      value: []
    }
  },
  data: {
    indicatorDots: true, //小点
    indicatorColor: "white",//指示点颜色
    activeColor: "coral",//当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 300, //滑动时间
    currentSwiper: 0,
    autoplay:true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange: function (e) {
      if (e.target.source == 'autoplay' || e.target.source == 'touch') return
      this.setData({
        currentSwiper: e.detail.current
      })
    },
    animationChange(e) {
      // this.activeSlide = e.detail.current;

      if (e.detail.source == "touch") {
        //当页面卡死的时候，current的值会变成0 
        if(e.detail.current == 0){
            //有时候这算是正常情况，所以暂定连续出现3次就是卡了
            let swiperError = this.data.swiperError
            swiperError += 1
            this.setData({swiperError: swiperError })
            if (swiperError >= 3) { //在开关被触发3次以上
                console.error(this.data.swiperError)
                this.setData({ currentSwiper: this.data.currentSwiper });//，重置current为正确索引
                this.setData({swiperError: 0})
            }
        }else {//正常轮播时，记录正确页码索引
            this.setData({ currentSwiper: e.detail.current });
            //将开关重置为0
            this.setData({swiperError: 0})
        }
    }
    },
  }
})

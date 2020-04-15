import {
  getcart
} from '../../../service/request'
const app = getApp()
Component({
  properties: {
    imgUrls: {
      type: Array,
      value: []
    },
    num: {
      type: String,
      value: ''
    }
  },
  data: {
    screenHeight: 800,
  },
  attached: function() {
    // 在组件实例进入页面节点树时执行
    this.getCardNum();
  },
  methods: {
    getCardNum(){
      getcart().then(res=>{
        if(res && res.errno == 0 && res.theTotal){
          this.setData({
            goodsNum:res.theTotal.totalnums
          });
        }else{
          this.setData({
            goodsNum:0
          });
        }
      });
    },
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
      this.getCardNum();
    },
    buyNow() {
      this.triggerEvent("buyNow");
    },
  }
})

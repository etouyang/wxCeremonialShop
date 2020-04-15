import store from '../../../store/index';
import create from '../../../utils/create';
import { 
  detailOrderRequest
} from '../../../service/request'
import newtime from '../../../utils/util'
import {baseUrl} from '../../../service/http'
import {shareWX, shareTitle} from '../../../service/helper'
const App = getApp()
create(store, {
  data: {
    addressinfo: {},
    orderinfo: {},
    products:[],
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    let orderid = options.payload
    detailOrderRequest({orderid}).then(res => {
      if(res.orderinfo && res.products) {
        res.orderinfo.ordertime = newtime.formatTimeTwo(res.orderinfo.ordertime,'Y-M-D h:m:s')
        res.products.map(piece => {
          piece.goods.map(good => {
            good.imgs = good.imgs.map(img => baseUrl.production + img)
            return good
          })
          return piece
        })
        this.setData({
          addressinfo: res.addressinfo,
          orderinfo: res.orderinfo,
          products: res.products
        })
      }
    })
  },
  goBack() {
    wx.navigateBack()
  },
  orderFollow() {
    let payload = {
      orderid: this.data.orderinfo.orderid,
      ordermsg: this.data.orderinfo.ordermsg,
      orderstatusstr: this.data.orderinfo.orderstatusstr
    }
    wx.navigateTo({
      url:'/pages/mine/orderFollow/orderFollow?payload=' + JSON.stringify(payload)
    })
  },
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    return {
      title: shareTitle(),
      desc: '', 
      path: 'pages/home/home',
      success: function(res) {
        wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 1000
        })
      },
      fail: function() {
        wx.showToast({
          title: '转发失败',
          icon: 'fail',
          duration: 1000
        })
      }
    }
  },
})
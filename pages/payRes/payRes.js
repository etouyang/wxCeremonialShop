import store from '../../store/index';
import create from '../../utils/create';
import {
  detailOrderRequest
} from '../../service/request';
import {shareWX, shareTitle} from "../../service/helper"
const App = getApp()
create(store, {
  data: {
    orderid: "",
    result: false,
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    width: App.globalData.screenWidth
  },
  onLoad: function (options) {
    shareWX()
    let paysucc = options.payload
    paysucc = JSON.parse(paysucc)
    if (paysucc.data) {
      let money = 0
      paysucc.data.forEach(order => {
        money += Number(order.totalprice)
      })
      this.setData({
        order: paysucc.data,
        adress: paysucc.adress,
        money,
        paysucc
      })
    }
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  orderDetail(e) {
    wx.navigateTo({
      url:'/pages/mine/orderDetail/orderDetail?payload=' + this.data.orderid
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

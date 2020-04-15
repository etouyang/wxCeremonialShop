import store from '../../../store/index';
import create from '../../../utils/create';
import { 
  loginOrderlist,
  cancelOrderRequest,
  wxPayRequest,
  deleteOrderRequest
} from '../../../service/request'
import {baseUrl} from '../../../service/http'
import newtime from '../../../utils/util'
import {shareWX, shareTitle} from '../../../service/helper'
const App = getApp()
create(store, {
  data: {
    itemArray: [],
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    console.log(options);
    // this.loginOrderlist(options.type);
  },
  goBack() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  orderDetail(e) {
    let index = e.target.dataset.index
    let order = this.data.itemArray[index]
    wx.navigateTo({
      url:'/pages/mine/orderDetail/orderDetail?payload=' + order.orderid
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
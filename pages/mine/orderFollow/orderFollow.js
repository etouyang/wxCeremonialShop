import store from '../../../store/index';
import create from '../../../utils/create';
import {shareWX, shareTitle} from '../../../service/helper'
const App = getApp()
create(store, {
  data: {
    orderid: '',
    ordermsg: '',
    orderstatusstr: []
  },
  onLoad: function(options) {
    shareWX()
    let order = JSON.parse(options.payload)
    this.setData({
      orderid: order.orderid,
      ordermsg: order.ordermsg,
      orderstatusstr: order.orderstatusstr
    })
  },
  goBack() {
    wx.navigateBack()
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
import store from '../../store/index';
import create from '../../utils/create';
import { shopcouponRequest, getCouponRequest } from '../../service/request'
import {shareWX, shareTitle, day} from '../../service/helper'
const App = getApp()
create(store, {
  data: {
    couponList: [],
    normalNav: App.globalData.normalNav,
    screenHeight: App.globalData.screenHeight,
    windowHeight:App.globalData.windowHeight,
  },
  onLoad: function (options) {
    shareWX()
    let parmas = JSON.parse(options.payload)
    shopcouponRequest(parmas).then(res => {
      if (res.errno == 0 && res.data) {
       res.data = res.data.map(coupon => {
        coupon.startedtime = day(coupon.startedtime)
        coupon.endedtime = day(coupon.endedtime)
         return coupon
       })
        this.setData({couponList: res.data})
      }
    }).catch(e => {
      wx.showModal({
        title: '提示',
        content: res.data.errno + '系统异常',
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
        }
      })
    })
  },
  getCoupon(e) {
    let item = e.detail.item
    getCouponRequest({cid: item.id}).then(res => {
      if (res.errno == 0 && res.data) {
        wx.navigateBack();
        wx.showToast({
          title: '优惠券领取成功',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  leftFuc() { //返回按钮
    wx.navigateBack();
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
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

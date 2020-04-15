import store from '../../../../store/index';
import create from '../../../../utils/create';
import {shareWX, shareTitle, day} from '../../../../service/helper'
import {userCouponRequest} from '../../../../service/request'
const App = getApp()
create(store, {
  data: {
    selectArray: [
      {
        id: 1,
        text: '未使用'
      },
      {
        id: 2,
        text: '已使用'
      },
      {
        id: 3,
        text: '已过期'
      }
    ],
    currentItem:1,
    hongbao: [],
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },

  goBack() {
    wx.navigateBack()
  },
  tagChoose(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      'currentItem': id
    });
    userCouponRequest({status: this.data.currentItem}).then(res => {
      if (res.errno == 0) {
        res.data.forEach(hongbao => {
          hongbao.startedtime = day(hongbao.startedtime)
          hongbao.endedtime = day(hongbao.endedtime)
        })
        this.setData({
          hongbao: res.data
        })
      }
    })
  },
  onLoad: function() {
    shareWX()
    userCouponRequest({status: this.data.currentItem}).then(res => {
      if (res.errno == 0) {
        res.data.forEach(hongbao => {
          hongbao.startedtime = day(hongbao.startedtime)
          hongbao.endedtime = day(hongbao.endedtime)
        })
        this.setData({
          hongbao: res.data
        })
      }
    })
  },
  leftFuc() {
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
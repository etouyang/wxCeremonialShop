import store from '../../store/index';
import create from '../../utils/create';
import {searchRequest} from '../../service/request'
import {searchImgUrlAppend, shareWX, shareTitle} from "../../service/helper"
const App = getApp()
create(store, {
  data: {
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    page: '1',
    pages: '1',
    products: [],
  },
  onLoad: function (options) {
    shareWX()
  },
  onReachBottom() {
    let requestPage = parseInt(this.data.page) + 1
    if(requestPage > this.data.pages) return
    this.request(requestPage)
  },
  request(payload) {
    
  },
  leftFuc() {
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

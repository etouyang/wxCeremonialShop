import store from '../../store/index';
import create from '../../utils/create';
import {searchRequest, bannerRequest} from '../../service/request'
import {searchImgUrlAppend, bannerImgUrlAppend, shareWX, shareTitle} from "../../service/helper"
const App = getApp()
create(store, {
  data: {
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    page: '1',
    pages: '1',
    hotGoods: [],
    hotLeft: [],
    hotRight: [],
    bannerMid: []
  },
  onLoad: function () {
    this.request('1')
    shareWX()
  },
  onReachBottom() {
    let requestPage = parseInt(this.data.page) + 1
    if(requestPage > this.data.pages) return
    this.request(requestPage)
  },
  request(page) {
    let areaid = ''
    let area = wx.getStorageSync('area')
    if (area) {
      area = JSON.parse(area)
      areaid = area.id
    }
    searchRequest({areaid, tag: 1, page: page ? page : '1'})
      .then(res => {
        if (res.errno == 0) {
          let hotGoods = searchImgUrlAppend(res.products)
          let hotLeft = searchImgUrlAppend(res.products).filter((item, index) => index%2 == 0)
          let hotRight = searchImgUrlAppend(res.products).filter((item, index) => index%2 == 1)
          if(this.data.hotGoods.length) {
            hotGoods = this.data.hotGoods.concat(hotGoods)
            hotLeft = this.data.hotLeft.concat(hotLeft)
            hotRight = this.data.hotRight.concat(hotRight)
          }
          this.setData({
            hotGoods,hotLeft,hotRight,
            page: res.page ? res.page : '1',
            pages: res.pages ? res.pages : '1',
          })
        }
    })
    bannerRequest({type: '1'})
        .then(res => {
          if (res.errno == 0) {
            let bannerMid = this.bannerImgHandle(res)
            this.setData({bannerMid})
          }
      })
  },
  bannerImgHandle(res) {
    let banners = bannerImgUrlAppend(res.data)
    if (typeof banners != 'object') return []
    banners.map(item => {
      if (item.url == '') {
        item.url = ''
        return item
      } else {
        let sp = item.url.split("?")
        if(sp.length >= 2) {
          let get = sp[1].split("&")[0]
          let space = get.split("=")
          if(space[0] == 'prid') {
            const payload = {"id": space[1]}
            item.url = '/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
          } else {
            const payload = {"shopid": space[1]}
            item.url = '/pages/shopStore/shopStore?payload=' + JSON.stringify(payload)
          }
        } else {
          item.url = ''
          return item
        }
      }
      return item
    })
    return banners
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  onJumpDetail(event) { //跳转推荐
    const payload = {"id": event.detail.item.id}
    wx.navigateTo({
      url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
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

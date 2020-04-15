import store from '../../store/index';
import create from '../../utils/create';
import searchStore from '../../store/search.store';
import {searchRequest} from '../../service/request'
import {searchImgUrlAppend, shareWX, shareTitle} from "../../service/helper"
const App = getApp()
create(store, {
  data: {
    search: searchStore.data,
    normalNav: App.globalData.normalNav,
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    searchstr: '',
    page: '1',
    pages: '1',
    productsLeft: [],
    productsRight: [],
    loveGoods: [],
    loveLeft: [],
    loveRight: [],
    loading: false,
  },
  onLoad: function (options) {
    let parmas = JSON.parse(options.payload)
    this.request(parmas)
    shareWX()
  },
  onReachBottom() {
    let requestPage = parseInt(this.store.data.search.page) + 1
    if(requestPage > this.data.pages) return
    let parmas = {
      page: requestPage,
      keyword: this.data.searchstr,
      from: 'home'
    }
    let areaid = ''
    let area = wx.getStorageSync('area')
    if(area) {
      area = JSON.parse(area)
      areaid = area.id
    }
    parmas.areaid = areaid
    this.request(parmas)
  },
  search() {
    let parmas = {
      page: 1,
      keyword: this.data.searchstr,
      from: 'home'
    }
    let areaid = ''
    let area = wx.getStorageSync('area')

    if(area) {
      area = JSON.parse(area)
      areaid = area.id
    }
    parmas.areaid = areaid
    searchRequest(parmas)
    .then(res => {
      this.store.data.search.page = res.page
      this.store.data.search.pages = res.pages
      let bottom = searchImgUrlAppend(res.products)
      this.store.data.search.products = bottom
      this.update()
      let productsLeft = []
      let productsRight = []
      if(this.store.data.search.products.length) {
        productsLeft = this.store.data.search.products.filter((item, index) => index%2 == 0)
        productsRight = this.store.data.search.products.filter((item, index) => index%2 == 1)
      }
      this.setData({
        page: this.store.data.search.page,
        pages: this.store.data.search.pages,
        loveGoods: this.store.data.home.loveGoods,
        loveLeft: this.store.data.home.loveLeftGoods,
        loveRight: this.store.data.home.loveRightGoods,
        productsLeft,
        productsRight
      })
    })
  },
  request(payload) {
    searchRequest(payload)
    .then(res => {
      this.setData({loading: true})
      if (res.errno == '0') {
        this.store.data.search.page = res.page
        this.store.data.search.pages = res.pages
        let bottom = searchImgUrlAppend(res.products)
        if (!this.store.data.search.products || this.store.data.search.products.length == 0) {
          this.store.data.search.products = bottom
        } else {
          this.store.data.search.products = this.store.data.search.products.concat(bottom)
        }
        this.update()
        let productsLeft = []
        let productsRight = []
        if(this.store.data.search.products.length) {
          productsLeft = this.store.data.search.products.filter((item, index) => index%2 == 0)
          productsRight = this.store.data.search.products.filter((item, index) => index%2 == 1)
        }
        this.setData({
          page: this.store.data.search.page,
          pages: this.store.data.search.pages,
          productsLeft,
          productsRight
        })
      }
    })
  },
  searchList(e) {
    this.setData({
      searchstr: e.detail.detail.value
    })
    console.log(e.detail.detail)
  },
  endsearchList(e) {
    console.log('end search')
    this.search()
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  activity_clear(e) {
    this.setData({
      searchstr: ''
    })
  },
  onJumpDetail(event) {
    const payload = {"id": event.detail.item.pid}
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

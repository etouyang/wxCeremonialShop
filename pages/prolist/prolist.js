import store from '../../store/index';
import create from '../../utils/create';
import prolistStore from '../../store/prolist.store';
import { categorylistRequest } from '../../service/request'
import {tuanCouponImgUrlAppend, shareWX, shareTitle} from '../../service/helper'
const App = getApp()
create(store, {
  data: {
    prolist: prolistStore.data.classifyItems,
    curNav: 0,
    curIndex: 0,
    perGoods: [],
    navHeight: App.globalData.navHeight,
    screenWidth: App.globalData.screenWidth,
    screenHeight: App.globalData.screenHeight,
    windowHeight:App.globalData.windowHeight,
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    itemScrollId: '',
  },
  onLoad: function () {
    shareWX()
    //获取列表
    this.store.data.prolist = {classifyItems:[]}
    this.update()
    categorylistRequest({urid: '2526', page: '1'}).then(res => {
      if (res.errno == 0 && res.list) {
        res.list = res.list.map(group => {
          group.goods = tuanCouponImgUrlAppend(group.goods)
          return group;
        })
        this.store.data.prolist.classifyItems = res.list
        this.setData({
          perGoods: res.list[0].goods,
          curNav: res.list[0].categoryid,
          curIndex: res.list[0].categoryid,
        })
        this.update()
      }
    })
  },
  onPullDownRefresh: function () {
    categorylistRequest({page: '1'}).then(res => {
      wx.stopPullDownRefresh();
      if (res.errno == 0 && res.list) {
        res.list = res.list.map(group => {
          group.goods = tuanCouponImgUrlAppend(group.goods)
          return group;
        })
        this.store.data.prolist.classifyItems = res.list
        this.setData({
          perGoods: res.list[0].goods,
          curNav: res.list[0].categoryid,
          curIndex: res.list[0].categoryid,
        })
        this.update()
      }
    })
  },
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值
    let item = e.target.dataset.item || e.currentTarget.dataset.item
    let indexItem = this.store.data.prolist.classifyItems.filter((res, idx) => {
      res.index = idx;
      return (res.categoryid === item.categoryid)
    })[0]
    // 把点击到的某一项，设为当前index
    this.setData({
      perGoods: item.goods,
      curNav: indexItem.categoryid,
      curIndex: indexItem.categoryid,
      itemScrollId:'A'+ indexItem.categoryid
    })
  },
  onclick() {
    const payload = {"urid": "2526", "from": "category", "keyword": "", "shopid": "", "page": 1}
      this.store.data.search = {}
      this.update()
      wx.navigateTo({
        url:'/pages/search/search?payload=' + JSON.stringify(payload)
      })
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  onJumpDetail(event) {
    let index = event.currentTarget.dataset.bindex
    let item = this.data.perGoods[index]
    const payload = {"id": item.pid}
    wx.navigateTo({
      url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
    })
  },
  onJumpDetailpro(event) {
    let item = event.currentTarget.dataset.item
    const payload = { "id": item.pid }
    console.log(item)
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
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

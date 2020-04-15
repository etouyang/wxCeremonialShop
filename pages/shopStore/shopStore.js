import store from '../../store/index';
import create from '../../utils/create';
import {
  shopRequest,
  shopGoodsRequest,
  shopSearchRequest
} from '../../service/request'
import { baseUrl } from '../../service/http'
import {imgAppend, shareWX, shareTitle} from '../../service/helper'
const App = getApp()
create(store, {
  data: {
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    width: App.globalData.screenWidth,
    height: App.globalData.screenHeight,
    shopid: '54',
    currentItem: '1',
    currentTitle: '店铺首页',
    selectArray: [
      {
        producttype: 1,
        text: '店铺首页'
      },
      {
        producttype: 0,
        text: '全部商品'
      },
      {
        producttype: 2,
        text: '热销商品'
      },
      {
        producttype: 3,
        text: '新品上架'
      }
    ],
    shopInfo: {},
    goodItems:[],
    banners:[]
  },
  onLoad: function (options) {
    let parmas = JSON.parse(options.payload)
    this.setData({
      shopid: parmas.shopid
    })
    this.shopGoods()
    shareWX()
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  tagChoose(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.idx;
    let title = this.data.selectArray[index].text
    this.setData({
      currentItem: id,
      currentTitle: title
    });
    if(id !== 0) { //普通
      shopGoodsRequest({shopid: this.data.shopid, producttype: 1}).then(res => {
        if (res.errno == 0) {
          if(typeof res.data.list == 'object') {
            res.data.list = res.data.list.map(good => {
              good.imgurl = imgAppend(good.imgurl)
              return good
            })
          }
          this.setData({
            goodItems: res.data.list
          })
        }
      })
    } else { //全部
      shopSearchRequest({shopid: this.data.shopid}).then(res => {
        if (res.errno == 0) {
          if(typeof res.data.products == 'object') {
            res.data.products = res.data.products.map(good => {
              good.imgurl = imgAppend(good.imgurl)
              return good
            })
          }
          this.setData({
            goodItems: res.data.products
          })
        }
      })
    }
  },
  onJumpDetail(event) {
    let index = event.currentTarget.dataset.bindex
    let item = this.data.goodItems[index]
    const payload = {"id": item.pid}
    wx.navigateTo({
      url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
    })
  },
  shopGoods() {
    //得分
    shopRequest({shopid: this.data.shopid}).then(res => {
      if (res.errno == 0) {
        if(res.data.banners && res.data.banners.length) {
          res.data.banners = res.data.banners.map(banner => {
            banner.imgadd = baseUrl.production + banner.imgurl
            return banner
          })
        }
        this.setData({
          shopInfo: res.data.shopinfo,
          banners: res.data.banners,
        })
      } else {
        wx.showModal({
          title: '后台错误',
          content: res.msg,
          confirmColor: '#118EDE',
          showCancel: false,
        })
      }
    })
    //列表
    shopGoodsRequest({shopid: this.data.shopid, producttype: 1}).then(res => {
      if (res.errno == 0) {
        if(typeof res.data.list == 'object') {
          res.data.list = res.data.list.map(good => {
            good.imgurl = imgAppend(good.imgurl)
            return good
          })
        }
        this.setData({
          goodItems: res.data.list
        })
      }
    })
  },
  onclick() {
    const payload = {keyword: "", "shopid": this.data.shopid}
    this.store.data.search = {}
    this.update()
    wx.navigateTo({
      url:'/pages/search/search?payload=' + JSON.stringify(payload)
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

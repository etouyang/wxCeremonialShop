import store from '../../store/index';
import create from '../../utils/create';
import goodsDetailStore from '../../store/goodsDetail.store';
import {
  goodsDetailRequest,
  goodsEvalRequest,
  goodsKuRequest,
  addCarRequest,
  greenRequest,
  getcart
} from '../../service/request'
import { goodsDetailAppend, isLogin, shareWX, shareTitle } from '../../service/helper'
import { baseUrl } from '../../service/http'

const App = getApp()
create(store, {
  data: {
    goods: goodsDetailStore.data,
    productsLeft: [],
    productsRight: [],
    green: undefined,
    greenPrice: undefined,
    navHeight: App.globalData.navHeight,
    screenWidth: App.globalData.screenWidth,
    screenHeight: App.globalData.screenHeight,
    windowHeight: App.globalData.windowHeight,
    maskFlag: true,
    buyFlag: '',
    choiceNum: 1,   //选中的数量
    selectGui: undefined, //选中的规格下标
    selectGuiItem: undefined, ////选中的规格对象
    hasCoupon: false,
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    payload: undefined,
  },
  onLoad: function (options) {
    let WxPharse = require('../../wxParse/wxParse.js')
    this.store.data.goods = { detail: {}, evallist: {}, guige: {} }
    this.update()
    let parmas = JSON.parse(options.payload)
    this.setData({ payload: options.payload })
    goodsDetailRequest({ id: parmas.id })
      .then(res => {
        if (res.errno == '0') {
          res.data.share_img = res.data.share_img.indexOf('http') === -1 ? (baseUrl.production + res.data.share_img) : res.data.share_img
          res.data.image = goodsDetailAppend(res.data.image)
          let content = res.data.content
          WxPharse.wxParse('content', 'html', content, this, 5)
          this.store.data.goods.detail = res.data
          let hasCoupon = false
          if (res.data.couponinfo instanceof Array) {
            hasCoupon = false
          } else {
            if (res.data.couponinfo && res.data.couponinfo.money) {
              hasCoupon = true
            }
          }
          this.update()
          this.setData({
            productsLeft: this.store.data.home.loveLeftGoods,
            productsRight: this.store.data.home.loveRightGoods,
            green: this.store.data.green,
            hasCoupon,
          })
          if (res.data.card_id != '0') {
            greenRequest({ pid: parmas.id, urid: parmas.id })
              .then(resGreen => {
                if (resGreen.errno == '0') {
                  this.store.data.green = resGreen.data
                  this.update()
                  this.setData({
                    green: resGreen.data,
                    greenPrice: parseInt(res.data.price) * (100 - parseInt(resGreen.data.discount))
                  })
                }
              })
          }

        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            confirmColor: '#027ee7',
            showCancel: false,
            success: function (res) {
              wx.navigateBack()
            }
          })
        }
      })
    goodsEvalRequest({ pid: parmas.id, perpage: '2' })
      .then(res => {
        this.store.data.goods.evallist = res
        this.update()
      })
    goodsKuRequest({ pid: parmas.id })
      .then(res => {
        this.store.data.goods.guige = res.data
        this.update()
      })
    shareWX()
  },
  onJumpDetail(event) { //跳转推荐
    const payload = { "id": event.detail.item.id }
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
    })
  },
  gotoMore() {
    wx.switchTab({ url: '/pages/prolist/prolist' })
  },
  lesshandle() { //减少数量
    if (this.data.choiceNum <= 0) {
      this.setData({
        choiceNum: 0
      })
    } else {
      let less = this.data.choiceNum - 1
      this.setData({
        choiceNum: less
      })
    }
  },
  addhandle() { //增加数量
    if (!this.data.selectGuiItem) {
      wx.showModal({
        title: '提示',
        content: '请先选择规格',
        confirmColor: '#118EDE',
        showCancel: false,
      })
      return
    }
    if (this.data.choiceNum >= this.data.selectGuiItem.stock) {
      wx.showModal({
        title: '提示',
        content: '商品库存不足',
        confirmColor: '#118EDE',
        showCancel: false,
      })
      return
    }
    let add = this.data.choiceNum + 1
    this.setData({
      choiceNum: add
    })
  },
  confirm: function () { //弹出规格页隐藏
    this.setData({
      maskFlag: true,
      oilchooseFlag: false
    })
  },
  confirmNo() {

  },
  leftFuc() { //返回按钮
    wx.navigateBack();
  },
  rightFuc() {
    wx.navigateTo({ url: '/pages/message/message' })
  },
  gotoSession() {
    wx.navigateTo({ url: '/pages/season/season' })
  },
  goOrderhandle() { //弹出的规格选择确定
    if (this.data.selectGui == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先选择规格',
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
    if (this.data.choiceNum == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择数量',
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
    if (this.data.buyFlag == 'car') {
      this.addToShoppingCar()
    } else {
      this.toPayOrder()
    }
    this.confirm()
  },
  getGuigehandle(event) {
    let index = event.currentTarget.dataset.bindex
    let selectGuiItem = this.store.data.goods.guige[index]
    this.setData({
      selectGui: index,
      selectGuiItem
    })
  },
  getCoupon() {
    const payload = {
      "shopid": this.store.data.goods.detail.shopid,
      "gid": this.store.data.goods.detail.id,
      "po": '3'
    }
    wx.navigateTo({ url: '/pages/shopCoupon/shopCoupon?payload=' + JSON.stringify(payload) })
  },
  shopStoreFuc() {
    const payload = { "shopid": this.store.data.goods.detail.shopid }
    wx.navigateTo({ url: '/pages/shopStore/shopStore?payload=' + JSON.stringify(payload) })
  },
  gotoCarFuc() {
    wx.switchTab({ url: '/pages/shopping/shopping' })
  },
  addCarFuc() {
    if (this.showGuigePage()) {
      this.setData({
        buyFlag: 'car'
      })
    } else {
      this.addToShoppingCar()
    }
  },
  buyNowFuc() {
    if (this.showGuigePage()) { //没有规格选项
      this.setData({
        buyFlag: 'buy'
      })
    } else {
      this.toPayOrder();
    }
  },
  showGuigePage: function () {
    if (this.data.goods.guige.length) {
      this.setData({
        maskFlag: false,
        oilchooseFlag: true
      })
      return true
    }
    return false
  },
  addToShoppingCar() { //加入购物车
    if (!isLogin()) return
    let payload = {
      productid: this.store.data.goods.detail.id,
      sku_id: this.data.selectGuiItem ? this.data.selectGuiItem.id : "",
      num: this.data.choiceNum,
      op: 1
    }
    addCarRequest(payload)
      .then(res => {
        if (res.errno == 0) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
          })
          
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            confirmColor: '#118EDE',
            showCancel: false,
          })
        }
      })
  },
  toPayOrder() {//订单页
    if (this.data.choiceNum == 0) {
      wx.showModal({
        title: '提示',
        content: '请先选择数量',
        confirmColor: '#118EDE',
        showCancel: false,
      })
      return
    }
    if (!isLogin()) return
    // products: [{"num":1,"prodnum":"","productid":"2044","shopid":"192","skuid":"219"}]
    const products = [{
      num: this.data.choiceNum,
      prodnum: "",
      productid: this.store.data.goods.detail.id,
      shopid: this.store.data.goods.detail.shopid,
      skuid: this.data.selectGuiItem ? this.data.selectGuiItem.id : ""
    }]
    wx.navigateTo({
      url: '/pages/order/order?payload=' + JSON.stringify({ products: JSON.stringify(products), "type": 1 })
    })
  },
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    let title = shareTitle()
    if (this.store.data.goods.detail.subtitle && this.store.data.goods.detail.subtitle !== '') {
      title = this.store.data.goods.detail.subtitle
    } else if (this.store.data.goods.detail.share_title && this.store.data.goods.detail.share_title !== '') {
      title = this.store.data.goods.detail.share_title
    }
    return {
      title,
      desc: '',
      path: 'pages/goodsDetail/goodsDetail?payload=' + this.data.payload,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function () {
        wx.showToast({
          title: '转发失败',
          icon: 'fail',
          duration: 1000
        })
      }
    }
  },
})

import store from '../../store/index';
import create from '../../utils/create';
import secondStore from '../../store/second.store';
import { 
  secondDetailRequest,
  goodsEvalRequest,
  goodsKuRequest,
  addCarRequest
} from '../../service/request'
import { imgAppend, isLogin, shareWX, shareTitle, contentImgs } from '../../service/helper'
import { baseUrl } from '../../service/http'

const App = getApp()
create(store, {
  data: {
    second: secondStore.data,
    productsLeft: [],
    productsRight: [],
    timerSecond: undefined, //定时器
    timeDesSecond: ['00','00','00'], //倒计时
    navHeight: App.globalData.navHeight,
    screenWidth: App.globalData.screenWidth,
    screenHeight: App.globalData.screenHeight,
    windowHeight:App.globalData.windowHeight,
    maskFlag: true,
    buyFlag: '',
    choiceNum: 1,   //选中的数量
    selectGui: undefined, //选中的规格下标
    selectGuiItem: undefined, ////选中的规格对象
    hasCoupon: false,
    payload: undefined,
  },
  onLoad: function (options) {
    let WxPharse = require('../../wxParse/wxParse.js')
    shareWX()
    this.store.data.second = {detail:{},evallist:{},guige:{}}
    this.update()
    let parmas = JSON.parse(options.payload)
    this.setData({payload: options.payload})
    //拼团详情
    secondDetailRequest({gid: parmas.gid})
      .then(res => {
        if (res.errno == 0) {
          res.goodsinfo.image = imgAppend(res.goodsinfo.image)
          // res.goodsinfo.content = contentImgs(res.goodsinfo.content)
          let content = res.goodsinfo.content
          WxPharse.wxParse('content', 'html', content, this, 5)

          res.goodsinfo.share_img = res.goodsinfo.share_img.indexOf('http') === -1 ? (baseUrl.production + res.goodsinfo.share_img) : res.goodsinfo.share_img
          res.goodsinfo.thumb = baseUrl.production +res.goodsinfo.thumb
          res.goodsinfo.neednum = res.neednum
          this.store.data.second.detail = res.goodsinfo
          let hasCoupon = false
          if(res.goodsinfo.couponinfo instanceof Array) {
            hasCoupon = false
          } else {
            if(res.goodsinfo.couponinfo && res.goodsinfo.couponinfo.money) {
              hasCoupon = true
            }
          }
          this.update()
          this.setData({
            productsLeft: this.store.data.home.loveLeftGoods,
            productsRight: this.store.data.home.loveRightGoods,
            hasCoupon
          })
          let _this = this
          let end_time = (new Date(res.goodsinfo.end_time)).getTime()
          this.setData({
            timerSecond: setInterval(() => {
              let current_time = (new Date()).getTime()
              let time = (end_time - current_time) / 1000;
              if(time < 0) {
                clearInterval(_this.data.timerSecond);
                _this.setData({
                  timeDesSecond: ['00', '00', '00']
                })
                return
              }
              let day = parseInt(time / (60 * 60 * 24));
              let hou = parseInt(time % (60 * 60 * 24) / 3600) + '';
              if (hou.length == 1) hou = '0'+ hou
              let min = parseInt(time % (60 * 60 * 24) % 3600 / 60) + '';
              if (min.length == 1) min = '0'+ min
              let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60) + '';
              if (sec.length == 1) sec = '0'+ sec
              _this.setData({
                timeDesSecond: [hou, min, sec]
              })
            }, 1000)
          })
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
    goodsEvalRequest({pid: parmas.gid, perpage: '2'})
      .then(res => {
        this.store.data.second.evallist = res
        this.update()
      })
    goodsKuRequest({pid: parmas.gid})
      .then(res => {
        this.store.data.second.guige = res.data
        this.update()
      })
  },
  onJumpDetail(event) { //跳转推荐
    const payload = {"id": event.detail.item.id}
    wx.navigateTo({
      url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
    })
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
    let add = this.data.choiceNum + 1
    this.setData({
      choiceNum: add
    })
  },
  confirm:function(){ //弹出规格页隐藏
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
    wx.navigateTo({url:'/pages/message/message'})
  },
  gotoMore() {
    wx.switchTab({url:'/pages/prolist/prolist'})
  },
  goOrderhandle() { //弹出的规格选择确定
    if (this.data.selectGui == undefined){
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
      //TODO 加入购物车逻辑...
      this.addToShoppingCar()
    } else {
      //TODO立即购买
      this.toPayOrder()
    }
    this.confirm()
  },
  getGuigehandle(event) {
    let index = event.currentTarget.dataset.bindex
    let selectGuiItem = this.store.data.second.guige[index]
    this.setData({
      selectGui: index,
      selectGuiItem
    })
  },
  getCoupon() {
    const payload = {
      "shopid": this.store.data.second.detail.shopid,
      "gid": this.store.data.second.detail.id
    }
    wx.navigateTo({url:'/pages/shopCoupon/shopCoupon?payload=' + JSON.stringify(payload)})
  },
  shopStoreFuc() {
    const payload = {"shopid": this.store.data.second.detail.shopid}
    wx.navigateTo({url:'/pages/shopStore/shopStore?payload=' + JSON.stringify(payload)})
  },
  keFuStoreFuc() {
    console.log('客服')
  },
  gotoCarFuc() {
    wx.switchTab({url:'/pages/shopping/shopping'})
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
  showGuigePage:function(){
    if (this.data.second.guige.length) {
      this.setData({
        maskFlag:false,
        oilchooseFlag:true
      })
      return true
    }
    return false
  },
  addToShoppingCar() { //加入购物车
    if (!isLogin()) return
    let payload = {
      productid: this.store.data.second.detail.id,
      sku_id: this.data.selectGuiItem ? this.data.selectGuiItem.id : "",
      num: this.data.choiceNum,
      op: 1
    }
    addCarRequest(payload)
      .then(res => {
        if (res.errno == 0) {
          wx.showModal({
            title: '提示',
            content: '加入购物车成功',
            confirmColor: '#118EDE',
            showCancel: false,
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
    if(this.data.choiceNum == 0) {
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
        productid: this.store.data.second.detail.gid,
        shopid: this.store.data.second.detail.shopid,
        skuid: this.data.selectGuiItem ? this.data.selectGuiItem.id : ""
      }]
      wx.navigateTo({
        url:'/pages/order/order?payload=' + JSON.stringify({products: JSON.stringify(products), "type": 1})
      })
  },
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    let title = shareTitle()
    if (this.store.data.second.detail.subtitle && this.store.data.second.detail.subtitle !== '') {
      title = this.store.data.second.detail.subtitle
    } else if (this.store.data.second.detail.share_title && this.store.data.second.detail.share_title !== '') {
      title = this.store.data.second.detail.share_title
    }
    return {
      title,
      desc: '', 
      path: 'pages/secondDetail/secondDetail?payload=' + this.data.payload,
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

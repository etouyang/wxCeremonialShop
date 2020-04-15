import store from '../../store/index';
import create from '../../utils/create';
import groupStore from '../../store/group.store';
import { 
  couponDetailRequest,
  couponUserRequest,
  goodsEvalRequest,
  goodsKuRequest,
  addCarRequest
} from '../../service/request'
import { imgAppend, isLogin, shareWX, shareTitle, contentImgs } from '../../service/helper'
import { baseUrl } from '../../service/http'
const App = getApp()
create(store, {
  data: {
    group: groupStore.data,
    userList: [],
    productsLeft: [],
    productsRight: [],
    groupImgs: [
      {url:'/images/common/pin-w1.png', name: '开团/参加团'},
      {url:'/images/common/pin-w2.png', name: '支付成功'},
      {url:'/images/common/pin-w3.png', name: '邀请参团'},
      {url:'/images/common/pin-w4.png', name: '人满成团'},
    ],
    timerSecond: undefined, //定时器
    timeDesSecond: ['00','00','00'], //倒计时
    timerTA: undefined, //定时器
    timeDesTA: '', //倒计时
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
    this.store.data.group = {detail:{},evallist:{},guige:{}}
    this.update()
    let parmas = JSON.parse(options.payload)
    this.setData({payload: options.payload})
    //拼团详情
    couponDetailRequest({gid: parmas.gid})
      .then(res => {
        if (res.errno == 0) {
          res.goodsinfo.image = imgAppend(res.goodsinfo.image)
          // res.goodsinfo.content = contentImgs(res.goodsinfo.content)
          let content = res.goodsinfo.content
          WxPharse.wxParse('content', 'html', content, this, 5)
          
          res.goodsinfo.share_img = res.goodsinfo.share_img.indexOf('http') === -1 ? (baseUrl.production + res.goodsinfo.share_img) : res.goodsinfo.share_img
          res.goodsinfo.thumb = baseUrl.production +res.goodsinfo.thumb
          res.goodsinfo.neednum = res.neednum
          this.store.data.group.detail = res.goodsinfo
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
    //拼团用户列表
    couponUserRequest({gid: parmas.gid})
      .then(res => {
        if (res.errno == 0) {
          this.setData({
            userList: res.data.list
          })
          let _this = this
          let time = Number(res.data.list[0].lasttime)
          this.setData({
            timerTA: setInterval(() => {
              // let current_time = (new Date()).getTime()
              // let time = (end_time - current_time) / 1000;
              time = time -1
              if(time < 0) {
                clearInterval(_this.data.timerTA);
                _this.setData({
                  timeDesTA: '00:00:00'
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
                timeDesTA: hou + ':' + min + ':' + sec
              })
            }, 1000)
          })
        }
    })
    goodsEvalRequest({pid: parmas.gid, perpage: '2'})
      .then(res => {
        this.store.data.group.evallist = res
        this.update()
      })
    goodsKuRequest({pid: parmas.gid})
      .then(res => {
        this.store.data.group.guige = res.data
        this.update()
      })
    shareWX()
  },
  onJumpDetail(event) { //跳转推荐
    const payload = {"id": event.detail.item.id}
    wx.navigateTo({
      url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
    })
  },
  confirmNo() {

  },
  leftFuc() {
    wx.navigateBack();
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  getCoupon() {
    const payload = {
      "shopid": this.store.data.group.detail.shopid,
      "gid": this.store.data.group.detail.gid
    }
    wx.navigateTo({url:'/pages/shopCoupon/shopCoupon?payload=' + JSON.stringify(payload)})
  },
  shopStoreFuc() {
    const payload = {"shopid": this.store.data.group.detail.shopid}
    wx.navigateTo({url:'/pages/shopStore/shopStore?payload=' + JSON.stringify(payload)})
  },
  keFuStoreFuc() {
    console.log('客服')
  },
  gotoMore() {
    wx.switchTab({url:'/pages/prolist/prolist'})
  },
  gotoCarFuc() {
    wx.switchTab({url:'/pages/shopping/shopping'})
  },
  gotoBuy() { //去拼团
    this.toPayOrder(1, 4);
  },
  singleBuy() { //单独购买
    this.toPayOrder(2, 4);
  },
  buyNowFuc() { //拼团购买
    this.toPayOrder(3, 4);
  },
  toPayOrder(pricetype, type) {//订单页
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
        productid: this.store.data.group.detail.gid,
        shopid: this.store.data.group.detail.shopid,
        skuid: this.data.selectGuiItem ? this.data.selectGuiItem.id : ""
    }]
    wx.navigateTo({
      url:'/pages/order/order?payload=' + JSON.stringify({products: JSON.stringify(products), pricetype, type})
    })
  },
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      console.log(options.target)
    }
    let title = shareTitle()
    if (this.store.data.group.detail.subtitle && this.store.data.group.detail.subtitle !== '') {
      title = this.store.data.group.detail.subtitle
    } else if (this.store.data.group.detail.share_title && this.store.data.group.detail.share_title !== '') {
      title = this.store.data.group.detail.share_title
    }
    return {
      title,
      desc: '', 
      path: 'pages/groupDetail/groupDetail?payload=' + this.data.payload,
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

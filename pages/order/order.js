import store from '../../store/index';
import create from '../../utils/create';
import orderStore from '../../store/order.store'
import {
  orderCheckRequest,
  addressRequest,
  buyRequest,
  wxPayRequest,
  greenRequest
} from '../../service/request';
import { baseUrl } from '../../service/http'
import {shareWX, shareTitle} from "../../service/helper"
const App = getApp()
create(store, {
  data: {
    order: orderStore.data,
    adress: undefined,
    parmas: undefined,
    green: undefined,
    greenPrice: undefined,
    goodsNum: [],
    paySucc: {
      data: [],
      adress: undefined,
    },
    normalNav: App.globalData.normalNav,
  },
  onLoad: function (options) {
    shareWX()
    this.store.data.order = {products:[], theTotal: {}, couponsinfo: [], addrlist: []}
    this.update();
    this.setData({
      parmas: JSON.parse(options.payload)
    })
  },
  onShow: function() {
    this.requestOrder(this.data.parmas)
  },
  selectCoupon() {
    //1: 订单页面选择优惠券
    wx.navigateTo({url:'/pages/mine/myAssets/coupon/coupon?payload=' + '1'})
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  requestOrder() {
    //地址
    addressRequest({op: '0'})
      .then(res => {
        if (res.errno == 0) {
          this.store.data.order.addrlist = res.addrlist
          let select = res.addrlist.filter(add => add.isdefault == '1')
          if (select.length) {
            this.setData({adress: select[0]})
          } else {
            this.setData({adress: res.addrlist[0]})
          }
          this.update();
        }
      })
      //订单详情
      // const payload = {products, type:1}
      orderCheckRequest(this.data.parmas)
      .then(res => {
        if (res.errno == 0) {
          if(typeof res.products == 'string') {
            res.products = JSON.parse(res.products)
          }
          let goodsNum = [];
          res.products.map(shop => {
            let num = 0
            if(shop.goods) {
              shop.goods.map(good => {
                num += parseInt(good.num)
                good.imgs = good.imgs.map(img =>{
                  return img.indexOf('http') === -1 ? (baseUrl.production + img) : img
                })
                return good
              })
            }
            if (num == 0) num = 1
            goodsNum.push(num)
            return shop
          })
          this.setData({goodsNum})
          this.store.data.order.products = res.products
          res.theTotal = {...res.theTotal, totalprice: (Number(res.theTotal.totalprice) + Number(res.theTotal.ship_fee) + '')}
          this.store.data.order.theTotal = res.theTotal
          let find = -1
          let selectCoupon = this.store.data.order.couponsinfo;
          if(selectCoupon.length &&
            selectCoupon[0].typeid === '1' && 
            parseInt(res.theTotal.totalgoodprice) > parseInt(selectCoupon[0].min_order_amount)) {
              find = 0
          }
          res.products.forEach((goods, index) => {
            if(selectCoupon.length &&
              selectCoupon[0].typeid === '3' && 
              goods.shopid === selectCoupon[0].sid && 
              parseInt(goods.totalprice) > parseInt(selectCoupon[0].min_order_amount)) {
              find = 0
            }
            goods.goods && goods.goods.forEach((good, idx) => {
              if(selectCoupon.length &&
                selectCoupon[0].typeid === '4' && 
                good.productid === selectCoupon[0].sid && 
                parseInt(good.totalprice) > parseInt(selectCoupon[0].min_order_amount)) {
                find = 0
              }
            })
          })
          if(find == -1) {
            if(this.store.data.order.couponsinfo.length) {
              wx.showToast({
                title: '优惠券不满足使用条件',
                icon: 'none',
                duration: 1000
              })
            }
            this.store.data.order.couponsinfo = []
          } else {
            this.store.data.order.theTotal = {...this.store.data.order.theTotal, totalprice: (Number(res.theTotal.totalprice) + Number(res.theTotal.ship_fee) - Number(selectCoupon[0].min_order_amount) + '')}
          }
          this.update();
          greenRequest({ pid: res.products[0].goods[0].productid, urid: res.products[0].goods[0].productid})
            .then(resGreen => {
              if (resGreen.errno == '0') {
                this.store.data.green = resGreen.data
                this.update()
                this.setData({
                  green: resGreen.data,
                  greenPrice: res.theTotal.totaldisprice
                })
              }
            })
        }
      })
  },
  buyFuc(){
    if (this.store.data.order.addrlist == 0) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let temp = this.store.data.order.products;
    temp.map(shop => {
      shop.shopname = ''
      if(shop.goods) {
        shop.goods.map(good => {
          good.imgs = ''
          good.name = ''
          return good
        })
      }
      return shop
    })
   let stringify = JSON.stringify(temp);
   stringify.replace('&', '')
   let parmas = {
    products: stringify,
    adid: this.store.data.order.addrlist.length ? this.store.data.order.addrlist[0].adid : '',
    carttype: '1',
    skuid: '-1',
    cid: this.store.data.order.couponsinfo.length ? this.store.data.order.couponsinfo[0].id : ''
    }
    buyRequest(parmas)
      .then(res => {
        if (res.errno == '0') {
          let orderid = []
        res.data.forEach(order => {
          orderid.push(order.orderid)
        })
        let payload = {
          orderid: JSON.stringify(orderid),
          ordertype: '4',
          userstr: App.globalData.registerUserInfo.userStr,
          products: this.data.payload,
          cardId: (this.store.data.green && this.store.data.green.id) ? this.store.data.green.id : ''
        }
        wxPayRequest(payload).then(res => {
          if (res.errno == 0) {
            this.processPay(res.jsapi)
          }
        })
        this.setData({
          paySucc: {
            data: res.data,
            adress: this.store.data.order.addrlist[0],
          },
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
    })
  },
  /* 小程序支付 */
  processPay: function (param) {
    let _this = this
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        // success
        console.log("wx.requestPayment返回信息",res);
        let payload = _this.data.paySucc
        wx.navigateTo({
          url: '/pages/paySucc/paySucc?payload=' + JSON.stringify(payload.orderid)
        })
      },
      fail: function () {
        console.log("支付失败");
        wx.showModal({
          title: '失败',
          content: '支付失败',
          confirmColor: '#027ee7',
          showCancel: false,
          success: function (res) {
            wx.navigateBack()
          }
        })
      },
      complete: function () {
        console.log("支付完成(成功或失败都为完成)");
      }
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/mine/myList/addAddress/addAddress'
    })
  },
  changeAddress() {
    //0地址列表 1新增 2更新 3删除 4设为默认
    wx.navigateTo({
      url: '/pages/mine/myList/addAddress/addAddress?payload='+JSON.stringify(this.data.adress)
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

/*
orderid: "20191012151626378251"
ordermsg: "订单保存成功"
ordername: "蚁步支付"
orderstate: "20"
ordertrueid: "3078"
payprice: "1"
shipment_fee: "0"
shopid: "197"
totalprice: "1"
user_id: "8"
1: {orderid: "20191012151626396836", ordertrueid: "3079", ordername: "蚁步支付", shopid: "109", user_id: "8",…}
orderid: "20191012151626396836"
ordermsg: "订单保存成功"
ordername: "蚁步支付"
orderstate: "20"
ordertrueid: "3079"
payprice: "1"
shipment_fee: "0"
shopid: "109"
totalprice: "1"
user_id: "8"
errno: "0"
msg: "ok"
*/
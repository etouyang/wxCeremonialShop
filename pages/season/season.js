import store from '../../store/index';
import create from '../../utils/create';
import { 
  greenRequest,
  greenPayRequest,
  wxPayRequest
} from '../../service/request'
import {baseUrl} from '../../service/http'
import {shareWX, shareTitle} from '../../service/helper'
const App = getApp()
create(store, {
  data: {
    greenInfo: undefined,
    order: undefined,
    info: ['折上96折优惠', '全年300元优惠券', '大客户协议价', '省钱承诺', '服务满意保障', '四季卡会员专享'],
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    console.log(options);
    greenRequest({cardtype: 1}).then(res => {
      if(res.errno == '0') {
        this.store.data.green = res.data
        this.update()
        this.setData({
          greenInfo: res.data
        })
      }
    })
  },
  rechargeMoney() {
    greenPayRequest({card_id: 1,channel: 4}).then(res => {
      if(res.errno == '0' && res.data.length > 0) {
        this.setData({
          order: res.data[0]
        })
        this.payorder();
        /*
        orderid: "20191106175113914601"
        ordermsg: "订单保存成功"
        orderstate: "20"
        shipment_fee: "0"
        shopid: "4"
        totalprice: "9900"
        user_id: "3"
        */
      }
    })
  },
  payorder() {
    let order = this.data.order
    let products = [
      {
        "shopid":order.shopid
      }
    ]
    let payload = {
      orderid: JSON.stringify([order.orderid]),
      ordertype: '4',
      userstr: App.globalData.registerUserInfo.userStr,
      products: JSON.stringify(products),
    }
    wxPayRequest(payload).then(res => {
      if (res.errno == 0) {
        this.processPay(res.jsapi)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
    this.setData({
      paySucc: {
        orderid: order.orderid
      },
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
          url: '/pages/paySucc/paySucc?payload=' + JSON.stringify(payload)
        })
      },
      fail: function () {
        console.log("支付失败");
      },
      complete: function () {
        console.log("支付完成(成功或失败都为完成)");
      }
    })
  },
  moreList() {
    wx.navigateTo({url:'/pages/seasonList/seasonList'})
  },
  goBack() {
    wx.navigateBack()
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
/*
cardMoney: "20396"
createdtime: "2019-04-26 09:45:35"
discount: "96"
endtime: "2025-10-01 09:45:46"
id: "1"
imgurl: "https://polyfs.ant-step.com/upload/2019042412034301007644.png"
money: "9900"
name: "四季生活卡"
share_name: "四季生活卡99元"
starttime: "2019-04-26 09:45:41"
status: "0"
statusName: "用户未购买"
*/
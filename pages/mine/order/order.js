import store from '../../../store/index';
import create from '../../../utils/create';
import { 
  loginOrderlist,
  cancelOrderRequest,
  wxPayRequest,
  deleteOrderRequest,
  changeOrderRequest,
  changeAddressRequest
} from '../../../service/request'
import {baseUrl} from '../../../service/http'
import newtime from '../../../utils/util'
import {shareWX, shareTitle} from '../../../service/helper'
const App = getApp()
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    noDataTips:"暂无数据",
    currentItem: 1,
    selectArray: [
      {
        id: 1,
        text: '全部'
      },
      {
        id: 2,
        text: '待付款'
      },
      {
        id: 5,
        text: '待发货'
      },
      {
        id: 6,
        text: '待收货'
      },
      {
        id: 3,
        text: '待评价'
      },
    ],
    itemArray: [],
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    shareWX()
    console.log(options);
    if (options.type) {
      this.setData({
        currentItem: options.type
      })

    }
    this.loginOrderlist(options.type);
  },

  loginOrderlist(val){
    let parmes = {
      pageSize: 100,
      page: 1,
      type: val, 
    }
    loginOrderlist(parmes).then(res => {
      if (res.errno == 0) {
        res.list = res.list.map(item => { //每个商店
          item.goods.map(v => {
              v.price = Number(v.price/100).toFixed(2)
              v.imgs = v.imgs.map(img => baseUrl.production + img )
          });
          item.creatTime = newtime.formatTimeTwo(item.order_time,'Y-M-D h:m:s')
          item.payprice = Number(item.payprice/100).toFixed(2)
          return item
        })
        
        this.setData({
          itemArray: res.list
        })
      }
      this.update()
    })
  },
  goBack() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  pingjia(e) {
    // let item = e.detail.item
    let index = e.currentTarget.dataset.index
    let payload = { item: this.data.itemArray[index] }
    wx.navigateTo({url:'/pages/pingjia/pingjia?payload=' + JSON.stringify(payload)})
  },
  deleteOrder(e) {
    let _this = this
    let index = e.target.dataset.index
    let order = this.data.itemArray[index]
    wx.showModal({
      title: '提示',
      content: '确认删除？订单删除后不可恢复！',
      success(res) {
        if (res.confirm) {
          deleteOrderRequest({ordersn: order.orderid}).then(res => {
            if(res.errno == 0) {
              wx.showModal({
                title: '成功',
                content: '删除订单成功',
                confirmColor: '#118EDE',
                showCancel: false,
                success: function (res) {
                  _this.loginOrderlist(_this.data.currentItem);
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },

  tagChoose(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    self.setData({
      'currentItem': id,
      noDataTips:"暂无"+(id > 1?"【"+title+"】":"")+"订单"
    });
    this.loginOrderlist(id);
  },
  cancelOrder(e) {
    console.log(e)
    let orderid = e.currentTarget.dataset.id
    cancelOrderRequest({orderid}).then(res => {
      if(res.errno == 0) {
        wx.showModal({
          title: '成功',
          content: '您的退款申请已提交',
          confirmColor: '#118EDE',
          showCancel: false,
          success: function (res) {
          }
        })
      } else {
        wx.showModal({
          title: '退款失败',
          content: res.msg,
          confirmColor: '#118EDE',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    })
  },
  orderDetail(e) {
    let index = e.target.dataset.index
    if (index === undefined) {
      index = e.currentTarget.dataset.index
    }
    let order = this.data.itemArray[index]
    wx.navigateTo({
      url:'/pages/mine/orderDetail/orderDetail?payload=' + order.orderid
    })
  },
  changeOrder(e) {
    //延长收货/确认收货/催促发货/查看物流
    let order_id = e.target.dataset.item.orderid
    let status = e.target.dataset.index
    changeOrderRequest({order_id, status}).then(res => {
      if (res.errno == 0) {
        wx.showToast({
          title: '成功',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  getFapiao(e) {
    let item = e.target.dataset.item
    if(item.user_ainvoice == '0') {
      let orderIdArr = e.target.dataset.item.orderid
      let price = Number(e.target.dataset.item.ordertotalprice/100).toFixed(2)
      wx.navigateTo({
        url: '/pages/mine/fapiao/fapiao?payload='+ JSON.stringify({orderIdArr, price})
      })
      return
    } else {
      wx.showToast({
        title: '您已提交过申请',
        icon: 'none',
        duration: 1000
      })
    }
  },
  changeAddress(e) {
    let adid = e.target.dataset.item.adid
    changeAddressRequest({adid}).then(res => {
      if (res.errno == 0) {
        let select = res.data
        select.adid = adid
        select.area_str = select.areaStr
        select.uname = select.name
        wx.navigateTo({
          url: '../myList/addAddress/addAddress?payload='+JSON.stringify(select)
        })
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  payorder(e) {
    console.log(e)
    let index = e.target.dataset.index
    let order = this.data.itemArray[index]
    let products = [
      {
        "num":order.goods[0].num,
        "productid":order.goods[0].productid,
        "shopid":order.shopid
      }
    ]
    let payload = {
      orderid: JSON.stringify([order.orderid]),
      ordertype: '4',
      userstr: App.globalData.registerUserInfo.userStr,
      products: JSON.stringify(products),
      cardId: (this.store.data.green && this.store.data.green.id) ? this.store.data.green.id : ''
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
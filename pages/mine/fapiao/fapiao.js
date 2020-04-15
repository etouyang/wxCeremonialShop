import store from '../../../store/index';
import create from '../../../utils/create';
import { 
  fapiaoRequest
} from '../../../service/request'
import {baseUrl} from '../../../service/http'
import {shareWX, shareTitle} from '../../../service/helper'
const App = getApp()
create(store, {
  data: {
    orderIdArr: '',
    type: '',
    type_content: '',
    title: '',
    bank_name: '',
    bank_account: '',
    address: '',
    no: '', //税号
    remark: '',
    price: '',
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    let payload = options.payload
    if(payload) {
      payload = JSON.parse(payload)
      let orderIdArr = payload.orderIdArr
      let price = payload.price
      this.setData({orderIdArr, price})
    }
  },
  goBack() {
    wx.navigateBack()
  },
  fapiaoType(e) {
    let value = e.detail.value
    if (value == 'radio1') {
      this.setData({type: 1})
    } else if (value == 'radio2') {
      this.setData({type: 2})
    } else if (value == 'radio3') {
      this.setData({type_content: 1})
    } else if (value == 'radio4') {
      this.setData({type_content: 4})
    }
  },
  getTitle(e) {
    let title = e.detail.value
    this.setData({title})
  },
  getNo(e) {
    let no = e.detail.value
    this.setData({no})
  },
  getAddress(e) {
    let address = e.detail.value
    this.setData({address})
  },
  fapiaoMore(e) {
    let detail = {
      remark: this.data.remark,
      bank_name: this.data.bank_name,
      bank_account: this.data.bank_account
    }
    wx.navigateTo({
      url:'/pages/mine/fapiaomore/fapiaomore?payload='+JSON.stringify(detail)
    })
  },
  fapiaoSubmit() {
    if(this.data.type == '') {
      wx.showToast({
        title: '请选择抬头',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(this.data.title == '') {
      wx.showToast({
        title: '请输入发票抬头',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(this.data.type == '2' && this.data.no == '') {
      wx.showToast({
        title: '请输入税号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(this.data.address == '') {
      wx.showToast({
        title: '请输入配送地址',
        icon: 'none',
        duration: 1000
      })
      return
    }
    fapiaoRequest({
      orderIdArr: this.data.orderIdArr,
      type: this.data.type,
      type_content: this.data.type_content,
      title: this.data.title,
      bank_name: this.data.bank_name,
      bank_account: this.data.bank_account,
      address: this.data.address,
      no: this.data.no,
      remark: this.data.remark
    }).then(res => {
      if(res.errno == '0') {
        wx.showToast({
          title: '开票成功',
          icon: 'success',
          duration: 1000
        })
        this.goBack()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
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
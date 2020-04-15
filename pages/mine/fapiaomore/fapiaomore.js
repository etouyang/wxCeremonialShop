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
    remark: '',
    bank_name: '',
    bank_account: '',
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    console.log(options);
    let payload = options.payload
    if(payload) {
      payload = JSON.parse(payload)
      this.setData({
        remark: payload.remark,
        bank_name: payload.bank_name,
        bank_account: payload.bank_account
      })
    }
  },
  getRemark(e) {
    let remark = e.detail.value
    this.setData({remark})
  },
  getName(e) {
    let bank_name = e.detail.value
    this.setData({bank_name})
  },
  getAccount(e) {
    let bank_account = e.detail.value
    this.setData({bank_account})
  },
  submitDetail() {
    if(this.data.bank_name !== '' && this.data.bank_account == '') {
      wx.showToast({
        title: '请输入开户行行号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(this.data.bank_name == '' && this.data.bank_account !== '') {
      wx.showToast({
        title: '请输入开户行信息',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1];   //当前页面
    let prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      remark: this.data.remark,
      bank_name: this.data.bank_name,
      bank_account: this.data.bank_account
    })
    this.goBack()
  },
  goBack() {
    wx.navigateBack()
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
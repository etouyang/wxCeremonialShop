import store from '../../../../store/index';
import create from '../../../../utils/create';
import {
  addressRequest
} from '../../../../service/request';
import {shareWX, shareTitle,checkMobile} from '../../../../service/helper'
const App = getApp()
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    currentItem: '0',
    region: ['', '', ''],
    customItem: '全部',
    uname: '',
    phone: '',
    isdefault: 0,
    detail: '',
    address: undefined,
    num: 0,
    tag: [{name: '家', id: '0'}, {name: '学校', id: '1'}, {name: '公司', id: '2'}],
    selectTag: '0',
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    width: App.globalData.screenWidth
  },
  onLoad(options) {
    console.log(options);
    shareWX()
    if (options.payload) {
      let addr = options.payload;
      let address = JSON.parse(addr)
      let region = address.area_str
      if (typeof address.area_str === 'string') {
        region = JSON.parse(address.area_str)
      }
      this.setData({
        address,
        region,
        num: address.detail.length,
        ...address,
      })
    }
  },
  goBack() {
    wx.navigateBack()
  },
  rightFuc() {
    if(this.data.address) {
      addressRequest({op: '3', adid: this.data.address.adid})
      .then(res => {
        if (res.errno == 0) {
          this.goBack()
          wx.showToast({
            title: '地址删除成功',
            icon: 'success',
            duration: 1000
        })
        }
      })
    }
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  switchChange(e) {
    let current = parseInt(this.data.isdefault)
    current = Boolean(current)
    this.setData({
      isdefault: current ? '0' : '1'
    })
  },
  bindNameInput(e) {
    this.setData({
      uname: e.detail.value
    })
  },
  bindPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindDetailInput(e) {
    if(e.detail.value.length > 60) return
    this.setData({
      detail: e.detail.value,
      num: e.detail.value.length
    })
  },
  tagSelect(e) {
    let item = e.target.dataset.item;
    this.setData({
      selectTag: item.id
    })
  },
  upload() {
    //0地址列表 1新增 2更新 3删除 4设为默认
    const {uname, phone, isdefault, region, detail} = this.data
    const addrinfo = {uname, phone, isdefault, area_str: region, detail }
    let op = '1', adid = ''
    if(this.data.address) {
      op = '2'
      adid = this.data.address.adid
    }
    if(!uname){
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if(!checkMobile(phone)){
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(!detail){
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    addressRequest({op, adid, addrinfo: JSON.stringify(addrinfo)})
    .then(res => {
      if (res.errno == 0) {
        this.goBack()
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})
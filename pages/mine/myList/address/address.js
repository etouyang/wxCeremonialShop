import store from '../../../../store/index';
import create from '../../../../utils/create';
import addressStore from '../../../../store/address.store';
import {
  addressRequest
} from '../../../../service/request';
import {shareWX, shareTitle,isLoginNotNavigate} from '../../../../service/helper'
const App = getApp()
create(store, {
  data: {
    addressList: addressStore.data,
    showNone: false,
    type: '',
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad(options) {
    let type = options.payload || '';
    this.setData({type})
    shareWX()
  },
  onShow: function() {
    this.store.data.addressList = {addrlist: []}
    this.update()
    //0地址列表 1新增 2更新 3删除 4设为默认
    this.addressRequest('0')
  },
  goBack() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  tagChoose(e) {
    var id = e.currentTarget.dataset.id;
    let select = this.data.addressList.addrlist.filter(add => add.adid == id)[0]
    if (this.data.type == '4') {//刷新后返回
      this.addressRequest('4', select.adid)
      this.goBack()
    }
  },
  changeDefault(e) {
    var adid = e.currentTarget.dataset.bindex;
    this.addressRequest('4', adid)
  },
  addNewAddress(){
    if(!isLoginNotNavigate()){
      wx.showModal({
        title: '温馨提示',
        content: '您还没有登录,是否立即前往?',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({url:'/pages/login/login'})
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
        return;
    }
    wx.navigateTo({
      url: '../addAddress/addAddress'
    })
  },
  editAddress(e) {
    var id = e.currentTarget.dataset.bindex;
    console.log(this.data.addressList.addrlist);
    let select = this.data.addressList.addrlist.filter(add => add.adid == id)[0]
    wx.navigateTo({
      url: '../addAddress/addAddress?payload='+JSON.stringify(select)
    })
  },
  delAddress(e) {
    var adid = e.currentTarget.dataset.bindex;
    this.addressRequest('3', adid)
  },
  addressRequest(type, adid) {
    //0地址列表 1新增 2更新 3删除 4设为默认
    addressRequest({op: type, adid})
      .then(res => {
        if (res.errno == 0) {
          if(res.addrlist) {
            this.store.data.addressList.addrlist = res.addrlist
            this.update();
          } else {
            this.store.data.addressList = {addrlist: []}
            this.update()
            this.addressRequest('0')
          }
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
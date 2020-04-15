import store from '../../../../store/index';
import create from '../../../../utils/create';
import accountdetailsStore from '../../../../store/accountdetails.store';
import {shareWX, shareTitle} from '../../../../service/helper'
const App = getApp()
create(store, {
  data: {
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function () {
    shareWX()
  },
  goBack() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  }
})
import store from '../../store/index';
import create from '../../utils/create';
import { 
  cityRequest
} from '../../service/request'
import {baseUrl} from '../../service/http'
import newtime from '../../utils/util'
import {shareWX, shareTitle} from '../../service/helper'
const App = getApp()
create(store, {
  data: {
    city: undefined,
    list:[],
    keyword: '',
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    console.log(options);
    let city = options.payload
    city = JSON.parse(city)
    this.setData({city})
    this.getCity()
  },
  keyworldInput(e) {
    let input = e.detail.value
    if (input.length) {
      this.setData({
        keyword: input,
      })
      this.getCity()
    }
  },
  getCity() {
    cityRequest({province: this.data.city.province, city: this.data.city.city, keyword: this.data.keyword}).then(res => {
      if (res.errno == '0') {
        let items = [];
        let list = Object.keys(res.list)
        list.forEach(title => { //广东省
          let second = res.list[`${title}`]
          let listSecond = Object.keys(second)
          listSecond.forEach(ti => {//市
            let third = second[`${ti}`]
            let listThird = Object.keys(third)
            listThird.forEach(t => { //区
              let result = third[`${t}`]
              items.push(...result)
            })
          })
        })
        this.setData({
          list: items,
        });
      }
    })
  },
  changeArea(e) {
    console.log(e)
    App.globalData.area = e.currentTarget.dataset.item
    wx.switchTab({url:'/pages/home/home'})
  },
  clearInput() {
    this.setData({keyword: '', list: []})
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
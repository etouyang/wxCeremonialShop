import store from '../../store/index';
import create from '../../utils/create';
import { 
  greenListRequest
} from '../../service/request'
import {baseUrl} from '../../service/http'
import {shareWX, shareTitle} from '../../service/helper'
const App = getApp()
create(store, {
  data: {
    list:[],
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    console.log(options);
    greenListRequest({page: 1,cardId: 1}).then(res => {
      if(res.errno == '0') {
        if (res.list.length) {
          res.list = res.list.map(shop => {
            if(shop.goods.length) {
              shop.goods = shop.goods.map(good => {
                if (good.imgs.length) {
                  good.imgs = good.imgs[0].indexOf('http') === -1 ? (baseUrl.production+good.imgs[0]) : good.imgs[0]
                }
                return good
              })
            }
            return shop
          })
        }
        this.setData({
          list: res.list
        })
      }
    })
  },
  moreGreen(e) {
    let item = e.currentTarget.dataset.item
    const payload = { from: "home", keyword: "", tag: 5, page: 1, type: 1, areaid: this.data.area ? this.data.area.id : '', isdel:1}
    this.store.data.search = {}
    this.update()
    wx.navigateTo({
        url:'/pages/search/search?payload=' + JSON.stringify(payload)
    })
  },
  goDetail(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    const payload = {"id":item.pid}
    wx.navigateTo({
      url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
    })
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
0: {categoryid: "5", categoryname: "苹果维修",…}
1: {categoryid: "6", categoryname: "家居软装", goods: [{pid: "2194", name: "多乐士抗裂无添加全效墙面漆5L内墙乳胶漆哑光白涂料",…},…]}
2: {categoryid: "31", categoryname: "地暖清洗",…}
3: {categoryid: "45", categoryname: "有机食品",…}
4: {categoryid: "48", categoryname: "空调清洗",…}


categoryid: "5"
categoryname: "苹果维修"
goods: [{pid: "2128", name: "iPhone手机原厂电池预约更换",…}, {pid: "2129", name: "iPhone手机原厂电池到家更换",…}]
0: {pid: "2128", name: "iPhone手机原厂电池预约更换",…}
brand_id: "139"
brandname: "信服"
disprice: "1152"
imgs: ["/upload/2019060317240572087829.jpeg", "/upload/2019060317240631055650.jpeg",…]
market_price: "35900"
name: "iPhone手机原厂电池预约更换"
pid: "2128"
price: "28800"
sales: "101"
shopid: "193"
shopname: "信服IT数码维修店"
sku: "购买后由信服-Apple官方授权服务中心为您提供服务！"
stock: "989"
1: {pid: "2129", name: "iPhone手机原厂电池到家更换",…}
*/
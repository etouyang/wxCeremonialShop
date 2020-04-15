import store from '../../store/index'
import create from '../../utils/create'
import homeStore from '../../store/home.store'
import { 
  bannerImgUrlAppend,
  categoriesList,
  tuanCouponImgUrlAppend,
  goodsImgUrlAppend,
  couponprodctsAppend,
  shareWX,
  shareTitle
} from "../../service/helper"
import { 
  homeRequest,
  couponRequest,
  secondRequest,
  bannerRequest,
} from '../../service/request'
import {baseUrl} from '../../service/http'

const app = getApp()
create(store, {
    data: {
      home: homeStore.data,
      bannerTop: [],
      bannerMid: [],
      bannerBottom: [],
      area: {},
      showSelect: false,
      selectArray: [],
      page: "1",
      pages: "1",
      timerSecond: '', //秒杀定时器
      timeShowSecond: '',//几点场
      timeDesSecond: '',//时间
      timerTuan: '', //团购定时器
      timeShowTuan: '',//几点场
      timeDesTuan: '',//时间
      capsuleTop: app.globalData.capsuleTop,
      capsuleHeight: app.globalData.capsuleHeight,
      screenWidth: app.globalData.screenWidth,
      homeBg: '/images/shopping/bg1.png'
    },
    onLoad: function () {
      shareWX()
      app.userInfoReadyCallback = res => {
        console.log('userInfoReadyCallback: ', res);
        console.log('获取用户信息成功,是否刷新页面');
      };
      this.homeRequest()
      setTimeout(() => {
        this.getLocation()
      }, 2000);
      if(baseUrl.code == 'wx92efb00683b9e4de') {
        this.setData({homeBg: '/images/shopping/home-bg.png'})
      }
    },
    getLocation() {
      let _this = this
      wx.getLocation({
        success: function(e) {
          let location = {"latitude": e.latitude,"longitude": e.longitude}
          wx.setStorageSync("location", JSON.stringify(location))
          _this.homeRequest()
        },
        fail: function(e) {
          _this.systemLocation()
        }
      })
    },
    systemLocation() {
      wx.getSetting({
        success: function(res) {
          let status = res.authSetting;
          if (!status['scope.userLocation']) {
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则推荐商品将无法展示',
              success: function (tip) {
                if (tip.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data.authSetting["scope.userLocation"] === true) {
                        wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                        })
                        wx.getLocation({
                          success: function(total) {
                            let location = {"latitude": total.latitude,"longitude": total.longitude}
                            wx.setStorageSync("location", JSON.stringify(location))
                            _this.homeRequest()
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '调用授权窗口失败',
            icon: 'success',
            duration: 1000
        })
        }
      })
    },
    onPullDownRefresh: function () {
      this.homeRequest()
    },
    bannerImgHandle(res) {
      let banners = bannerImgUrlAppend(res.data)
      if (typeof banners != 'object') return []
      banners.map(item => {
        if (item.url == '') {
          item.url = ''
          return item
        } else {
          let sp = item.url.split("?")
          if(sp.length >= 2) {
            let get = sp[1].split("&")[0]
            let space = get.split("=")
            if(space[0] == 'prid') {
              const payload = {"id": space[1]}
              item.url = '/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
            } else {
              const payload = {"shopid": space[1]}
              item.url = '/pages/shopStore/shopStore?payload=' + JSON.stringify(payload)
            }
          } else {
            item.url = ''
          return item
          }
        }
        return item
      })
      return banners
    },
    homeRequest() {
      //首页热销
      homeRequest({areaid: this.data.area ? this.data.area.id : '', tag: 1})
      .then(res => {
        wx.stopPullDownRefresh();
        if (res.errno == 0) {
          this.store.data.home.categories = categoriesList(res.categories)
          this.store.data.home.couponprodcts = couponprodctsAppend(res.couponprodcts)
          this.store.data.home.hotGoods = goodsImgUrlAppend(res.products)
          if (res.products instanceof Array) {
            this.store.data.home.hotLeftGoods = goodsImgUrlAppend(res.products).filter((item, index) => index%2 == 0)
            this.store.data.home.hotRightGoods = goodsImgUrlAppend(res.products).filter((item, index) => index%2 == 1)
          } else {
            this.store.data.home.hotLeftGoods = []
            this.store.data.home.hotRightGoods = []
          }
          this.setData({
            area: {
              area: res.areaName,
              id:res.areaid
            }
          })
          this.update()
        }
      })
      //首页banner
      bannerRequest({type: '0'})
        .then(res => {
          if (res.errno == 0) {
            let bannerTop = this.bannerImgHandle(res)
            this.setData({bannerTop})
          }
        })

      //首页推荐
      homeRequest({areaid: this.data.area ? this.data.area.id : '', tag: 5})
      .then(res => {
        if (res.errno == 0) {
          this.store.data.home.loveGoods = goodsImgUrlAppend(res.products)
          if (res.products instanceof Array) {
            this.store.data.home.loveLeftGoods = goodsImgUrlAppend(res.products).filter((item, index) => index%2 == 0)
            this.store.data.home.loveRightGoods = goodsImgUrlAppend(res.products).filter((item, index) => index%2 == 1)
          } else {
            this.store.data.home.loveLeftGoods = []
            this.store.data.home.loveRightGoods = []
          }
          this.update()
          bannerRequest({type: '1'})
            .then(res => {
              if (res.errno == 0) {
                let bannerMid = this.bannerImgHandle(res)
                this.setData({bannerMid})
              }
            })
          bannerRequest({type: '2'})
            .then(res => {
              if (res.errno == 0) {
                let bannerBottom = this.bannerImgHandle(res)
                this.setData({bannerBottom})
              }
            })
          //团购
          couponRequest({page: '1', type: '4', urid: '1', areaid: this.data.area ? this.data.area.id : ''})
          .then(res => {
            if (res.errno == 0) {
              this.store.data.home.tuanCouponList = tuanCouponImgUrlAppend(res.products, 3)
              this.update()
              if(res.timeArr.length && res.products.length) {
                let _this = this
                let end_time = (new Date(this.store.data.home.tuanCouponList[0].end_time)).getTime()
                this.setData({
                  timeShowTuan: res.timeArr[0],
                  timerTuan: setInterval(() => {
                    let current_time = (new Date()).getTime()
                    let time = (end_time - current_time) / 1000;
                    if(time < 0) {
                      clearInterval(_this.data.timerTuan);
                      _this.setData({
                        timeDesTuan: '00:00:00'
                      })
                      return
                    }
                    let day = parseInt(time / (60 * 60 * 24));
                    let hou = parseInt(time % (60 * 60 * 24) / 3600) + '';
                    if (hou.length == 1) hou = '0'+ hou
                    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60) + '';
                    if (min.length == 1) min = '0'+ min
                    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60) + '';
                    if (sec.length == 1) sec = '0'+ sec
                      _this.setData({
                        timeDesTuan: hou + ':' + min + ':' + sec
                      })
                  }, 1000)
                })
              }
            }
          })
          //秒杀
          secondRequest({page: '1', type: '9', urid: '1', areaid: this.data.area ? this.data.area.id : ''})
          .then(res => {
            if (res.errno == 0) {
              this.store.data.home.miaoCouponList = tuanCouponImgUrlAppend(res.products, 3)
              this.update()
              if(res.timeArr.length && res.products.length) {
                let _this = this
                let end_time = (new Date(this.store.data.home.miaoCouponList[0].end_time)).getTime()
                this.setData({
                  timeShowSecond: res.timeArr[0],
                  timerSecond: setInterval(() => {
                    let current_time = (new Date()).getTime()
                    let time = (end_time - current_time) / 1000;
                    if(time < 0) {
                      clearInterval(_this.data.timerSecond);
                      _this.setData({
                        timeDesSecond: '00:00:00'
                      })
                      return
                    }
                    let day = parseInt(time / (60 * 60 * 24));
                    let hou = parseInt(time % (60 * 60 * 24) / 3600) + '';
                    if (hou.length == 1) hou = '0'+ hou
                    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60) + '';
                    if (min.length == 1) min = '0'+ min
                    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60) + '';
                    if (sec.length == 1) sec = '0'+ sec
                      _this.setData({
                        timeDesSecond: hou + ':' + min + ':' + sec
                      })
                  }, 1000)
                })
              }
            }
          })
        }
      })
    },
    onChange(e) {
      console.log(e)
      this.setData({
        value: e.detail
      });
    },
    onclick() {
      const payload = {"cid": "", "from": "home", "keyword": "", "shopid": ""}
      this.store.data.search = {}
      this.update()
      wx.navigateTo({
        url:'/pages/search/search?payload=' + JSON.stringify(payload)
      })
    },
    moreSecondFuc() {
      wx.navigateTo({url:'/pages/second/second'})
    },
    moreGroupFuc() {
      wx.navigateTo({url:'/pages/group/group'})
    },
    moreHotFuc() { //热销
      // const payload = { from: "home", keyword: "", tag: 1, page: 1, type: 1, areaid: this.data.area ? this.data.area.id : '', isdel:1}
      // this.store.data.search = {}
      // this.update()
      // wx.navigateTo({
      //   url:'/pages/search/search?payload=' + JSON.stringify(payload)
      // })
      wx.navigateTo({
        url: '/pages/hotGoods/hotGoods'
      })
    },
    moreLoveFuc() {//推荐
      const payload = { from: "home", keyword: "", tag: 5, page: 1, type: 1, areaid: this.data.area ? this.data.area.id : '', isdel:1}
      this.store.data.search = {}
      this.update()
      wx.navigateTo({
        url:'/pages/search/search?payload=' + JSON.stringify(payload)
      })
    },
    onJumpSecond(event) { //跳转秒杀
      let index = event.currentTarget.dataset.bindex
      let item = this.store.data.home.miaoCouponList[index]
      const payload = {"gid": item.pid}
      wx.navigateTo({
        url:'/pages/secondDetail/secondDetail?payload=' + JSON.stringify(payload)
      })
    },
    onJumpGroup(event) { //跳转拼团
      let index = event.currentTarget.dataset.bindex
      let item = this.store.data.home.tuanCouponList[index]
      const payload = {"gid": item.pid}
      wx.navigateTo({
        url:'/pages/groupDetail/groupDetail?payload=' + JSON.stringify(payload)
      })
    },
    onJumpHotDetail(event) { //跳转热销
      const payload = {"id": event.detail.item.id}
      wx.navigateTo({
        url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
      })
    },
    onJumpLoveDetail(event) { //跳转推荐
      const payload = {"id": event.detail.item.id}
      wx.navigateTo({
        url:'/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
      })
    },
    showAddressFlag() {
      wx.navigateTo({url: '/pages/location/location'})
    },
    getSelectAddress(event) {
      let addressIdx = event.detail.idx
      let select = this.data.selectArray[addressIdx];
      this.setData({
        showSelect: false,
        area: select,
        page: '1',
        pages: '1'
      })
      this.homeRequest()
      wx.setStorageSync("area", JSON.stringify(select))
    },
    onShow: function () {
      if (app.globalData.area) {
        this.setData({
          area: app.globalData.area,
          page: '1',
          pages: '1'
        })
        this.homeRequest()
        wx.setStorageSync("area", JSON.stringify(app.globalData.area))
      }
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

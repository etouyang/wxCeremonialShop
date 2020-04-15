import store from '../../store/index';
import create from '../../utils/create';
import { 
  cityRequest
} from '../../service/request'
import {shareWX, shareTitle, pingYin, locationAPI} from '../../service/helper'
const App = getApp()
var QQMapWX = require('../../wx-sdk/qqmap-wx-jssdk.js');
var qqmapsdk;
create(store, {
  data: {
    city: [],
    citySelected: '上海市',
    citySelectedItem: undefined,
    cityData: {},
    hotCityData: [{"fullname": "上海市"}],
    showPy: '#',
    hidden: true,
    _py: ["hot", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
  },
  onLoad: function(options) {
    shareWX()
    qqmapsdk = new QQMapWX({
      key: locationAPI()
    });
    console.log(options);
    cityRequest({}).then(res => {
      if (res.errno == '0') {
        let city = [];
        let list = Object.keys(res.list)
        list.forEach(title => {
          if(title.indexOf('市') !== -1) {
            city.push({title, province: title, city: Object.keys(res.list[`${title}`])[0]})
          } else {
            let second = res.list[`${title}`]
            let listSecond = Object.keys(second)
            listSecond.forEach(ti => {
              if(ti.indexOf('市') !== -1) {
                city.push({title: ti, province: title, city: ti})
              } 
            })
          }
        })
        let hot = city.filter(obj => obj.title == '上海市')
        city.sort((a, b)=> a.title.localeCompare(b.title, 'zh'))
        let objCity = {}
        city.forEach(obj => {
          let a_Z = pingYin(obj.title)
          if(Object.keys(objCity).filter(key => key == a_Z).length > 0) {
            objCity[`${a_Z}`].push({...obj, "fullname": obj.title})
          } else {
            objCity[`${a_Z}`] = [{...obj, "fullname": obj.title}]
          }
        })
        console.log(city);
        console.log(objCity);
        this.setData({
          city,
          cityData: objCity,
          hotCityData: hot.length > 0 ? [hot[0]] : [city[0]]
        });
        this.getLocation()
      }
    })
  },
  //选择城市
  selectCity: function(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
        citySelected: item.title,
        citySelectedItem: item
    });
    this.onclick()
  },
  touchstart: function(e) {
    this.setData({
        index: e.currentTarget.dataset.index,
        Mstart: e.changedTouches[0].pageX
    });
  },
  touchmove: function(e) {
    var history = this.data.historyList;
    var move = this.data.Mstart - e.changedTouches[0].pageX;
    history[this.data.index].x = move > 0 ? -move : 0;
    this.setData({
        historyList: history
    });
  },
  touchend: function(e) {
    var history = this.data.historyList;
    var move = this.data.Mstart - e.changedTouches[0].pageX;
    history[this.data.index].x = move > 100 ? -180 : 0;
    this.setData({
        historyList: history
    });
  },
  //获取文字信息
  getPy: function(e) {
    this.setData({
        hidden: false,
        showPy: e.target.id,
    })
  },

  setPy: function(e) {
    this.setData({
        hidden: true,
        scrollTopId: this.data.showPy
    })
  },

  //滑动选择城市
  tMove: function(e) {
    var y = e.touches[0].clientY,
        offsettop = e.currentTarget.offsetTop;

    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
        var num = parseInt((y - offsettop) / 12);
        this.setData({
            showPy: this.data._py[num]
        })
    };
  },

  //触发全部开始选择
  tStart: function() {
    this.setData({
        hidden: false
    })
  },

  //触发结束选择
  tEnd: function() {
    this.setData({
        hidden: true,
        scrollTopId: this.data.showPy
    })
  },
  getLocation() {
    let _this = this
    wx.getLocation({
      success: function(e) {
        let location = {"latitude": e.latitude,"longitude": e.longitude}
        wx.setStorageSync("location", JSON.stringify(location))
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: e.latitude,
            longitude: e.longitude
          },
          success: function (res) {
            console.log(JSON.stringify(res));
            let province = res.result.ad_info.province
            let city = res.result.ad_info.city
            let citySelectedItem = {};
            let select = _this.data.city.filter(obj => obj.title == city)
            if (select.length) {
              citySelectedItem = select[0]
            }
            _this.setData({
              citySelected: city,
              citySelectedItem,
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        })
      },
      fail: function(e) {
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
                              qqmapsdk.reverseGeocoder({
                                location: {
                                  latitude: e.latitude,
                                  longitude: e.longitude
                                },
                                success: function (res) {
                                  console.log(JSON.stringify(res));
                                  let province = res.result.ad_info.province
                                  let city = res.result.ad_info.city
                                  let citySelectedItem = {}
                                  let select = _this.data.city.filter(obj => obj.title == city)
                                  if (select.length) {
                                    citySelectedItem = select[0]
                                  }
                                  _this.setData({
                                    citySelected: city,
                                    citySelectedItem
                                  });
                                },
                                fail: function (res) {
                                  console.log(res);
                                },
                                complete: function (res) {
                                  // console.log(res);
                                }
                              })
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
      }
    })
  },

  onclick() {
    if (!this.data.citySelectedItem || Object.keys(this.data.citySelectedItem).length == 0) {
      wx.showToast({
        title: '当前地址未开通服务',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({url:'/pages/locationDetail/locationDetail?payload=' + JSON.stringify(this.data.citySelectedItem)})
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
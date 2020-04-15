import store from '../../store/index';
import create from '../../utils/create';
import mineStore from '../../store/mine.store';
import { loginRequest, loginEncryRequest, loginUserInfoRequest, bannerRequest, greenRequest } from '../../service/request'
import {shareWX, shareTitle, bannerImgUrlAppend} from "../../service/helper"
const app = getApp()
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    hasUserInfo: false,
    wxUserInfo: app.globalData.wxUserInfo,
    haswxUserInfo: false,
    registerUserInfo: app.globalData.registerUserInfo,
    hasRegisterUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mine: mineStore.data,
    banner:[],
    mineAd: [],
    propertyTitle1: '我的',
    propertyTitle2: '',
    propertyArray: [{
      image: '/images/mine/cardpay.png',
      text: '卡券'
    },
    // {
    //   image: '/images/mine/redpay.png',
    //   text: '红包'
    // },
    // {
    //   image: '/images/mine/chongzhi.png',
    //   text: '充值'
    // },
    // {
    //   image: '/images/mine/detail.png',
    //   text: '明细'
    // },
    {
      image: '/images/mine/icon-my-address.png',
      text: '常用地址'
    }
    ],
    orderTitle1: '我的订单',
    orderTitle2: '查看全部',
    orderArray: [{
      image: '/images/mine/topay.png',
      text: '待付款'
    },
    {
      image: '/images/mine/fahuo.png',
      text: '待发货'
    },
    {
      image: '/images/mine/shouhuo.png',
      text: '待收货'
    },
    {
      image: '/images/mine/pj.png',
      text: '待评价'
    },
    // {
    //   image: '/images/mine/shouhou.png',
    //   text: '退款/售后'
    // }
    ],
    listArray: [
      // {
      //   text: '推客'
      // },
      // {
      //   text: '外卖订单'
      // },
      // {
      //   text: '常用地址'
      // },
      {
        text: '消息'
      },
      {
        text: '问题和建议'
      }
    ]
  },
  goUrl(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    if (id == 1) {
      // wx.showModal({
      //   title: '提示',
      //   content: '没有老页面或者UI设计稿参考',
      //   success(res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
    } else {
      wx.navigateTo({
        url: './order/order?type=1'
      })
    };
  },

  openUrl(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    if (id == 1) {
      wx.navigateTo({
        url: './set/set'
      })
    } else {
      wx.navigateTo({
        url: './myList/news/news'
      })
    };
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  goProperty(e) {
    var id = e.currentTarget.dataset.id;
    switch (id) {
      case 1:
        wx.navigateTo({
          url: './myAssets/coupon/coupon'
        })
        break;
      case 2:
        wx.navigateTo({
          url: './myList/address/address'
          // url: './myAssets/accountdetails/accountdetails'
        })
        break;
      case 3:
        wx.navigateTo({
          url: './myAssets/recharge/recharge'
        })
        break;
      case 4:
        wx.navigateTo({
          url: './myAssets/accountdetails/accountdetails'
        })
        break;
      case 5:
        wx.navigateTo({
          url: './order/order?type=2'
        })
        break;
      case 6:
        wx.navigateTo({
          url: './order/order?type=5'
        })
        break;
      case 7:
        wx.navigateTo({
          url: './order/order?type=6'
        })
        break;
      case 8:
        wx.navigateTo({
          url: './order/order?type=3'
        })
        break;
      case 9:
        wx.navigateTo({
          url: './order/order?type=4'
        })
        break;
      case 10:
        wx.navigateTo({
          url: './myList/twitter/twitter'
        })
        break;
      case 11:
        wx.navigateTo({
          url: './myList/takeout/takeout'
        })
        break;
      case 12:
        wx.navigateTo({
          url: './myList/address/address'
        })
        break;
      case 13:
        wx.navigateTo({
          url:'/pages/message/message'
        })
        break;
      case 14:
        wx.navigateTo({
          url: './myList/problem/problem'
        })
        break;

    }
  },
  bannerImgHandle(res) {
    let banners = bannerImgUrlAppend(res.data)
    if (typeof banners != 'object') return []
    banners.map(item => {
      let sp = item.url.split("?")
      if(sp.length) {
        let get = sp[1].split("&")[0]
        let space = get.split("=")
        if(space[0] == 'prid') {
          const payload = {"id": space[1]}
          item.url = '/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
        } else {
          const payload = {"shopid": space[1]}
          item.url = '/pages/shopStore/shopStore?payload=' + JSON.stringify(payload)
          // wx.navigateTo({url:'/pages/shopStore/shopStore?payload=' + JSON.stringify(payload)})
        }
      }
      return item
    })
    return banners
  },
  onLoad: function () {
    shareWX()
    greenRequest()
    .then(resGreen => {
      if(resGreen.errno == '0') {
        this.store.data.green = resGreen.data
        this.update()
      }
    })
    bannerRequest({type: '3'})
    .then(res => {
      if (res.errno == 0) {
        let mineAd = this.bannerImgHandle(res)
        this.setData({mineAd})
      }
    })
  },
  onPullDownRefresh: function () {
    bannerRequest({type: '3'})
    .then(res => {
      wx.stopPullDownRefresh();
      if (res.errno == 0) {
        let mineAd = this.bannerImgHandle(res)
        this.setData({mineAd})
      }
})
  },
  onShow: function () {
    let _this = this;
    if (app.globalData.wxUserInfo) {
      this.setData({
        wxUserInfo: app.globalData.wxUserInfo,
        haswxUserInfo: true
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    if (app.globalData.registerUserInfo) {
      this.setData({
        registerUserInfo: app.globalData.registerUserInfo,
        hasRegisterUserInfo: true
      })
    }
    store.onChange = function(diffResult){
      //根据diffResult里的内容判断。里面有path的
      console.log(diffResult)
      if(diffResult.registerUserInfo) {
        _this.setData({
          registerUserInfo: diffResult.registerUserInfo,
          hasRegisterUserInfo: true
        })
      }
    }
  },
  getUserInfo: function(e) { //获取用户微信信息
    if (e.detail.errMsg !== "getUserInfo:fail auth deny") {
      wx.login({
        success: loginRes => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          app.globalData.jsCode = loginRes.code

          wx.getUserInfo({ //获取用户头像成功
            success: userRes => {
              app.globalData.wxUserInfo = userRes.userInfo
              app.globalData.encryptedData = userRes.encryptedData
              app.globalData.iv = userRes.iv
              app.globalData.signature = userRes.signature
              
              loginRequest(app.globalData.jsCode).then(backRes => {
                console.log(backRes)
                if (backRes.data.userInfo == '') { //后台返回用户未注册过
                  app.globalData.jsToken = backRes.data.token
                  this.setData({
                    wxUserInfo: e.detail.userInfo,
                    haswxUserInfo: true,
                    showDialog: true,
                  })
                } else if (backRes.data.userInfo.phone == '') { //TODO: 后台出错这里怎么处理...
                  app.globalData.jsToken = backRes.data.userInfo.userStr
                  this.setData({
                    wxUserInfo: e.detail.userInfo,
                    haswxUserInfo: true,
                    showDialog: true,
                  })
                } else { //已登录, 获取用户信息
                  app.globalData.userInfo = backRes.data.userInfo
                  app.globalData.registerUserInfo = backRes.data.userInfo
                  wx.setStorageSync("user", JSON.stringify(backRes.data.userInfo))
                  this.update()
                  this.setData({
                    wxUserInfo: e.detail.userInfo,
                    haswxUserInfo: true,
                    userInfo: backRes.data.userInfo,
                    hasUserInfo: true,
                    registerUserInfo: backRes.data.userInfo,
                    hasRegisterUserInfo: true
                  })
                }
              })
            }
          })

        },
        fail: failRes => {
          wx.showModal({
            title: '授权微信登陆失败',
            content: '',
            confirmColor: '#118EDE',
            showCancel: false,
            success: function (res) {
            }
          })
        }

      })
      
    } else {
      wx.showModal({
        title: '授权微信失败',
        content: e.detail.errMsg,
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
        }
      })
    }
  },
  getPhoneNumber: function (e) { //授权获取手机号
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      this.setData({
        showDialog: false,
      })
      loginEncryRequest({
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        token: app.globalData.jsToken,
      })
        .then(resp => {
          if (resp.errno == '0') {
            app.globalData.userInfo = resp.data.userInfo
            this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
            })
            //登录
            loginUserInfoRequest({
              iv: app.globalData.iv,
              encryptedData: app.globalData.encryptedData,
              token: app.globalData.jsToken,
            })
              .then(response => {
                console.log(response)
                if (response.errno == 0) {
                  resp.data.userInfo.nickName = app.globalData.wxUserInfo.nickName;
                  resp.data.userInfo.uimg = app.globalData.wxUserInfo.avatarUrl;
                  app.globalData.registerUserInfo = resp.data.userInfo
                  wx.setStorageSync("user", JSON.stringify(resp.data.userInfo))
                  this.update()
                  this.setData({
                    registerUserInfo: resp.data.userInfo,
                    hasRegisterUserInfo: true
                  })
                }
              })
          } else {
            wx.showModal({
              title: '后台解密用户信息失败',
              content: resp.msg,
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
              }
            })
          }
        })
        .catch (e => {
          wx.showModal({
            title: '解密用户信息失败',
            content: e,
            confirmColor: '#118EDE',
            showCancel: false,
            success: function (res) {
            }
          })
        })
    } else {
      wx.showModal({
        title: '授权手机号失败',
        content: e.detail.errMsg,
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
        }
      })
    }
  },
  login() {
    if (!this.data.hasRegisterUserInfo) {
      wx.navigateTo({url:'/pages/login/login'})
    }
  },
  goSession() {
    wx.navigateTo({url:'/pages/season/season'})
  },
  cancle() {
    this.setData({
      showDialog: false,
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
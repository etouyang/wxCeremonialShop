import store from '../../store/index';
import create from '../../utils/create';
import { loginRequest, loginEncryRequest, loginUserInfoRequest } from '../../service/request'
import {shareWX, shareTitle} from "../../service/helper"
import {baseUrl} from '../../service/http'
const app = getApp()
create(store, {
  data: {
    normalNav: app.globalData.normalNav,
    showDialog: false,
    logo: "",
  },
  onLoad: function (options) {
    shareWX()
    let logo = ''
    if(baseUrl.code === 'wx5834a482ddffba8f') {
      logo = '../../images/common/logo_ls.png'
    } else if (baseUrl.code === 'wx914cb9e5e25cc078') {
      logo = '../../images/common/logo_lc.jpeg'
    } else if (baseUrl.code === 'wx800b340f8dff13bc') {
      logo = '../../images/common/logo_lsg.png'
    } else if (baseUrl.code === 'wx15b6b73eac94079b') {
      logo = '../../images/common/logo_yb.jpeg'
    } else if (baseUrl.code === 'wx92efb00683b9e4de') {
      logo = '../../images/common/logo_xm.jpeg'
    }
    this.setData({logo})
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  phoneFuc() {
    wx.navigateTo({url:'/pages/loginCode/loginCode'})
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
                    showDialog: true,
                  })
                } else if (backRes.data.userInfo.phone == '') { //TODO: 后台出错这里怎么处理...
                  app.globalData.jsToken = backRes.data.userInfo.userStr
                  this.setData({
                    showDialog: true,
                  })
                } else { //已登录, 获取用户信息
                  app.globalData.userInfo = backRes.data.userInfo
                  app.globalData.registerUserInfo = backRes.data.userInfo
                  wx.setStorageSync("user", JSON.stringify(backRes.data.userInfo))
                  this.update();
                  this.leftFuc();
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
      console.log('用户授权拒绝=======>',e.detail.errMsg);
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
                  this.leftFuc()
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

import store from '../../store/index';
import create from '../../utils/create';
import {sendCodeRequest, loginPhoneRequest} from '../../service/request'
import {shareWX, shareTitle,checkMobile,checkSmsCode} from "../../service/helper"
import {baseUrl} from '../../service/http'
const App = getApp()
create(store, {
  data: {
    normalNav: App.globalData.normalNav,
    phone: '',
    code: '',
    timeStr: '获取验证码',
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
  phoneInput(e) {
    let input = e.detail.value
    if (input.length) {
      this.setData({
        phone: input,
      })
    }
  },
  codeInput(e) {
    let input = e.detail.value
    if (input.length) {
      this.setData({
        code: input,
      })
    }
  },
  getCode() {
    if (this.data.timeStr !== '获取验证码') return
    if(!this.data.phone){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!checkMobile(this.data.phone)){
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return
    }
    sendCodeRequest({phone: this.data.phone}).then(res => {
      if(res.errno == '0') {
        wx.showToast({
          title: '验证码已发送',
          icon: 'success',
          duration: 2000
        })
        this.timeSet()
      } else {
        wx.showModal({
          title: '提示',
          content: '获取验证码失败',
          confirmColor: '#118EDE',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    })
  },
  timeSet() {
    let _this = this
    let end_time = 60
    this.setData({
      timerSecond: setInterval(() => {
        if (end_time !== '获取验证码') {
          end_time = end_time -1
        }
        if (end_time <= 0 || end_time == '获取验证码') {
          end_time = '获取验证码'
          _this.setData({
            timeStr: end_time 
          })
        } else {
          _this.setData({
            timeStr: end_time + 's'
          })
        }
      }, 1000)
    })
  },
  login() {
    if(!this.data.phone){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!checkMobile(this.data.phone)){
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!this.data.code){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    if(!checkSmsCode(this.data.code)){
      wx.showToast({
        title: '验证码格式错误',
        icon: 'none',
        duration: 2000
      })
      return
    }

    loginPhoneRequest({
      phone: this.data.phone,
      code: this.data.code
    })
      .then(res => {
        if(res.errno == '0') {
          App.globalData.registerUserInfo = res.data.userInfo
          App.globalData.hasRegisterUserInfo = true
          wx.setStorageSync("user", JSON.stringify(res.data.userInfo))
          this.update()
          wx.switchTab({url:'/pages/mine/mine'})
        }else{
          wx.showToast({
            title: res.msg || "登录失败",
            icon: 'none',
            duration: 2000
          })
        }
      })
  },
  leftFuc() {
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

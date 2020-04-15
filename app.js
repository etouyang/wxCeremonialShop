//app.js
import {
  loginRequest, loginWXRequest
} from './service/request'
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        if (res.system.indexOf('iOS') !== -1) {
          this.globalData.navHeight = res.statusBarHeight + 44;
          this.globalData.capsuleTop = res.statusBarHeight + (this.globalData.titleBarIOSHeight - 32)/2;
        } else {
          this.globalData.navHeight = res.statusBarHeight + 48;
          this.globalData.capsuleTop = res.statusBarHeight + (this.globalData.titleBarAndroidHeight - 32)/2;
        }
        this.globalData.normalNav = this.globalData.navHeight + 30;
        this.globalData.screenWidth = res.screenWidth 
        this.globalData.screenHeight = res.screenHeight
        this.globalData.windowHeight = res.windowHeight
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 获取用户信息权限
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          wx.getUserInfo({
            success: res => {
              wx.login({
                success: loginRes => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  this.globalData.jsCode = loginRes.code

                  wx.getUserInfo({ //获取用户头像成功
                    success: userRes => {
                      this.globalData.wxUserInfo = userRes.userInfo
                      this.globalData.encryptedData = userRes.encryptedData
                      this.globalData.iv = userRes.iv
                      this.globalData.signature = userRes.signature
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回,所以此处加入 callback 以防止这种情况
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                      }
  
                      loginRequest(this.globalData.jsCode).then(backRes => {
                        console.log(backRes)
                        if (backRes.data.userInfo == '') { //后台返回用户未注册过
                          this.globalData.jsToken = backRes.data.token
                        } else if (backRes.data.userInfo && backRes.data.userInfo.phone == '') { //TODO: 后台出错这里不好处理...
                          this.globalData.jsToken = backRes.data.userInfo.userStr
                        } else { //已登录, 获取用户信息
                          this.globalData.userInfo = backRes.data.userInfo
                          this.globalData.registerUserInfo = backRes.data.userInfo
                            let user = wx.getStorageSync('user')
                            if (!user) {
                              let user = {
                                "islogin": backRes.data.userInfo.islogin,
                                "loginId": backRes.data.userInfo.loginId,
                                "nickName": backRes.data.userInfo.nickName,
                                "phone": backRes.data.userInfo.phone,
                                "uimg": backRes.data.userInfo.uimg,
                                "userId": backRes.data.userInfo.userId,
                                "userIdStr": backRes.data.userInfo.userIdStr,
                                "userStr": backRes.data.userInfo.userStr,
                                "time": backRes._t
                              }
                              wx.setStorageSync("user", JSON.stringify(user))
                            }
                            loginWXRequest({userId: backRes.data.userInfo ? backRes.data.userInfo.userId : '', type: 1})
                              .then(loginRes => {
                                console.log(loginRes)
                              })
                        }
                      })
                    }
                  })

                }
              })
            }
          })

        } else {
          let user = wx.getStorageSync('user')
          if (user) {
            let userLocation = JSON.parse(user)
            loginWXRequest({userId: userLocation.userId, type: 1})
              .then(loginRes => {
                console.log(loginRes)
              })
          }
        }
      },

    })

  },
  globalData: {
    wxUserInfo: null, //用户微信信息
    userInfo: null,   //用户小程序信息
    registerUserInfo: null,   //用户注册信息
    encryptedData: "",
    iv: "",
    signature: "",
    jsCode: "",
    jsToken: "",
    navHeight: 0,
    normalNav: 0,
    screenHeight: 0,
    screenWidth: 0,
    windowHeight: 0,
    capsuleTop: 0, //胶囊top
    capsuleHeight: 32, //胶囊高度
    titleBarIOSHeight: 44,
    titleBarAndroidHeight: 48,
    area: undefined, //小区信息
  }
})
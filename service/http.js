import API from './api'

let projectId = 2;

let params={
  "1":{
    production: 'https://appletapi.ant-step.com', // 蚁步
    code: 'wx15b6b73eac94079b'
  },
  "2":{
    production: 'https://polyfs.ant-step.com',// 保利佛山
    code: 'wx92efb00683b9e4de'
  },
  "3":{
    production: 'https://applet.greentown-sh.com', // 绿城
    code: 'wx914cb9e5e25cc078'
  },
  "4":{
    production: 'https://polyyd.ant-step.com', // 保利粤东
    code: 'wx800b340f8dff13bc'
  },
  "5":{
    production: 'https://appletapi.ant-step.com',// 绿升
    code: 'wx5834a482ddffba8f'
  }
}
export const baseUrl = params[projectId];
export default ( url = '', data = {}, type = 'GET', header ) => {
  const app = getApp()
  return new Promise((resolve, reject) => {
    //request config
    type = type.toUpperCase();
    let timestamp = Date.parse(new Date());
    data._t=timestamp;
    let wxlocation = wx.getStorageSync('location')
    let location = {}
    if (wxlocation) {
      location = JSON.parse(wxlocation)
    }
    let area = wx.getStorageSync('area')
    if(area && url !== API.homeApi.arealist && url !== API.commonApi.city) {
      area = JSON.parse(area)
      if (!data.areaid) {
        data.areaid = area.id || ''
      }
    }
    const App = getApp()
    data.latitude = location.latitude
    data.longitude = location.longitude
    data.urid = App.globalData.registerUserInfo ? App.globalData.registerUserInfo.userId : ''
    data.login_id = App.globalData.registerUserInfo ? App.globalData.registerUserInfo.loginId : ''
    data.loginId = App.globalData.registerUserInfo ? App.globalData.registerUserInfo.loginId : ''
    data.islogin = App.globalData.registerUserInfo ? App.globalData.registerUserInfo.islogin : ''
    const requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'force-cache',
    }

    if (type === 'GET') {
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += `${key}=${data[key]}&`
      })
      if (dataStr !== '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
        url = `${url}?${dataStr}`
      }
    }

    if (type === 'POST') {
      // Object.defineProperty(requestConfig, 'body', {
      //   value: JSON.stringify(data),
      // })
      Object.assign(requestConfig, data)
    }

    wx.showLoading({title: '加载中...'})
    wx.request({
      url: url.indexOf('http') === -1 ? (baseUrl.production+url) : url,
      data: requestConfig,
      header: header || {
        "Accept": 'application/json',
        "Content-Type": "application/xml"
      },
      method: type,
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          if (typeof res.data === 'string') {
            let d = res.data.replace(/[\r\n]/g,"").replace(/	/g,"")
            d = d.replace(/http:/g, "__HTTP__").replace(/https:/g, "__HTTPS__")
            d = d.replace(/imeituan:/g, "__IMEITUAN__")
            d = d.replace(/(?:\s*['"]*)?([a-zA-Z0-9_]+)(?:['"]*\s*)?:/g, '"$1":').replace(/\"/g, '\\"');
            d = d.replace(/__HTTP__/g, "http:").replace(/__HTTPS__/g, "https:")
            d = d.replace(/__IMEITUAN__/g, "imeituan:")
            let s = JSON.parse(`"${d}"`)
            console.log(JSON.parse(s))
            resolve(JSON.parse(s))
          }
          if(res.data.errno == 2) {
            app.globalData.wxUserInfo = undefined
            app.globalData.userInfo = undefined
            app.globalData.registerUserInfo = undefined
            wx.setStorageSync("user", '')
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
          res.data._t = timestamp;
          resolve(res.data)
        } else {
          wx.showToast({
            icon: "none",
            title: res.response
          })
          reject(res.data)
        }
      },
      fail: function(e) {
        wx.hideLoading();
        reject(e)
      }
    })
  })
}

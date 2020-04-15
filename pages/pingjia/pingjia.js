import store from '../../store/index';
import create from '../../utils/create';
import {
  pingjiaRequest
} from '../../service/request';
import {shareWX, shareTitle} from "../../service/helper"
import API from '../../service/api'
import {baseUrl} from '../../service/http'

const App = getApp()
create(store, {
  data: {
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    item: undefined,
    detail: '',
    shares: [],
    express: [1,1,1,1,1],
    speed: [1,1,1,1,1],
    courier: [1,1,1,1,1],
  },
  onLoad: function (options) {
    let payload = options.payload
    if (payload) {
      payload = JSON.parse(payload)
    }
    let item = payload.item
    item.goods = item.goods.map(good => {
      good.star = [1,1,1,1,1]
      good.love = '好'
      good.local = []
      good.noname = false
      return good
    })
    this.setData({
      item,
      shares: item.goods
    })
    shareWX()
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  radioChange(e) {
    let shares = this.data.shares
    let index = e.currentTarget.dataset.index;
    let item = shares[index]
    item.noname = Boolean(e.detail.value.length)
    shares[index] = item
    this.setData({shares})
  },
  chooseImage(e) {
    let that = this;
    let index = e.target.dataset.index;
    wx.chooseImage({
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            let shares = that.data.shares
            shares[index].local = shares[index].local.concat(res.tempFilePaths)
            that.setData({shares})
        }
    })
  },
  previewImage(e) {
    let index = e.currentTarget.dataset.index;
    let urls = this.data.shares[index].local
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
    })
  },
  clearImg(e) {
    let shares = this.data.shares
    let index = e.currentTarget.dataset.item;
    let nowList = [];//新数据
    let currentList = shares[index].local;//原数据
    
    for (let i = 0; i < currentList.length;i++){
        if (i == e.currentTarget.dataset.index){
            continue;
        }else{
            nowList.push(currentList[i])
        }
    }
    shares[index].local = nowList
    this.setData({shares})
  },
  bindDetailInput(e) {
    if(e.detail.value.length > 100) return
    this.setData({
      detail: e.detail.value,
    })
  },
  score(e) { //得分
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    if(typeof item === 'object') {
      let idx = 0;
      let shares = this.data.shares
      shares.forEach((val, IDX) => {
        if(val.pid === item.pid) idx = IDX
      })
      item.star = item.star.map((score, iidx) => {
        if (iidx <= index) return 1
        return 0
      })
      shares[idx] = item
      let love = ''
      if(index == 0) {
        love = '差'
      } else if (index == 1) {
        love = '较差'
      } else if (index == 2) {
        love = '一般'
      } else if (index == 3) {
        love = '较好'
      } else {
        love = '好'
      }
      item.love = love
      shares[idx] = item
      this.setData({shares})
      return
    }
    if(item === 'express') { //快递
      let express = []
      express = this.data.express.map((score, iidx) => {
        if (iidx <= index) return 1
        return 0
      })
      this.setData({express})
    } else if (item === 'speed') { //速度
      let speed = []
      speed = this.data.speed.map((score, iidx) => {
        if (iidx <= index) return 1
        return 0
      })
      this.setData({speed})
    } else { //服务
      let courier = []
      courier = this.data.courier.map((score, iidx) => {
        if (iidx <= index) return 1
        return 0
      })
      this.setData({courier})
    }
  },
  pinjiaFuc() {
    wx.showLoading({
      title: '评价上传中',
    })
    let _this = this
    let shares = this.data.shares
    let uploadCount = 0
    this.data.shares.forEach(good => {
      good.local.forEach((img, index) => {
        let time = Date.parse(new Date())+ ''
        wx.uploadFile({
          url: baseUrl.production + API.commonApi.upload,
          filePath: img,
          name: 'ant',
          formData: {
            fileimage: time + good.productid + index,
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            let response = JSON.parse(res.data)
            uploadCount++
            shares = _this.data.shares.map(good => {
              good.local[index] = response.data[0]
              return good
            })
            if(uploadCount == shares[0].local.length) { //上传完成
              let shop_score = [_this.data.express.reduce((a, b) => a + b) + '', _this.data.speed.reduce((a, b) => a + b) + '', _this.data.courier.reduce((a, b) => a + b) + '']
              let payload = {
                pid: shares[0].productid,
                order_id: _this.data.item.orderid,
                content: _this.data.detail,
                score: shares[0].star.reduce((a, b) => a + b) + '',
                anonymous: shares[0].noname ? '1' : '0',
                img: JSON.stringify(shares[0].local),
                shop_score: JSON.stringify(shop_score)
              }
              pingjiaRequest(payload).then(res => {
                if(res.errno == 0) {
                  wx.hideLoading()
                  wx.navigateBack()
                  wx.showToast({
                    title: '评价成功',
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      })
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

/*
description: ""
gtoken: ""
imgs: (3) ["https://appletapi.ant-step.com/upload/2018093015373654559421.jpg", "https://appletapi.ant-step.com/upload/2018093015373640446422.jpg", "https://appletapi.ant-step.com/upload/2018093015373670057793.jpg"]
name: "德国菲斯曼冷凝锅炉保养劵（35kw以下）"
num: "1"
price: "0.01"
productid: "1848"
totalprice: "1"


ORID: "2983"
card_money: "0"
couponprice: "0"
creatTime: "2019-09-10 11:16:26"
fee_price: "0"
goods: [{…}]
gtoken: ""
order_time: "1568085386"
orderid: "20190910111626299006"
ordertotalprice: "1"
pay_status: "2"
payprice: "0.01"
shopid: "177"
shopname: "菲斯曼华东"
status: "80"
type: "1"
user_id: "1623"
*/
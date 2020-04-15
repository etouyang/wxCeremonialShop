import store from '../../store/index';
import create from '../../utils/create';
import { shareWX, shareTitle, tuanCouponImgUrlAppend} from '../../service/helper'
import { 
  couponRequest
} from '../../service/request'
const App = getApp()
create(store, {
  data: {
    groupList: [],
    timeList: [],
    currentIdx: 2,
    nowhour: '', //当前时间点
    selecthour: '', //已选时间点
    timerSecond: undefined, //定时器
    timeDesSecond: '已结束', //倒计时
    navHeight: App.globalData.navHeight,
    screenHeight: App.globalData.screenHeight
  },
  onLoad: function () {
    shareWX()
    //秒杀
    let area = wx.getStorageSync('area')
    if(area) {
      area = JSON.parse(area)
    }
    couponRequest({type: '9', areaid: area.id, limit: 40}).then(res => {
      if (res.errno == 0) {
        //当前时间点
        let nowhour = (new Date()).getHours() + ''
        if (nowhour.length == 1) {
          nowhour = '0'+ nowhour
        }
        this.setData({nowhour})

        let timeList = res.timeArr.map(item => {
          let obj = {time: item, des: ''}
          if (item < nowhour) {
            obj.des = '已结束'
          } else if (item == nowhour) {
            obj.des = '进行中'
          } else {
            obj.des = '即将开始'
          }
          return  obj
        })
        timeList.unshift({time: ' ', des: ' '})
        timeList.unshift({time: ' ', des: ' '})
        timeList.push({time: ' ', des: ' '})
        timeList.push({time: ' ', des: ' '})
        this.setData({timeList})

        let selecthour = ''
        let choice = this.data.timeList.filter(item => item.time >= nowhour)
        if (choice.length) {
          selecthour = choice[0].time
          this.data.timeList.forEach((item, index) => {
            if (item.time == selecthour) {
              this.setData({currentIdx: index})
            }
          })
        } else {
          selecthour = this.data.timeList[this.data.timeList.length -3].time
          this.setData({currentIdx: this.data.timeList.length -3})
        }
        this.setData({selecthour})
        this.listRequest(selecthour)
      }
    })
  },
  listRequest(time){
    let area = wx.getStorageSync('area')
    if(area) {
      area = JSON.parse(area)
    }
    couponRequest({type: '9', areaid: area.id, limit: 40, nowtime: time}).then(res => {
      if (res.errno == 0) {
        if(res.timeArr.length && res.products.length) {
          let select = this.data.timeList.filter(item => item.time == time)
          if (select.length && select[0].des == '进行中') {
            let _this = this
            let end_time = (new Date(res.products[0].end_time)).getTime()
            this.setData({
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
          } else {
            clearInterval(this.data.timerSecond);
            this.setData({
              timeDesSecond: select[0].des
            })
          }
          this.setData({
            groupList: tuanCouponImgUrlAppend(res.products)
          })
        }
      }
    })
  },
  selectIdx(event){
    let currentIdx = event.detail.idx
    let select = this.data.timeList[currentIdx]
    if (select.time !== ' ') {
      this.setData({currentIdx})
      this.listRequest(select.time)
    }
  },
  leftFuc() {
    wx.navigateBack()
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  gotoGroup(event) {
    let index = event.currentTarget.dataset.bindex
    let item = this.data.groupList[index]
    if(this.data.timeDesSecond == '已结束' || this.data.timeDesSecond == '即将开始'){
      wx.showToast({
        title: this.data.timeDesSecond,
        icon: 'fail',
        duration: 1000
      })
    return
    }
    const payload = {"gid": item.pid}
    wx.navigateTo({
      url:'/pages/groupDetail/groupDetail?payload=' + JSON.stringify(payload)
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

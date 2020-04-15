import store from '../../../../store/index';
import create from '../../../../utils/create';
import {shareWX, shareTitle} from '../../../../service/helper'
import { detailOrderRequest, problemRequest } from '../../../../service/request'
const App = getApp()
create(store, {
  data: {
    capsuleTop: App.globalData.capsuleTop,
    capsuleHeight: App.globalData.capsuleHeight,
    wordNum: 0
  },

  goBack() {
    wx.navigateBack()
  },
  leftFuc() {
    wx.navigateBack();
  },
  rightFuc() {
    wx.navigateTo({url:'/pages/message/message'})
  },
  tagChoose(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    self.setData({
      'currentItem': id
    });
  },

  formSubmit(e) {
    var self = this;
    console.log(e)
    var form = e.detail.value;
    if (form.radio == '' || form.radio == null || form.radio == undefined) {
      self.getshowToast('请选择类型')
      return false;
    };

    if (form.order == '' || form.order == null || form.order == undefined) {
      self.getshowToast('请输入订单号码')
      return false;
    };

    if (form.title == '' || form.title == null || form.title == undefined) {
      self.getshowToast('请填写标题名称')
      return false;
    };

    if (form.textarea == '' || form.textarea == null || form.textarea == undefined) {
      self.getshowToast('请填写你的宝贵意见')
      return false;
    };

    if (form.phone == '' || form.phone == null || form.phone == undefined) {
      self.getshowToast('请填写你的手机号码')
      return false;
    } else {
      var telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      if (!(telStr.test(form.phone))) {
        self.getshowToast('请填写正确的手机号码')
        return false;
      }
    }
    detailOrderRequest({orderid: form.order}).then(res => {
      if(res.orderinfo && res.products) {
        let payload = {
          type: form.radio === 'radio1' ? '1' : '4',
          orderid: form.order,
          phone: form.phone,
          title: form.title,
          content: form.textarea,
          shopid: res.products[0].shopid
        };
        problemRequest(payload).then(res => {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 3000
          })
          setTimeout(() => {
            self.goBack()
          }, 1000)
        })
      } else {
        self.getshowToast('未查询到订单信息')
      }
    })
    


  },
  bindDetailInput(e) {
    this.setData({
      wordNum: e.detail.value.length
    })
  },
  getshowToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 3000
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    shareWX()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
import store from '../../../../store/index';
import create from '../../../../utils/create';
import mineStore from '../../../../store/mine.store';
import {shareWX, shareTitle} from '../../../../service/helper'
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    currentItem: 1,
    selectArray: [{
      id: 1,
      text: '未使用'
    },
    {
      id: 2,
      text: '已使用'
    },
    {
      id: 3,
      text: '已过期'
    }
    ]
  },

  goBack() {

    wx.reLaunch({
      url: '../../mine'
    })

  },
  tagChoose(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    self.setData({
      'currentItem': id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () { 
    shareWX()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showModal({
      title: '提示',
      content: '没有老页面或者UI设计稿参考',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
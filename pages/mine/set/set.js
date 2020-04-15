import store from '../../../store/index';
import create from '../../../utils/create';
import setStore from '../../../store/set.store';
import {shareWX, shareTitle} from '../../../service/helper'

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    currentItem: 1,
    selectArray: [{
        id: 1,
        text: '全部'
      },
      {
        id: 2,
        text: '待付款'
      },
      {
        id: 3,
        text: '待发货'
      },
      {
        id: 4,
        text: '待收货'
      },
      {
        id: 5,
        text: '待评价'
      },
      {
        id: 6,
        text: '退款/售后'
      }
    ]
  },

  goBack() {
    wx.navigateBack()
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出该账户',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
  onLoad: function(options) {
    shareWX()
    console.log(options);
    if (options.type) {
      this.setData({
        currentItem: options.type
      })

    }
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
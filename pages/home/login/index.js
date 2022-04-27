let utils = require('../../../utils/util.js')
let api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  todefaultAvatarUrl:function(){
    utils.navigateTo('/pages/home/defaultAvatarUrl/index')
  },
  /**
   * 微信授权登录
  */
 getPhoneNumber:function(e){
  if (e.detail.errMsg != "getPhoneNumber:ok") {
    return;
  }
  api.getUserInfo(e.detail, function(success, message) {
    wx.showLoading({
      title: '',
      mask: true,
    });
    if (success) {
      wx.hideLoading()
      //直接跳到首页  
      wx.reLaunch({
        url: '/pages/home/index/index'
      })
      return;
    }
    wx.showToast({
      title: message,
      icon: 'none'
    })
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
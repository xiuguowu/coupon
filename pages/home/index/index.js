// 计算Navbar的高度
let statusBarHeight = wx.getSystemInfoSync().statusBarHeight,
  navigationBarHeight = statusBarHeight + 44;
  let utils= require('../../../utils/util.js')
  let api = require('../../../utils/api.js')
  const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight,
    navigationBarHeight,
    imageList:['https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1115%2F0ZR1095111%2F210ZP95111-7-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652855664&t=a9514846143095a7e4f3a753669c12eb',
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.daimg.com%2Fuploads%2Fallimg%2F210124%2F1-210124225R5.jpg&refer=http%3A%2F%2Fimg.daimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652855664&t=fc10b19497508bc8d6cb356f361797e9',
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F0F420110430%2F200F4110430-6-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652855664&t=6480027f35daca8e3aa3c5ad4bcf1cb3'
  ],
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '',
    //   mask:true,
    // });
    
    let that = this;
    console.log(options)
    console.log(app.globalData.isCheckLogin)
    //清空cookies全局变量信息
    app.globalData.cookie="";
    var accessSource = options.accessSource == null ? "" : options.accessSource.trim();    
    console.log('accessSource---->>>' + accessSource)
    //设置访问来源
    app.globalData.accessSource = accessSource;
    if (app.globalData.isCheckLogin) {
      that._getLoginUser();
    } else {
      debugger
      console.log(app.loginCallback,'我是login')
      app.loginCallback = res => {
        console.log('你是干嘛：',res)
        that._getLoginUser();  
      }
       //根据不同来源跳转到不同的主页
    utils.jumpToIndex(); 
    }
  },
  _getLoginUser() {
  debugger
    api.getLoginUser().then(data => {
      console.log(data)
    }).catch(err => {
      wx.hideLoading();
     
      if(err.code==500){
        wx.showToast({
          title: '系统连接异常，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }else{
        wx.showToast({
          title: err.message,
          icon: 'none',
          duration: 3000
        })
      }
     
    })
  },
  toDetails:function(e){
    utils.navigateTo('/pages/home/details/index')
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
    api.getRequest("/api/banner/queryBannerList")
    .then(res=>{
     console.log('我是banner',res)
      wx.hideLoading();
      
      
    }).catch(err =>{
      console.log('我是banner',err)
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
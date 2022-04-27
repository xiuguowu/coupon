const app = getApp();
const api = require("../../../utils/api.js")
const utils = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMobile: "",
    user: {},
    isCheckLogin:false,
    isShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const url = decodeURIComponent(options.q) // 获取到二维码原始链接内容
    // // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene)
    if(scene!='undefined'){
      console.log(scene)
      console.log('test')
    }
    
    // const scancode_time = parseInt(options.scancode_time) // 获取用户扫码时间 UNIX 时间戳
    // console.log(url)
    // if(url!= 'undefined'&&url){
    //   let param = this.getJsUrl(url)
    //   console.log(param)
    //   console.log('code:'+param['code'])
    //    console.log('扫码时间:'+scancode_time)
    // }
    wx.showLoading({
      title: '',
      mask:true,
    });
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
      app.loginCallback = res => {
        that._getLoginUser();  
      }
    }
    //根据不同来源跳转到不同的主页
    utils.jumpToIndex(); 
  },
getJsUrl(url) {
    var parastr;
    var array = []
    parastr = url.split("?")[1];
    var arr = parastr.split("&");
    for (var i = 0; i < arr.length; i++) {
        array[arr[i].split("=")[0]] = arr[i].split("=")[1];
    }
    return array;
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
  //
  _getLoginUser() {
    var _this = this
    api.getLoginUser().then(data => {
      console.log(data)
      let mobile = data.user.mobile
      //缓存用户手机号码
      wx.setStorage({
        key: "userMobile",
        data: mobile
      });
      if (mobile != null && mobile != '') {
        mobile = mobile.replace(mobile.substring(3, 7), '****');
        this.setData({
          user: data.user,
          userMobile: mobile,
          //isShow:false
        });
      }
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      this.setData({
        //isShow:false
      });
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
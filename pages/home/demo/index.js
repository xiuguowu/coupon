var app = getApp();
var weatherApi = require('../../../utils/weather.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    //深色
    bottomColor: '#ff6600',
    //浅色
    gradientColor:'#ffcc99',
    movies: [
      { url: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', path: '', bottomColor: '#274046', gradientColor:'#E6DADA'},
      { url: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', path: '', bottomColor: '#faaca8', gradientColor: '#ddd6f3'},
      { url: 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640', path: '', bottomColor: '#3a7bd5', gradientColor: '#00d2ff'},
      { url: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', path: '', bottomColor: '#B993D6', gradientColor: '#8CA6DB'}
    ],
    routers: [
      {
        id: '0',
        name: '相同图片搜索入库',
        url: '../../pages/sameadd/sameadd',
        icon: '../../image/sameadd.png'
      },
      {
        id: '1',
        name: '相同图片搜索检索',
        url: '../../pages/samesearch/samesearch',
        icon: '../../image/samesearch.png'
      }
    ],
    weather:null,
    weatherIcon:'../../image/999d.png'
    //coatFatThinColor: linear-gradient(rgb(90, 66, 242), rgb(140, 202, 229))
  },
  toPage: function (event) {
    var route = event.currentTarget.id;
    if (route == 0) {
      wx.navigateTo({
        url: '/pages/sameadd/sameadd',
      })
    }
     if (route == 1) {
      wx.navigateTo({
        url: '/pages/samesearch/samesearch',
      })
    } 
  },
  //change事件 根据index 更改颜色
  testSwiper:function(e){
    var that = this;
    var index = e.detail.current;
    var currentbottomColor = that.data.movies[index].bottomColor;
    var currentgradientColor = that.data.movies[index].gradientColor;
    that.setData({
      bottomColor: currentbottomColor,
      gradientColor: currentgradientColor
    })
  },
  weatherIconError:function(e){
    console.info('error==='+e);
      var _errImg = e.target.dataset.errImg;
  },
  onLoad:function(){
    var that = this;
    that.getLocation();
  },
  //获取经纬度方法
  getLocation:function(){
    var that = this;
    let weatherIconURL = "自己的天气图标存放路径或直接使用和风天气的CDN地址";
    wx.getLocation({
      type:'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        weatherApi.weatherRequest(longitude,latitude,{
          success(res){
            that.setData({
              weather:res,
              weatherIcon: weatherIconURL + res.now.cond_code+'d.png'
            })
          }
        });
      },
    })
  }
})
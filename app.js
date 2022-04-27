
const api = require("./utils/api.js")
//const utils = require('./utils/util.js');
App({
  onLaunch: function (options) {   
    api.init({
      // host:'http://172.16.62.33:8084',
      //host:'http://localhost:8084',
      // host: 'https://api3dev.canseq.com',  //测试环境
      // host: 'https://api.canseq.com',  //正式环境

      host:'http://172.16.62.36:8081',  //秀国
      // host:'http://172.16.82.53:8084'   //春根
      // host:'http://172.16.211.179:8084' ,  //以万
      // host:'http://172.16.62.36:8084',
      // host:'http://a4dc3b691683.ngrok.io',
      // host:'http://153bdafe8510.ngrok.io',
      // host:'http://ebefd6d25eef.ngrok.io',

      // esignHost :'https://admin3dev.canseq.com',  //电子签名测试地址
      esignHost:'https://cloud.canseq.com'      //电子签名正式地址
      // host:'http://172.16.62.33:8084'

    }) 
  // 获取屏幕参数
  try {
    const res = wx.getSystemInfoSync()
    if (res.platform == 'ios') {
      this.globalData.platform = 'ios'
    } else if (res.platform == 'android') {
      this.globalData.platform = 'android'
    }
    // 导航高度
    let navHeight = res.statusBarHeight 
    // 屏幕宽度/高度，单位px
    this.globalData.screenWidth = res.screenWidth
    this.globalData.screenHeight = res.screenHeight
    // 状态栏的高度，单位px
    this.globalData.statusBarHeight = res.statusBarHeight
    // 设备像素比
    this.globalData.pixelRatio = res.pixelRatio
    // 可使用窗口宽度，单位px
    this.globalData.winWidth = res.windowWidth
    // 安卓时，胶囊距离状态栏8px，iOS距离4px
    if (res.system.indexOf('Android') !== -1) {
      this.globalData.navHeight = navHeight + 14 + 32
      this.globalData.navTitleTop = navHeight + 8
      // 视窗高度 顶部有占位栏时
      this.globalData.winHeight = res.screenHeight - navHeight - 14 - 32
      // tab主页视窗高度
      this.globalData.winHeightTab = res.windowHeight - navHeight - 14 - 32
    } else {
      this.globalData.navHeight = navHeight + 12 + 32
      this.globalData.navTitleTop = navHeight + 4
      // 视窗高度 顶部有占位栏时
      this.globalData.winHeight = res.screenHeight - navHeight - 12 - 32
      // tab主页视窗高度
      this.globalData.winHeightTab = res.windowHeight - navHeight - 12 - 32
    }
    console.log(wx.getSystemInfoSync(), this.globalData.winHeightTab)
  } catch (e) {
    console.log(e)
  }


    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    });
    wx.login({
      success: res => {
        let that = this
        console.log('进来：',res)
        api.login(res.code, function(isOk) {
          console.log('isOk:',isOk)
          //保证 app的onLaunch 与 pages的onload 的执行顺序
          if (isOk) {
            that.globalData.isCheckLogin = true;
            debugger
            if (that.loginCallback) {
              that.loginCallback()
            }
          }
        })
      },fail:err=>{
        console.log('失败？',err)
      }
    });
    this.checkIsIPhoneX();
  },
  checkIsIPhoneX: function() {
		let _this = this
			wx.getSystemInfo({
				success: res => {
					let modelmes = res.model;
					console.log(res.model)
					let iphoneArr = ['iPhone X', 'iPhone 11', 'iPhone 11 Pro Max','iPhone XS Max']
					iphoneArr.forEach(function (item) {
						if (modelmes.search(item) != -1) {
							_this.globalData.isIPX = true
            }
          
					})    
				}
			})
  },
  onShow(options) {
		console.log(options)
    wx.setKeepScreenOn({
      keepScreenOn: true,
      fail: function (res) {
        console.log(res);
      }
		});
    //电子签名返回数据
    if (options && options.referrerInfo && options.referrerInfo.appId && options.referrerInfo.extraData) {
      var callbackObj = options.referrerInfo.extraData.callbackObj;
      var signOver = callbackObj.signOver;
      if (options.referrerInfo.extraData.isSuccess && options.referrerInfo.extraData.msg == "success") {
        if(signOver){
          wx.reLaunch({
            url: '/pages/sample/pages/common/bindSampleState/index?idcard=' + callbackObj.idcard +'&mobile=' + callbackObj.mobile + '&name=' + callbackObj.name + '&sex=' + callbackObj.sex + '&age=' + callbackObj.age + '&idcardType=' + callbackObj.idcardType + '&code=' + callbackObj.code + '&process=' + callbackObj.process + '&donate=' +  callbackObj.donate + '&sampleDate=' + callbackObj.sampleDate + '&serviceCode=' + callbackObj.serviceCode +'&customerId' + callbackObj.customerId
          });
        }
      } else {
        wx.showModal({
          title:'提示',
          content:'签署知情失败！返回重新签署？',
          showCancel: false,
          confirmColor:'#7DEFEC',
          success:function(res){
            if (res.confirm) {
              console.log('用户点击确定')
              wx.reLaunch({
                url: '/pages/sample/pages/crc/userInfo/index?serviceCode=' + callbackObj.serviceCode + '&customerId='+ callbackObj.customerId
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  onHide() {
  },
  globalData: {
    accessSource:"",                //访问来源
    accessBind:"bind",	            //样本绑定进入标识
    accessReportList:"reportlist",	//样本列表进入标识
    accessCRCProcess:'crcprocess',  //无创肠癌基因检测-使用流程进入标识
    accessXgBind: "xgbind",	        //新冠检测绑定进入标识
    sampleList:[],
    miniSource: 2, //用户来源  1: 微信公众号 2：金丝带canseq小程序 3：seqhpv小程序 4：hpv筛查小程序
    userInfo: null, 
    cookie: '',    //访问cookie
    cookies:[],
    isCheckLogin:false,    //是否登录

    fileDomain: 'https://uploadfile.canseq.com', //上传文件域名正式
    // fileDomain: 'http://site.upload.canseq.com', //上传文件域名测试


    /*-------------电子签署地址 回调--------------**/
    //esignCustomerId: 3162,   //id
    //esignCustomerId:15,     
    //esignCtx:'http://localhost:8084',       //本地地址
    //esignCtx:'https://api3dev.canseq.com',  //测试地址
    esignCtx:'https://api.canseq.com'         //线上地址

  } ,
  api:api,
  isIPX: false, //是否为iphone X

  platform: 'ios',
  pixelRatio: 2,
  statusBarHeight: 20,
  navHeight: 64,
  navTitleTop: 26,
  winHeight: 655,
  winWidth: 750,
  screenWidth: 375,
  screenHeight: 812
})
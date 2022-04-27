
// 保存图片到手机
function onSaveToPhone(url , target) {
    let _this = target
    let urlN=url
    if (url.indexOf("https") < 0) {
        urlN = url.replace("http:", "https:");
      }
  getSetting().then((res) => {
    console.log(res)
    // 判断用户是否授权了保存到本地的权限
    if (!res.authSetting['scope.writePhotosAlbum']) {
      authorize().then(() => {
        savedownloadFile(urlN)
       
      }).catch((err) => {
        console.log(err)
        wx.showToast({
          title: '您拒绝了授权',
          icon: 'none',
          duration: 1500
        })
       
      
      })
    } else {
      savedownloadFile(urlN)
    }
  }).catch(err=>{
    if(err.code==500){
      wx.showToast({
        title: '系统连接异常，请稍后再试',
        icon: 'none',
        duration: 3000
      })
    }else{         
    wx.showToast({
      title:"保存失败，稍后再试",
      icon: 'none',
      duration: 3000
    })
  }
  })
}


function savedownloadFile(img) {
    wx.showLoading({
      title: '保存中...', 
      mask: true,
    });
  wx.saveImageToPhotosAlbum({
    filePath: img,
    success(res) {
      wx.showToast({
        title: '保存成功,手机相册查看',
        icon: 'none',
        duration: 2000
      });
    },
    fail(res) {
      console.log(res)
      wx.showToast({
        title: '保存失败，稍后再试',
        icon: 'none',
        duration: 2000
      });
    }
  });
}


//打开设置，引导用户授权
function onOpenSetting() {
    wx.openSetting({
      success: (res) => {
        console.log(res.authSetting)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showToast({
            title: '您未授权',
            icon: 'none',
            duration: 1500
          })
        } else {// 接受授权
          onSaveToPhone() // 接受授权后保存图片
        }
      },
      fail:(err)=>{
          console.log(err)
          wx.showToast({
            title: '设置失败,需手动设置',
            icon: 'none',
            duration: 1500
          })
      }
    })
}


// 发起首次授权请求
function authorize(){
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success: () => {
          resolve()
        },
        fail: res => { //这里是用户拒绝授权后的回调
          console.log('拒绝授权')
          showModal()
          reject(res)
        }
      })
    })
  }

// 获取用户已经授予了哪些权限
function getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          resolve(res)
        },
        fail:err=>{
            console.log('授权获取失败')
            reject(err)
        }
      })
    })
  }
  // 弹出模态框提示用户是否要去设置页授权
function showModal() {
    wx.showModal({
      title: '检测到您没有打开保存到相册的权限，是否前往设置打开？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          onOpenSetting() // 打开设置页面          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  module.exports = {
    onSaveToPhone:onSaveToPhone
  }

const app = getApp();
//const reportUrl = app.globalData.reportUrl;
//const heredityReportUrl = app.globalData.heredityReportUrl;


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  jumpToIndex: jumpToIndex,
  RequestBySessionId: RequestBySessionId,
  validatePhone: validatePhone,
  showReport: showReport,
  identityCardVerifica: identityCardVerifica,
  base64_encode: base64_encode,
  dateLater:dateLater,
  isBlank: isBlank,
  validateEmail: validateEmail,
  navigateTo:navigateTo,
  onSaveToPhone:onSaveToPhone
}
/**
   * 传入时间后几天
   * param：传入时间：dates:"2018-04-02",later:往后多少天
   */
  function dateLater(dates, later){
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()+1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    dateObj.join=date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()+1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    return dateObj;
  };
/**
 * 根据访问来源跳转到不同的页面
 */
function jumpToIndex() {
  if (app.globalData.accessSource == app.globalData.accessBind) {
    //跳转到绑定页面
    wx.reLaunch({
      url: '/pages/sample/pages/common/detection/detection',
    });
    console.log('绑定页面')
  } else if (app.globalData.accessSource == app.globalData.accessReportList) {
    //跳转到报告列表页
    wx.reLaunch({
      url: '/pages/report/pages/reportList/report',
    });
    console.log('报告列表页面')
  } else if (app.globalData.accessSource == app.globalData.accessXgBind) {
    //跳转到报告列表页-新冠
    wx.reLaunch({
      url: '/pages/sample/pages/ncov/index',
    });
  }else if (app.globalData.accessSource == app.globalData.accessCRCProcess) {
    //跳转到无创肠癌基因检测-使用流程
    wx.reLaunch({
      url: '/pages/sample/pages/common/process/process?productLine=19',
    });
  }/* else if(app.globalData.accessSource == '' ){
    //跳转到主页
    wx.reLaunch({
      url: '/pages/home/home/index',
    });
  } */
  else if(app.globalData.accessSource== app.globalData.accessBCABind){
    wx.reLaunch({
      url: '/pages/sample/pages/brca/bindSample/bindSample',
    });
  }
}

//带着sessionId进行请求，自动获取服务端返回的sessionId存入全局变量中
function RequestBySessionId(requestParam) {
  //三个默认参数的值
  var method = "POST";
  var dataType = "json";
  var responseType = "text";
  //用户输入了参数就替换，没输入就使用默认的
  if ("method" in requestParam) {
    method = requestParam.method;
  }
  if ("dataType" in requestParam) {
    dataType = requestParam.dataType;
  }
  if ("responseType" in requestParam) {
    responseType = requestParam.responseType;
  }
  var url = requestParam.url;
  var requestData = requestParam.data;
  if (requestData == null) {
    requestData = {};
  }
  var success = requestParam.success;
  var fail = requestParam.fail;
  var complete = requestParam.complete;
  var cookieStr = app.globalData.cookie; //获取全局变量中的cookie内容
  var header = {};
  if ("header" in requestParam) {
    header = requestParam.header;
  }
  header["Cookie"] = cookieStr;
  header["originFlag"] = "miniProgram";//旧版本没有
  //请求统一添加小程序访问标识
  requestData.accessType = "miniProject";
  requestData.miniSource = app.globalData.miniSource;
  wx.request({
    url: requestParam.webUrl || ctx + requestParam.url,
    data: requestData,
    header: header, //每次请求带上sessionId
    success: function(res) {
      //判断session是否过期
      if (res.data != null && typeof (res.data.auth) != "undefined" && res.data.auth == "sessionOutOfDate") {
        wx.reLaunch({
          url: '/pages/login/authorization/authorization',
        });
        return;
      }

      //先将检查服务器返回报文头中有无sessionId，有则存到全局变量中      
      var cookie = res.header["Set-Cookie"];
      if (undefined != cookie) {
        var jsid = cookie.indexOf("_JSID");
        if (app.globalData.cookie.indexOf("_JSID") == -1 && jsid != -1) {
          var strJsid = cookie.substring(jsid, jsid + 40);
          app.globalData.cookie += strJsid;
        }
        var jsessionId = cookie.indexOf("JSESSIONID");
        if (app.globalData.cookie.indexOf("JSESSIONID") == -1 && jsessionId != -1) {
          var strJsessionId = cookie.substring(jsessionId, jsessionId + 45);
          app.globalData.cookie += strJsessionId;
        }
        var wechatcanseq = cookie.indexOf("wechatcanseq");
        if (app.globalData.cookie.indexOf("wechatcanseq") == -1 && wechatcanseq != -1) {
          var strWechatcanseq = cookie.substring(wechatcanseq, wechatcanseq + 47);
          app.globalData.cookie += strWechatcanseq;
        }
      }
      //500错误，系统异常
      if (res.statusCode == 500) {
      
        wx.navigateTo({
          url: '/pages/common/error/500',
        });
      } else {
        //执行正常的操作
        success(res);
      }
    },
    fail: fail,
    complete: complete,
  });
}



// 校验手机号
function validatePhone(phonenum) {
  var reg = new RegExp(/^1\d{10}$/);
  if (phonenum == null || phonenum.length == 0) {
    return "请输入手机号码";
  }
  if (phonenum.length < 11) {
    return "手机号少于11位数，请核对重新输入";
  }
  if (!reg.test(phonenum)) {
    return "手机号码格式错误，请核对重新输入";
  }
  return null;
}
//效验身份证
function identityCardVerifica(card) {
  var cardReg = new RegExp(/^\d{15}$|^\d{17}(x|X|\d)$/);
  if (card == null || card.length == 0) {
    return "请输入证件号码";
  }
  if (card.length < 18) {
    return "证件号码少于18位数，请核对重新输入";
  }
  if (!cardReg.test(card)) {
    return "证件号码格式错误，请核对重新输入";
  }
  return null;
}
/**
 * 查看报告
 */
function showReport(bispId,rUrl) {
  wx.showLoading({
    title: '',
    mask: true,
  });
  var that = this;
  var Cookie = app.globalData.cookie; //获取全局变量中的cookie内容
  var header = {};
  header["Cookie"] = Cookie;
  wx.downloadFile({
    url: rUrl||(app.globalData.reportUrl + bispId), 
    header: header, //每次请求带上sessionId
    success: function(res) {
      wx.hideLoading();
      if (res.statusCode === 200) {
        that.tempFilePath = res.tempFilePath;
        wx.getFileInfo({
          filePath: res.tempFilePath,
          success: res => {
            if (res.size == 0) {
              wx.showToast({
                title: "报告异常，请重试！",
                icon: 'none',
                duration: 3000
              });
            } else {
              wx.openDocument({
                filePath: that.tempFilePath,
                complete: res => {
                  console.log(res);
                }
              })
            }
          }
        })
      } else {
      
        wx.navigateTo({
          url: '/pages/common/error/500',
        });
      }
    },
    fail: function(res) {
      wx.hideLoading();
      //此处是兼容ios，如果返回为null，IOS会进入fail、函数中，并且返回{downloadFile:fail file data is empty}
      if (res.errMsg == 'downloadFile:fail file data is empty'){
        wx.showToast({
          title: "报告异常，请重试！",
          icon: 'none',
          duration: 3000
        });
      }else{
      
        wx.navigateTo({
          url: '/pages/common/error/500',
        });
      }
    }
  })
}





function base64_encode(str) { // 编码，配合encodeURIComponent使用
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0,
    len = str.length,
    strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}

function isBlank(str) {
  if (str == null) return true;
  if (typeof(str) == "undefined") return true;
  str = str.toString().replace(/\s+/g, "");
  return str.length == 0
}

function validateEmail(email) {
  var reg = new RegExp(/^\S+@\S+\.\S+/);
  if (isBlank(email)) {
    return "请输入邮箱";
  }
  if (!reg.test(email)) {
    return "邮箱格式错误，请核对重新输入";
  }
  return null;
}
// 路由超过
function navigateTo(url) {
  if (getCurrentPages().length >= 10) {
    wx.redirectTo({
      url: url,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  } else {
    wx.navigateTo({
      url: url,
      fail:function(err){
        console.log(err)
      }
    })
  }
}

// 保存图片到手机
function onSaveToPhone(photoUrl) {
  if (photoUrl.indexOf("https") < 0) {
     photoUrl = photoUrl.replace("http:", "https:");
      
    }
  getSetting().then((res) => {
  // 判断用户是否授权了保存到本地的权限
  if (!res.authSetting['scope.writePhotosAlbum']) {
    authorize().then(() => {
      savedownloadFile(photoUrl)
   
     
    }).catch((err) => {
      if(err.code==500){
        wx.showToast({
          title: '系统连接异常，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }else{         
      wx.showToast({
        title:"您拒绝了授权",
        icon: 'none',
        duration: 3000
      })
    }
    })
  } else {
    savedownloadFile(photoUrl)
  }
})
}
function savedownloadFile(img) {
  wx.downloadFile({
    url:img,
    success: function(res) {
      wx.showToast({
        title: res,
        icon: 'success',
        duration: 2000
      });
        console.log(res)
      if (res.statusCode === 200) {
        let img = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: img,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail(res) {
            wx.showToast({
              title: '保存失败',
              icon: 'success',
              duration: 2000
            });
          }
        });
      }
    }
  })
}
// 发起首次访问照片授权请求
function authorize() {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        resolve()
      },
      fail: res => { //这里是用户拒绝授权后的回调
        console.log('拒绝授权')
        reject()
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
      }
    })
  })
}
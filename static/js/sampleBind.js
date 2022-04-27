const api = require('../../utils/api.js')
const utils = require('../../utils/util.js')
let bindSamplePages = [{
    productLine: 1,
    url: "/pages/sample/pages/hpv/bindSample/bindSample"
  },
  {
    productLine: 19,
    url: "/pages/sample/pages/crc/bindSample/bindSample"
  },
  {
    productLine: 20,
    url: "/pages/sample/pages/brca/bindSample/bindSample"
  },
  {
    productLine: 22,
    url: "/pages/sample/pages/reproductive/bindSample/bindSample"
  },
  {
    productLine: 23,
    url: "/pages/sample/pages/maleHpv/bindSample/bindSample"
  },
  {
    productLine: 21,
    url: "/pages/sample/pages/ncov/index"
  },
  {
    productLine: 31,
    url: "/pages/sample/pages/heredityGenes/bindSample/bindSample"
  }
];





function getBindSampleInfo(mobile, productLine, _target) {
  api.getRequest("/api/sample/getProcessList", {
      mobile,
      productLine
    })
    .then(res => {
      console.log(res)
      let listNum=[]
      if (res.data != null && res.data.length > 0) {
       let list = res.data
       for(let i=0;i<list.length; i++){
        if(list[i].num==0){
          listNum.push(list[i]) 
        }
       }
        console.log(listNum)
       _target.setData({
        sampleInfoList: listNum==[]?[]:listNum
      });
          _target.setProcess(listNum);
          _target.getCodes()
      }
    }).catch(err => {
      console.log(err)
      if(err.code==500){
        wx.showToast({
          title: '系统连接异常，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }else{         
      wx.showToast({
        title:"请求超时，请稍后重试或刷新重试!",
        icon: 'none',
        duration: 3000
      })
    }
    })
}


function addSampleProcess(productLine, mobile) {
  api.getRequest("/api/sample/doSaveProcess", {
      productLine,
      mobile
    })
    .then(res => {
      console.log(res)
      if (res.state == 'ok') {
        utils.navigateTo('/pages/sample/pages/common/process/process?mobile=' + mobile + '&productLine=' + productLine)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 3000
        })
      }
    }).catch(err => {
      if(err.code==500){
        wx.showToast({
          title: '系统连接异常，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }else{         
      wx.showToast({
        title:err.message,
        icon: 'none',
        duration: 3000
      })
    }
    })
}

// CRC、BRCA产品数量进行判断
function isBindSample(productLine, _callback) {
  api.getRequest("/api/sample/getDetail", {
      productLine
    })
    .then(res => {
      console.log(res)
      if (_callback) {
        _callback(res);
      }
    }).catch(err => {
      if(err.code==500){
        wx.showToast({
          title: '系统连接异常，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }else{         
      wx.showToast({
        title:err.message,
        icon: 'none',
        duration: 3000
      })
    }
    })

}

function getReportDetail(sampleCode, _target, _callback) {
  wx.showLoading({
    title: '',
  });
  api.getRequest("/api/report/detail", {
    sampleCode
    })
    .then(res => {
      console.log(res)
      if (res.state == 'ok') {
        wx.hideLoading();
        _target.setData({
          reportInfo: res,
          resultDetail: res.reportList[0].resultDetail
        });
        console.log(_target.resultDetail)
        if (_callback) {
          _callback(res);
        }
      }

    }).catch(err => {
      if(err.code==500){
        wx.showToast({
          title: '系统连接异常，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }else{         
      wx.showToast({
        title:err.message,
        icon: 'none',
        duration: 3000
      })
    }
    })
}

/**
 * 获取报告详情（存在从hpv筛查小程序跳转过来的情况）
 * 添加登录人id参数，loginMemberId
 */
function getHpvReportDetail(code, loginMemberId, _target, _callback) {
  api.getRequest("/api/sample/getDetail", {
      loginMemberId: typeof (loginMemberId) == 'undefined' ? "" : loginMemberId,
      sampleCode: code
    })
    .then(res => {
      console.log(res)
      _target.setData({
        reportInfo: res
      });
      if (_callback) {
        _callback(res);
      }
    }).catch(err => {
      if(err.code==500){
        wx.showToast({
          title: '系统连接异常，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }else{         
      wx.showToast({
        title:err.message,
        icon: 'none',
        duration: 3000
      })
    }
    })
}

function findPagesByProductLine(_productLine) {
      let productLine = parseInt(_productLine)
  for (let i in bindSamplePages) {
    if (bindSamplePages[i].productLine === productLine) {
      return bindSamplePages[i].url;
  
    }
  }
  return null;
}

// 新接口
function heredityValidationSample(sampleCode, productLine, target) {
  let product
  if (productLine == 1) {
    product = 'HPV分型基因检测'
  }
  if (productLine == 19) {
    product = '结直肠癌筛查'
  }
  if (productLine == 20) {
    product = 'BRCA1/2遗传风险评估'
  }
  if (productLine == 31) {
    product = '遗传性肿瘤基因检测'
  }
  if (productLine == 21) {
    product = '新冠病毒检测'
  }
  if (productLine == 23) {
    product = '男性HPV分型基因检测'
  }
  if (productLine == 22) {
    product = '生殖道微生态检测'
  }
  if (productLine == 40) {
    product = '无创肝癌'
  }
  if (wx.getStorageSync('sampleInfo')) {
    wx.removeStorageSync('sampleInfo');
  }
  api.getRequest("/api/sample/verifyCode", {
      sampleCode: sampleCode,
      productLine: productLine
  }).then(ret => {
      console.log(ret)
      if (ret.state == "ok") {
        // 返回产品和客户信息
        api.getRequest("/api/sample/getDetail", {
          sampleCode
        }).then(res => {
            console.log(res)
            //如果这个字段为crcms就isSocietySample为true
            // if (res.customer.type == 'crcms') {
            //   target.setData({
            //    isSocietySample:true
            //   })
            // }
            let sample = {
              code: sampleCode,
              bindDate: target.data.pickerDate,
              securityType: res.products[0].productLine,
              serviceCode: res.products[0].serviceCode,
              isSocietySample:res.customer.type,
              customerId:ret.product.customerId,
            }
            wx.setStorageSync('sampleInfo', sample);
            if (res.products[0].isNewProduct == 1) {    // 0：不是新产品 1：是新产品
              wx.redirectTo({
                url: '../userInfo/index?serviceCode=' + res.products[0].serviceCode + '&customerId=' + ret.product.customerId,
              })
            } 
            // 肝癌产品
            else if(res.products[0].productLine==40){
              wx.redirectTo({
                url: '/pages/sample/pages/liverCancer/bindSampleMsg' 
              })
            }else {
              wx.redirectTo({
                url: '../bindSampleConsent/bindSampleConsent?securityType=' + res.products[0].serviceLine,
              })
            }
        }).catch(err => {
          if(err.code==500){
            wx.showToast({
              title: '系统连接异常，请稍后再试',
              icon: 'none',
              duration: 3000
            })
          }else{         
            target.toast.showToast(err.message)
          }
        })
      } else {
        target.setData({
          tipShow: true,
          tipText: ret.message
        })
        if (ret.bindError) {
          wx.showModal({
            content: res.message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: findPagesByProductLine(productLine),
                  fail:function(res){
                    console.log(res)
                  }
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '绑定失败',
            icon: 'none',
            duration: 3000
          })
        }
      }
  }).catch(err => {
      console.log(err)
      let line = err.productLine
      if (err.message == '产品线不匹配') {
        if(line){
          wx.showModal({
            title: '提示',
            content: '您绑定的样本不是' + product + '产品！是否跳转相应产品录入界面?',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: findPagesByProductLine(line),
                  fail:function(res){
                    console.log(res)
                  }
                })
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showToast({
            title: err.message,
            icon:'none',
            duration: 3000
          })
        }
       
      } else {
        if(err.code==500){
          target.toast.showToast('系统连接异常，请稍后再试')
        }else{
          target.toast.showToast(err.message)
        }
      }
  })

}






module.exports = {
  getBindSampleInfo: getBindSampleInfo,
  isBindSample: isBindSample,
  addSampleProcess: addSampleProcess,
  getReportDetail: getReportDetail,
  getHpvReportDetail: getHpvReportDetail,
  heredityValidationSample: heredityValidationSample
}
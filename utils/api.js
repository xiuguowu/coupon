import base from './base.js'

//固定的几个路由地址
const upload_api = "/api/upload"
const getLoginUser_api = "/api/user"             //用户信息接口
// const code2session_api = "/api/wechat/mp/code2session" // 登录换取session接口
// const decryptUserInfo_api = "/api/wechat/mp/decryptUserInfo" // 用户信息接口
const code2session_api = "/api/login/code2session" // 登录换取session接口
const decryptUserInfo_api = "/api/login/decryptUserInfo" // 用户信息 

const  showError = function(msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

const init = paras => {
  base.config.host = paras.host;
  base.config.esignHost = paras.esignHost; //电子签署地址
  base.config.app_id = paras.app_id||'genomicsminprogramapi';
  base.config.app_secret = paras.app_secret||'genomics$';
  var jwt = wx.getStorageSync("jwt");
  if (jwt) {
    base.config.jwt = jwt
  }
}

const clearJwt = () => {
  base.config.jwt = ''
  wx.removeStorage({
    key: 'jwt'
  })
}
/* post方法 地址不需要拼接调用此方法  注意传值是data  */
const postRequest = (route, data)=> {
  return base.createPostRequest({
    api: route,
    data: data
  }).send()
}
/* get方法 地址不需要拼接调用此方法  注意传值是data  */
const getRequest = (route, paras) => {
  return base.createGetRequest({
    api: route,
    paras: paras
  }).send()
}

/* post方法 电子签名方法 */
const postRequestSign = (route, data)=> {
  return base.createPostRequestSign({
    api: route,
    data: data
  }).send()
}
/* get方法 电子签名方法 */
const getRequestSign = (route, paras) => {
  return base.createGetRequestSign({
    api: route,
    paras: paras
  }).send()
}

/* 获取用户信息 */
const getLoginUser = () => {
  return base.createGetRequest({
    api: getLoginUser_api
  }).send().catch(data=>{
    console.error(data.message)
  })
}

// filePath :微信返回临时路径，后端如果需要获取参数，请在url中获取
const upload = (paras, filePath) => {
  return base.createUploadRequest({
    api: upload_api,
    paras: paras
  }, files).send()
}
const download = (route, paras) => {
  return base.createDownloadFile({
    api: route,
    paras: paras
  }).send()
}
const viewPdf = (route, paras) => {
  download(route, paras).then(url => {
    wx.openDocument({
      fileType: "pdf",
      filePath: url,
      fail: function() {
        wx.hideLoading()
        showError("文件获取失败")
      }
    })
    wx.hideLoading()
  }).catch(message => {
    wx.hideLoading()
    showError(message)
  })
}
const viewJpg = (route, paras) => {
  download(route, paras).then(url => {
    wx.openDocument({
      fileType: "jpg",
      filePath: url,
      fail: function() {
        wx.hideLoading()
        showError("文件获取失败")
      }
    })
    wx.hideLoading()
  }).catch(message => {
    wx.hideLoading()
    showError(message)
  })
}

//wx.login获取code
const code2session = (code, callback) => {
  getRequest(code2session_api, {
    code: code
  }).then(data => {
    base.config.sessionId = data.sessionId
    if (callback) callback(true);
    return true;
  }).catch(data => {
    if (callback) callback(false);
    return false;
  })
}
//微信授权登录
const decryptUserInfo = (data = {rawData,signature,encryptedData,iv}, callback) => {
  postRequest(decryptUserInfo_api, data = Object.assign({
    sessionId: base.config.sessionId,
    createIfNecessary: true
  }, data)).then(data => {
    if (callback) callback(true);
  }).catch(data => {
    if (callback) callback(false, data.message);
  })
}

const viewReport = (req)=>{
  return base.createDownloadRequest(req).send()
}

module.exports = {
  init,
  clearJwt,
  postRequest,
  getRequest,
  postRequestSign,
  getRequestSign,
  upload,
  download,
  viewPdf,
  viewJpg,
  login: code2session,
  getUserInfo: decryptUserInfo,
  getLoginUser,
  viewReport
}
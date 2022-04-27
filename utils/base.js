//该文件只能给api.js import，其他任何文件请不要import
import md5 from './md5.js';

const config = {
  // host: "http://localhost:8080",
  host:'http://172.16.62.36:8081',
  esignHost:"http://localhost:3002",  //电子签署地址
  app_id: "genomicsminprogramapi",
  app_secret: "genomics$",
  sessionId: "",
  jwt: ""
}

const getUrl = (api, paras) => {

  for (const key in paras) {
    if (paras[key] == undefined) {
      delete paras[key]
    }
  }
  paras = Object.assign({
    appId: config.app_id,
    t: new Date().getTime()
  }, paras);

  //对数据进行签名
  var signString = sign(paras);

  //添加签名结果
  paras = Object.assign({
    sign: signString
  }, paras);

  //拼接URL地址
  var url = config.host + api + "?"
  var arr = Object.keys(paras);
  for (var i in arr) {
    url = url + (arr[i] + "=" + paras[arr[i]]) + "&";
  }

  //remove last '&'
  return url.substring(0, url.length - 1);
}
const getUrlSign = (api, paras) => {

  for (const key in paras) {
    if (paras[key] == undefined) {
      delete paras[key]
    }
  }
  paras = Object.assign({
    appId: config.app_id,
    t: new Date().getTime()
  }, paras);

  //对数据进行签名
  var signString = sign(paras);

  //添加签名结果
  paras = Object.assign({
    sign: signString
  }, paras);

  //拼接URL地址
  var url = config.esignHost + api + "?"
  var arr = Object.keys(paras);
  for (var i in arr) {
    url = url + (arr[i] + "=" + paras[arr[i]]) + "&";
  }

  //remove last '&'
  return url.substring(0, url.length - 1);
}
/* Ajax GET方法 */
const createGetRequest = req => {
  //default is get
  return createRequest(req);
}
/* Ajax POST方法 */
const createPostRequest = req => {
  return createRequest(Object.assign({
    method: 'POST'
  }, req));
}

/* 电子签署请求Ajax方法 */
const createGetRequestSign = req => {
  //default is get
  return createRequestSign(req);
}
const createPostRequestSign = req => {
  return createRequestSign(Object.assign({
    method: 'POST'
  }, req));
}

/* Ajax 封装请求方法 */
const createRequest = (req = {
  api,
  paras,
  method,
  header,
  data,
}) => {

  var url = getUrl(req.api, req.paras);

  var realRequest = {
    url: url,
    method: req.method || 'GET',
    header: Object.assign({
      "Jwt": config.jwt,
      "X-Requested-With": "XMLHttpRequest"
    }, req.header),
    data: req.data,
  }

  const p = new Promise((resolve, reject) => {
    console.log("发送请求->" + url)
    wx.request(Object.assign({
      success: function(res) {
        console.log(res)
        //注意：第一个字母大写
        if (res.header.Jwt) {
          updateJwt(res.header.Jwt)
        }
        // 请求成功
        if (res.data.state == "ok") {
          resolve(res.data);
        } else {
          //返回401代表没有登录，直接跳到登录页，其他错误码由具体业务处理
          if (res.data.code == 401) {
            //clearJwt()
            wx.reLaunch({
              url: '/pages/home/login/index'
            })
            return;
          }
          reject(res.data);
        }
      },
      error: function(e) {
        reject({
          code: 99,
          message: '网络错误'
        });
      }
    }, realRequest))
  });

  return {
    send: () => p
  }
}

/* Ajax 封装请求方法 电子签署 */
const createRequestSign = (req = {
  api,
  paras,
  method,
  header,
  data,
}) => {

  var url = getUrlSign(req.api, req.paras);

  var realRequest = {
    url: url,
    method: req.method || 'GET',
    header: Object.assign({
      "Jwt": config.jwt,
      "X-Requested-With": "XMLHttpRequest"
    }, req.header),
    data: req.data,
  }

  const p = new Promise((resolve, reject) => {
    console.log("发送请求->" + url)
    wx.request(Object.assign({
      success: function(res) {
        console.log(res)
        //注意：第一个字母大写
        if (res.header.Jwt) {
          updateJwt(res.header.Jwt)
        }
        // 请求成功
        if (res.data.state == "ok") {
          resolve(res.data);
        } else {
          //返回401代表没有登录，直接跳到登录页，其他错误码由具体业务处理
          if (res.data.code == 401) {
            //clearJwt()
            wx.reLaunch({
              url: '/pages/login/authorization/authorization'
            })
            return;
          }
          reject(res.data);
        }
      },
      error: function(e) {
        reject({
          code: 99,
          message: '网络错误'
        });
      }
    }, realRequest))
  });

  return {
    send: () => p
  }
}

/**文件上传 通用方法 */
const createUploadRequest = (req = {
  api,
  paras,
  header,
  data,
  files
}) => {
  var url = getUrl(req.api, req.paras);
  var realRequest = {
    url: url,
    name: "file",
    header: Object.assign({
      "Jwt": config.jwt,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "multipart/form-data"
    }, req.header),
    formData: req.data,
    filePath: req.files,
  }
  const p = new Promise((resolve, reject) => {
    console.log("发送文件上传请求->" + url)
    wx.uploadFile(Object.assign({
      success: function(res) {
        //微信返回的是字符串，需要转化一下
        let ret = JSON.parse(res.data)
        // 请求成功
        if (ret.state == "ok") {
          resolve(ret.data);
        } else {
          //返回401代表没有登录，直接跳到登录页，其他错误码由具体业务处理
          if (ret.code == 401) {
            //clearJwt()
            wx.reLaunch({
              url: '/pages/login/index'
            })
            return;
          }
          reject(ret.message);
        }
      },
      fail: function(e) {
        reject({
          code: 99,
          message: '网络错误'
        });
      },
      complete:function(e){
    	  wx.hideLoading();
      }
    }, realRequest))
  });

  return {
    send: () => p
  }
}

/**文件下载 通用方法 */
const createDownloadRequest = (req = {
  api,
  paras,
  header,
  data
}) => {
  var url = getUrl(req.api, req.paras);
  var realRequest = {
    url: url,
    header: Object.assign({
      "Jwt": config.jwt,
      "X-Requested-With": "XMLHttpRequest"
    }, req.header),
    data: req.data
  }
  const p = new Promise((resolve, reject) => {
    console.log("发送文件下载请求->" + url)
    wx.downloadFile(Object.assign({
      success: function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.tempFilePath.endsWith(".json")) {
            reject("文件获取失败")
            return;
          }
          resolve(res.tempFilePath)
        } else {
          reject("文件获取失败")
        }
      },
      fail: function(err) {
        console.log(err)
        reject("文件获取失败")
      },
      complete: function(res) {
        console.log(res)
        wx.hideLoading()
      }
    }, realRequest))
  });
  return {
    send: () => p
  }
}

/**
 * 对 obj 进行签名，返回签名内容
 * 要保证和后台签名算法一致
 */
const sign = obj => {

  var secret = config.app_secret;

  //生成key升序数组，与后台保存一致
  var arr = Object.keys(obj);
  arr.sort();

  var str = '';
  for (var i in arr) {
    str += arr[i] + obj[arr[i]].toString();
  }

  return md5(str + secret);
}

const updateJwt = (value) => {
  config.jwt = value
  wx.setStorage({
    key: 'jwt',
    data: value
  })
}

module.exports = {
  config: config,
  createGetRequest: createGetRequest,
  createGetRequestSign:createGetRequestSign,
  createPostRequest: createPostRequest,
  createPostRequestSign:createPostRequestSign,
  createUploadRequest: createUploadRequest,
  createDownloadRequest: createDownloadRequest
}
var REQUEST = require('./request.js');
var UTILS = require('./utils.js');
var URL = require('./urls.js');
var TOAST = require('./toast.js');
const app = getApp();

//post请求
function requestPostData(parms,url, success,fail) {
    REQUEST.POST({
        params: parms,
        url: url,
        success: function (res) {
            success(res)
        },
        fail: function (res) {
            // success(res)
            fail(res)
        }
    })
}
//get请求
function requestGetData(parms, url, success, fail) {
    REQUEST.GET({
        params: parms,
        url: url,
        success: function (res) {
            success(res)
        },
        fail: function (res) {
            // success(res)
            fail(res)
        }
    })
}

module.exports = {
    NC_REQUESTPOSTDATA: requestPostData,
    NC_REQUESTGETDATA: requestGetData,
}
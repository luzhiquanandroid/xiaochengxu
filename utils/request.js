const urls = require('./urls.js')
const utils = require('./util.js')
const CRYPTO = require('./JuXiaoLeUtils.js')
var API_URL = urls.HTTP_URL



const app = getApp()
var requestHandler = {
    params: {},
    success: function(res) {
        // success  
    },
    fail: function(res) {
        // fail
    },
}
//GET请求  
function GET(requestHandler) {
    request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
    request('POST', requestHandler)
}

function request(method, requestHandler) {
    //注意：可以对params加密等处理 
    // var params = requestHandler.params;
    // var param = {};
    // param.data = params;
    // param.api = requestHandler.url;


    var params = requestHandler.params;
    var param = {};
    param.data = params;
    param.api = requestHandler.url;
    param.channel = '20180001';
    param.v = '1.7.2';
    param.app = '20181130';
    param.sig = CRYPTO.crypto(param);
    
    wx.request({
        url: API_URL + requestHandler.url,
        data: param,
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        // header: {}, // 设置请求的 header  
        success: function(res) {
            if (res.data.code == 'SESSION_KEY_INVALID') {
                var appInstance = getApp();
                appInstance.globalData.userInfo = {};
                wx.setStorageSync('userInfo', {});
            }
            requestHandler.success(res.data)
        },
        fail: function(res) {
            
        },
        complete: function() {
            // complete  
        }
    })
}


module.exports = {
    GET: GET,
    POST: POST,
}
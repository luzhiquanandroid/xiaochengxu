var REQUEST = require('./request.js');
var UTILS = require('./utils.js');
var URL = require('./urls.js');
const app = getApp();

var success_callback;
var userId;


function _login(success,fail,userinfo,code) {

    let params = new Object()
    params.code = code;
    params.cs = 5;
    params.source = app.globalData.source;
    if (app.globalData.friend && app.globalData.friend != 'undefined') {
      params.friendId = app.globalData.friend;
       
    }
    if (app.globalData.refId && app.globalData.refId != 'undefined'){
        params.refId = app.globalData.refId;
  }
    if (app.globalData.friendHome && app.globalData.friendHome != 'undefined'){
        params.friendHome = app.globalData.friendHome
  }
    if (JSON.stringify(userinfo) != "{}" || JSON.stringify(userinfo) != 'undefined' ) {
        params.encryptedData = userinfo.encryptedData
        params.iv = userinfo.iv
        //params.signature = userinfo.signature
    }
    var loginInfor = {};
    loginInfor.code = code;
    REQUEST.POST({
        url: URL.API_LOGIN,
        params: params,
        success: function (res) {
            app.globalData.msg = res.msg
            if (res.code == 'OK') {
                wx.setStorageSync('userId', res.data.userId)
                userId = String(res.data.userId);
                loginInfor.userId = userId;
                cacheUserInfo(loginInfor);
                var flag = '2';
                app.globalData.flag = '2';
                let scene = String(app.globalData.source);
                if (res.data.flag) {
                    flag = '1';
                    app.globalData.flag = flag;
                }
                if (!UTILS.isEmpty(success)) {
                    success(res);
                
                }
            } else {
                app.globalData.userId = '';
                success(res);
            }
        },
        fail: function (res) {
            app.globalData.userId = '';
            wx.removeStorageSync('userInfo');
        }
    });  
}

/*
登陆
*/

function login(success,fail,userinfo,isCanLogin) {
    wx.checkSession({
        success: function(res){

            wx.login({
                success: function (res) {
                    if (res.code) {
                        if (isCanLogin) {
                            _login(success, fail, userinfo, res.code);
                        } else {
                            if (!isLogin()) {
                                _login(success, fail, userinfo,res.code);
                            } else {
                                 _login(success, fail, userinfo,res.code);
                            }
                        }
                    }
                }
            }); 
            // let code = wx.getStorageSync('codesession');
        },
        fail: function(res){
            wx.removeStorageSync('userInfo');
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.setStorageSync('codesession', res.code)
                        _login(success, fail, userinfo, res.code);
                    }
                },
                fail: function (res) {
                 
                }
            }); 
           
        }
    });
}
/*
清除缓存
*/
function logout() {
    wx.removeStorageSync('userInfo')
    // cacheUserInfo({});
}

function cacheUserInfo(userInfo) {
    var appInstance = getApp();
    appInstance.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
}

/*
判断用户是否登陆
*/
function isLogin() {
    var appInstance = getApp();
    let loginUserinfo = wx.getStorageSync("userInfo");
    appInstance.globalData.userId = loginUserinfo.userId;
    if(appInstance.globalData.userId){
        return true;
    }else{
       return false;
    }
}

/*
去授权页面
*/
function openSetting(success) {
    wx.openSetting({
        success: (res) => {
            if(res.authSetting["scope.userInfo"] == true) {
            }else {
                fail()
            }
        }
    })
}
module.exports = {
    LOGIN: login,
    LOGOUT: logout,
    ISLOGIN: isLogin,
    SETTING: openSetting
}
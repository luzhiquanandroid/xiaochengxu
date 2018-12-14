var REQUEST = require('./request.js');
var UTILS = require('./utils.js');
var URL = require('./urls.js');
var TOAST = require('./toast.js');
const app = getApp();



/*
获取最热游戏
*/

function getIndexHotGame(param,success,fail){
    REQUEST.POST({
        url: URL.API_INDEXHOTGAME,
        params: param,
        success: function (res) {
            if (!UTILS.isEmpty(success)) {
                success(res);
            }
        },
        fail: function (res) {
            if (!UTILS.isEmpty(fail)) {
                success(res);
            } else {
                // TOAST.FAIL('系统错误');
            }
        }
    });
}

/*
获取广告
*/
function getAdList(success,fail){
    REQUEST.POST({
        url: URL.API_ADLIST,
        // params: params,
        success: function (res) {
            if (!UTILS.isEmpty(success)) {
                success(res);
            }
        },
        fail: function (res) {
            if (!UTILS.isEmpty(fail)) {
                success(res);
            } else {
                // TOAST.FAIL('系统错误');
            }
        }
    });
}
/*
获取游戏信息
*/
function getGameList(param,success, fail) {
    REQUEST.POST({
        url: URL.API_GAMELIST,
        params: param,
        success: function (res) {
            success(res);
        },
        fail: function (res) {
        }
    });
}

/*
    上报点击游戏
*/
function reportClickGame(gameId){

    var params = {};
    params.gameId = gameId;
    params.userId = app.globalData.userId;
    
    REQUEST.POST({
        url: URL.API_CLICKGAME,
        params: params,
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            console.log(res)
        }
    });
}

function getGameHistory(currentpage, pagesize, success){
    var params = {};
    params.currentPage = currentpage;
    params.pageSize = pagesize;
    params.userId = app.globalData.userId;
    REQUEST.POST({
        url: URL.API_GAMEHISTORY,
        params: params,
        success: function (res) {
            success(res)
        },
        fail: function (res) {
            success(res)
        }
    });
}

function addShareGame(success){
    if(!app.globalData.userId){
        return;
    }
    if (!app.globalData.friendId){
        return;
    }
    if (!app.globalData.gameId){
        return;
    }
    var params = {};
    params.userId = app.globalData.userId;
    params.friendId = app.globalData.friendId;
    params.gameId = app.globalData.gameId;
    REQUEST.POST({
        url: URL.API_USERSHARE,
        params: params,
        success: function (res) {
            console.log(res)
            success(res)
        },
        fail: function (res) {
            console.log(res)
            success(res)
        }
    });
}

module.exports = {
    GETGAMELIST: getGameList,
    GETADLIST: getAdList,
    REPORTCLICKGAME: reportClickGame,
    GETGAMEHISTORY: getGameHistory,
    ADDGAMESHARE: addShareGame,
    INDEXGAETHOTGAME: getIndexHotGame,
 
}
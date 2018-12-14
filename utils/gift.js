var REQUEST = require('./request.js');
var UTILS = require('./utils.js');
var URL = require('./urls.js');
var TOAST = require('./toast.js');
const app = getApp();

// 消费页所有带礼包的游戏
function getGameGiftlist(param,success,fail){
    REQUEST.POST({
        params: param,
        url: URL.API_GAMEGIFT,
        success: function (res) {
            success(res)
        },
        fail: function (res) {
            // success(res)
        }
    })
}

/*
    某个游戏的所有礼包
*/
function getGameGiftDetail(param,success,fail){
    REQUEST.POST({
        params: param,
        url: URL.API_GIFTLIST,
        success: function (res) {
            success(res)
        },
        fail: function (res) {
            // success(res)
        }
    })
}

/**
 * 礼包兑换
 */
function gameGiftChange(param,success,fail){
    REQUEST.POST({
        params: param,
        url: URL.API_GIFTEXCHANGE,
        success: function (res) {
            success(res)
        },
        fail: function (res) {
            // success(res)
        }
    })
}

module.exports = {
    GETGAMEGIFTLIST: getGameGiftlist,
    GETGAMEGIFTDETAIL: getGameGiftDetail,
    GAMEGIFTCHANGE: gameGiftChange

}
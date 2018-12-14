var REQUEST = require('./request.js');
var URL = require('./urls.js');
const app = getApp();

/*
搜索游戏
*/
function searchList(param,success,fail){
    REQUEST.POST({
        url: URL.API_SEARCHLIST,
        params: param,
        success: function (res) {
            if (res.code == 'OK') {
                success(res);
            }
        },
        fail: function (res) {
            fail(res)
        }
    })
}

/*
搜索首页展示数据
*/
function searchIndex(param, success, fail) {
    REQUEST.POST({
        url: URL.API_SEARCHINDEX,
        params: param,
        success: function (res) {
            if (res.code == 'OK') {
                success(res);
            }
        },
        fail: function (res) {
            fail(res)
        }
    })
}


/*
-删除用户搜索历史记录
*/
function searchDel(param, success, fail) {
    REQUEST.POST({
        url: URL.API_SEARCHDEL,
        params: param,
        success: function (res) {
            if (res.code == 'OK') {
                success(res);
            }
        },
        fail: function (res) {
            fail(res)
        }
    })
}


/*
添加用户反馈
*/
function searchFeedback(param, success, fail) {
    REQUEST.POST({
        url: URL.API_SEARCHFEEDBACK,
        params: param,
        success: function (res) {
            if (res.code == 'OK') {
                success(res);
            }
        },
        fail: function (res) {
            fail(res)
        }
    })
}


/*
获取轮播图
*/
function searchRounding(param, success, fail) {
    REQUEST.POST({
        url: URL.API_SEARCHROUNDSOWING,
        params: param,
        success: function (res) {
            if (res.code == 'OK') {
                success(res);
            }
        },
        fail: function (res) {
            fail(res)
        }
    })
}


module.exports = {
    SEARCHINDEX: searchIndex,
    SEARCHLIST: searchList,
    SEARCHDEL: searchDel,
    SEARCHFEEDBACK: searchFeedback,
    SEARCHROUNDING: searchRounding
}
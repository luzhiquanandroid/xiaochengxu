var indexRequest = require('../../../../utils/indexRequest.js');
var gameRequest = require('../../../../utils/gameRequest.js');
var searchJS = require('../../../../utils/search.js');
var LOGIN = require('../../../../utils/wglogin.js');
const app = getApp()
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        mask: false,
        bgImg: '',
        bgClass: ''
    },
    onshow:function(){
        // 进入常见问题数量
        // *****************************
        wx.reportAnalytics('luck_problem_num', {
        });
        // ****************************
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail
        this.setData({
            userInfo: e.detail,
            hasUserInfo: true
        })
    },
    onGotUserInfo: function (e) {
        if (e.detail.userInfo) {
            app.globalData.userInfo = e.detail
            this.setData({
                userInfo: e.detail,
                hasUserInfo: true
            });
            var that = this;
            LOGIN.LOGIN(function (res) {
                app.globalData.userId = res.userId;
                that.getUserBurning(app.globalData.userId);
            }, function () { }, e.detail, true)
        }
    },
})
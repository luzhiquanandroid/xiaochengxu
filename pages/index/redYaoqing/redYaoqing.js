var indexRequest = require('../../../utils/indexRequest.js');
var gameRequest = require('../../../utils/gameRequest.js');
var searchJS = require('../../../utils/search.js');
var LOGIN = require('../../../utils/wglogin.js');
const app = getApp()
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        mask: false,
        bgImg: '',
        bgClass: '',
        texts:'',
        hasClick: false,
        names:'',
        black:''
    },
    onLoad: function (option){
        console.log(option)
        if (option.friend && option.friend != undefined && option.friend != 'undefined'){
            
            app.globalData.friend = option.friend;
            app.globalData.refId = option.refId;
            
        }
        if (option.name != undefined){
        this.setData({
          name: option.name
        })
        }
        // friendId = option.friendID;
        // refID = option.refID
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            that.setData({
                                userInfo: res,
                                hasUserInfo: true,
                                codeData: false,
                                mask: false,
                                
                            })
                            that.userLogin();
                        }
                    })

                } else {
                    that.userLogin();
                    that.setData({
                        codeData: true,
                        hasUserInfo: false,
                        mask: false,
                    })
                }
            }
                  
   
        })
        wx.getUserInfo({
            success(res) {
                that.setData({
                    nick: res.userInfo.nickName
                })
                
            }
        })
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
                hasUserInfo: true,
                codeData: false,
            });
            var that = this;
            LOGIN.LOGIN(function (res) {
                app.globalData.userId = res.data.userId;
                //进入此页面的用户数量
                // *********************
                if (res.code != "ME_TO_ME") {
                    wx.reportAnalytics('luck_invitation_num', {
                        friendid: app.globalData.friend,
                        userid: res.data.userId,
                    });
                    // 助力红包被邀请人新老用户数量
                    wx.reportAnalytics('luck_beinvited_red_num', {
                        flag: app.globalData.flag,
                        userid: res.data.userId,
                    });
                    // *********************
                }
            // *********************
                that.setData({
                    hasClick: true,
                }); 
                if (res.code == "OK"){
                    that.setData({
                        texts: '助力成功'
                    });
                } else if (res.code == "OLD_USER"){
                    that.setData({
                        texts: res.msg
                    }); 
                } else if (res.code == "HELP_REPEAT") {
                    that.setData({
                        texts: res.msg
                    });
                } else if (res.code == "ASSISTANCE_FAIL") {
                    that.setData({
                        texts: res.msg
                    });
                } else if (res.code == "ME_TO_ME") {
                    that.setData({
                        texts: res.msg
                    });
                } else if (res.code == "IT_DONE") {
                    that.setData({
                        texts: res.msg,
                        black: '返回首页',
                    });
                }else{
                    that.setData({
                        texts: '助力失败'
                    });
                }
            }, function () { }, e.detail, true)

            
        }
    },
    userLogin() {
        var that = this;
        LOGIN.LOGIN(function (res) {
            //进入此页面的用户数量
            // *********************
            if (res.code != "ME_TO_ME"){
                wx.reportAnalytics('luck_invitation_num', {
                    friendid: app.globalData.friend,
                    userid: res.data.userId,
                });
                // 助力红包被邀请人新老用户数量
                wx.reportAnalytics('luck_beinvited_red_num', {
                    flag: app.globalData.flag,
                    userid: res.data.userId,
                });
            // *********************
            }
            // *********************
            
            console.log(res)
            if (res) {
                app.globalData.userId = res.data.userId;
                that.setData({
                    hasClick: true,
                   
                }); 
                if (res.code == "OK") {
                    that.setData({
                        texts: '助力成功',
                        black: '我也玩一玩'
                    });
                } else if (res.code == "OLD_USER") {
                    that.setData({
                        texts: res.msg,
                        black: '返回首页',
                    });
                } else if (res.code == "HELP_REPEAT") {
                    that.setData({
                        texts: res.msg,
                        black: '返回首页',
                    });
                } else if (res.code == "ASSISTANCE_FAIL") {
                    that.setData({
                        texts: res.msg,
                        black: '返回首页',
                    });
                } else if (res.code == "ME_TO_ME") {
                    that.setData({
                        texts: res.msg,
                        black: '返回首页',
                    });
                } else {
                    that.setData({
                        texts: '助力失败',
                        black: '返回首页',
                    });
                } 
            }
        }, function () { }, that.data.userInfo, false)

    },
    //返回首页
    clickBack: function () {
        wx.redirectTo({
            url: "/pages/newIndex/newIndex",
        })
    }
})
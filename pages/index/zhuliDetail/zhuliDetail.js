var indexRequest = require('../../../utils/indexRequest.js');
var gameRequest = require('../../../utils/gameRequest.js');
var searchJS = require('../../../utils/search.js');
var LOGIN = require('../../../utils/wglogin.js');
var request = require('../../../utils/request.js');

var UTL = require('../../../utils/urls.js');
var reward_timer = null;
var id = '';

const app = getApp()
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        mask: false,
        bgImg: '',
        bgClass: '',
        lastTime: '00:00:00',
        listImage: {},
        state: '',
        haveInHand: true,
        haveFinish: false,
        haveInvalid: false,
        btnDisabled: '',
        timeLook: false
    },
    onLoad: function (option) {
        this.countDown(option.remainingTime);
        id = option.id,
        app.globalData.refId = option.id


    },
    /**
 * 生命周期函数--监听页面显示
 */
    onShow: function () {
        var that = this;
        // 列表页进入红包详情页面
        wx.reportAnalytics('luck_listinred_num', {
        });
        // **********************
        var data = {
            'userId': app.globalData.userId
        };
        wx.request({
            url: UTL.HTTP_URL + '/api/user/getUserInfo',
            data: { data },
            method: 'POST',
            success: function (res) {
                that.setData({
                    headimg: res.data.data.data.headImage,
                    nickName: res.data.data.data.nickName
                })
            },
            fail: function (res) {

            },
        })
        var data = {
            userId: app.globalData.userId,
            type: '1',
            id: id
        }
        wx.request({
            url: UTL.HTTP_URL + '/api/person/detail',
            data: { data },
            method: 'POST',
            success: function (res) {
                console.log()
                that.setData({
                    listImage: res.data.data.data.invitationJoinList
                })
                if (res.data.data.data.status == 0) {
                    that.setData({
                        state: '未开启',
                        haveInHand: true,
                        haveFinish: false,
                        haveInvalid: false,
                        timeLook: true
                    })
                } else if (res.data.data.data.status == 1) {
                    that.setData({
                        state: '邀请好友助力',
                        haveInHand: true,
                        haveFinish: false,
                        haveInvalid: false,
                        timeLook: true
                    })
                } else if (res.data.data.data.status == 2) {
                    that.setData({
                        state: '立即领取',
                        haveInHand: false,
                        haveFinish: true,
                        haveInvalid: false,
                        timeLook: false,
                    })
                } else if (res.data.data.data.status == 3) {
                    that.setData({
                        state: '助力失效',
                        haveInHand: false,
                        haveFinish: false,
                        haveInvalid: true,
                        timeLook: false,

                    })
                } else if (res.data.data.data.status == 4) {
                    that.setData({
                        state: '已领取',
                        haveInHand: false,
                        haveFinish: false,
                        haveInvalid: true,
                        btnDisabled: 'disabled',
                        timeLook: false,
                    })
                }
            },
            fail: function (res) {
            },
        })
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    
                    wx.getUserInfo({
                        success: res => {
                            console.log(res)
                            
                        }
                    })

                } else {

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
                hasUserInfo: true
            });
            var that = this;
            LOGIN.LOGIN(function (res) {
                app.globalData.userId = res.userId;
                that.getUserBurning(app.globalData.userId);
            }, function () { }, e.detail, true)
        }
    },
    userLogin() {
        var that = this;
        var data = {};
        LOGIN.LOGIN(function (res) {
            if (res) {
                console.log(res)
                app.globalData.userId = res.data.userId;
                data = {
                    "userId": res.data.userId,
                }
                wx.request({
                    url: UTL.HTTP_URL + '/api/user/getUserInfo',
                    data: { data },
                    method: 'POST',
                    success: function (res) {

                    },
                    fail: function (res) {

                    },
                })
            }


        }, function () { }, that.data.userInfo, false)

    },
    /**
  * 用户点击右上角分享
  */
    // onShareAppMessage: function () {

    // }
    onShareAppMessage(e) {
    //   *********************
    // 点击助力红包分享按钮新老用户数量
        wx.reportAnalytics('luck_clickbtnred_num', {
            flag: app.globalData.flag,
            userid: app.globalData.userId,
        });
        // **********************
        // 分享用户数量
        // **********************
        wx.reportAnalytics('luck_share_num', {
            flag: app.globalData.flag,
            userid: app.globalData.userId,
            share: '助力红包',
        });
        /*
             微信点击首页分享按钮
        */
        wx.reportAnalytics('click_invitep_times', {});
        return {
            title: '求帮忙助力开启话费红包',
            imageUrl: '/pages/images/fenxiangRed.png',
            path: 'pages/index/redYaoqing/redYaoqing?friend=' + app.globalData.userId + "&refId=" + app.globalData.refId + "&name=" + this.data.nickName
        }

    },
    countDown: function (times) {
        var times_time = times;
        var _this = this;
        reward_timer = setInterval(function () {
            var hour = 0,
                minute = 0,
                second = 0; //时间默认值
            if (times_time > 0) {
                hour = Math.floor(times_time / (60 * 60));
                minute = Math.floor(times_time / 60) - (hour * 60);
                second = Math.floor(times_time) - (hour * 60 * 60) - (minute * 60);
            }
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            var time = hour + ":" + minute + ":" + second;
            _this.setData({
                lastTime: time
            })
            times_time--;
            if (times_time <= 0) {
                clearInterval(reward_timer);
            }
        }, 1000);

        if (times_time <= 0) {
            clearInterval(reward_timer);
            _this.setData({
                lastTime: '免费抽奖'
            })
        }
    },
    
    clickReceive: function () {
        var that = this
        if (that.data.haveInvalid) {
            return;
        }
        var params = {};
        params.userId = app.globalData.userId;
        params.type = 1;
        params.recordId = id;
        request.POST({
            url: UTL.API_RECEIVE,
            params: params,
            success: function (res) {
                that.setData({
                    btnDisabled: 'disabled',
                    state: '已领取',
                    haveInHand: false,
                    haveFinish: false,
                    haveInvalid: false

                });
                var data = {
                    userId: app.globalData.userId,
                    type: '1',
                    id: id
                }
                wx.request({
                    url: UTL.HTTP_URL + '/api/person/detail',
                    data: { data },
                    method: 'POST',
                    success: function (res) {
                        console.log(res.data.data.data.invitationJoinList)
                        that.setData({
                            listImage: res.data.data.data.invitationJoinList
                        })

                    },
                    fail: function (res) {
                    },
                })
            },
            fail: function (res) {
                fail(res)
            },
        });
    }
})
var indexRequest = require('../../../utils/indexRequest.js');
var gameRequest = require('../../../utils/gameRequest.js');
var searchJS = require('../../../utils/search.js');
var LOGIN = require('../../../utils/wglogin.js');
var request = require('../../../utils/request.js');
var UTL = require('../../../utils/urls.js');
var REQUEST = require('../../../utils/taskRequest.js');
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
        haveInHand: false,
        haveFinish: false,
        haveInvalid: false,
        btnDisabled: '',
        painting: {},
        timeLook:false,
        headimg:'',
        nickName:'',
        images:'',
        
    },
    onLoad: function (option) {
        this.countDown(option.remainingTime);
        id = option.id


    },
    /**
 * 生命周期函数--监听页面显示
 */
    onShow: function () {
        var that = this;
        var params = {};
        params.friend = app.globalData.userId;
        params.refId = id;
        // 获取分享图片链接
        REQUEST.NC_REQUESTPOSTDATA(params, UTL.API_GETiMG, function (res) {
            that.setData({
                images: res.data.data
            })

        }, function (res) {

        })
        //列表页进入宝箱详情数量 *****************************
        wx.reportAnalytics('luck_listinbaoxiang_num', {
        });
        // *********************
        wx.showLoading({
            title: '加载中',
        })

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
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        
                        success: res => {
                            var data = {
                                userId: app.globalData.userId,
                                type: '2',
                                id: id
                            }
                            wx.request({
                                url: UTL.HTTP_URL +'/api/person/detail',
                                data: { data },
                                method: 'POST',
                                success: function (res) {
                                    wx.hideLoading();
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
                                            timeLook:true
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

    onShareAppMessage(e) {
    // 点击宝箱分享按钮新老用户数量
    // ****************************
            wx.reportAnalytics('luck_baoxiangclick_num', {
                flag: app.globalData.flag,
                userid: app.globalData.userId,
            });
    // ********************************
        // 分享用户数量
        // **********************
        wx.reportAnalytics('luck_share_num', {
            flag: app.globalData.flag,
            userid: app.globalData.userId,
            share: '百宝箱',
        });
        /*
             微信点击分享按钮
        */
        wx.reportAnalytics('click_invitep_times', {});
        return {
            title: '我收到一个宝箱，需要你的帮助',
            imageUrl: '/pages/images/xiangyao.png',
            path: 'pages/index/xiangYaoqing/xiangYaoqing?friend=' + app.globalData.userId + "&refId=" + id + "&name=" + this.data.nickName
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
                lastTime: ''
            })
        }
    },
    //领取宝箱
    clickReceive: function () {
        var that = this
        
        if (this.data.haveInvalid){
            return;
        }
        var params = {};
        params.userId = app.globalData.userId;
        params.type = 2;
        params.recordId = id;
        request.POST({
            url: UTL.API_RECEIVE,
            params: params,
            success: function (res) {
                that.setData({
                    btnDisabled: 'disabled'
                });
                var data = {
                    userId: app.globalData.userId,
                    type: '2',
                    id: id
                }
                wx.request({
                    url: UTL.HTTP_URL + '/api/person/detail',
                    data: { data },
                    method: 'POST',
                    success: function (res) {
                        console.log()
                        that.setData({
                            btnDisabled: 'disabled',
                            state: '已领取',
                            haveInHand: false,
                            haveFinish: false,
                            haveInvalid: false,
                            listImage: res.data.data.data.invitationJoinList

                        });


                    },
                    fail: function (res) {
                    },
                })
            },
            fail: function (res) {
                fail(res)
            },
        });
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

    // 截图
    eventSave() {
        wx.showLoading({
            title: '正在保存'
        })
        let that = this;
        setTimeout(function () {
            wx.hideLoading()
        }, 2000)
        wx.getSetting({
            success(res) {
                console.log(res.authSetting['scope.writePhotosAlbum'])
                var falg = res.authSetting['scope.writePhotosAlbum']
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.hideLoading()
                    wx.showModal({
                        content: '打开设置授权保存图片到相册',
                        success: function (res) {
                            console.log(res)
                            if (falg == false) {
                                wx.openSetting({
                                    success(res) {
                                        console.log(res.authSetting)
                                        console.log(22222222222222222222)
                                        // res.authSetting = {
                                        // "scope.userInfo": true,
                                        // "scope.userLocation": true
                                        // }
                                    }
                                })
                            }
                            if (res.confirm) {
                                wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success() {
                                        wx.saveImageToPhotosAlbum({
                                            filePath: that.data.shareImage,
                                            success(res) {
                                                // 保存到相册人数
                                                wx.reportAnalytics('save_album_number', {
                                                });
                                                wx.hideLoading()
                                                wx.showToast({
                                                    title: '保存图片成功',
                                                    icon: 'success',
                                                    duration: 2000
                                                })
                                            }
                                        })
                                    },
                                    fail() {
                                        wx.hideLoading()
                                    }
                                })
                            } else {
                                wx.hideLoading()
                            }
                        }
                    });
                } else {
                    wx.saveImageToPhotosAlbum({
                        filePath: that.data.shareImage,
                        success(res) {
                            // 保存到相册人数
                            wx.reportAnalytics('save_album_number', {
                            });
                            wx.showToast({
                                title: '保存图片成功',
                                icon: 'success',
                                duration: 2000
                            })
                            wx.hideLoading()
                        },
                        fail(res) {
                            wx.hideLoading()
                        }
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },
    drawerDiary: function () {
        
        var that = this;
        console.log(that.data.images)
        var listViews = new Array();
        listViews.push({
            type: 'image',
            url: '/pages/images/bg.png',
            top: 0,
            left: 0,
            width: 750,
            height: 1334
        });

        listViews.push({

            type: 'text',
            content: "百宝箱",
            fontSize: 36,
            color: '#fff',
            textAlign: 'center',
            width: 750,
            left: 370,
            top: 60
        });

        listViews.push({
            type: 'image',
            url: that.data.headimg,
            top: 163,
            left: 314,
            width: 112,
            height: 112
            //  content: that.data.newnum + that.data.Company,
        });
        listViews.push({
            type: 'image',
            url: '/pages/images/mask.png',
            top: 140,
            left: 290,
            width: 159,
            height: 159
            //  content: that.data.newnum + that.data.Company,
        });
        listViews.push({

            type: 'text',
            content: that.data.nickName,
            fontSize: 27,
            color: '#FFF',
            textAlign: 'center',
            width: 200,
            left: 370,
            top: 297
        });
        listViews.push({
            type: 'image',
            url: that.data.images,
            top: 1005,
            left: 300,
            width: 153,
            height: 153
            //  content: that.data.newnum + that.data.Company,
        });

        listViews.push({

            type: 'text',
            content: '我捡到了一个宝箱，你也来试试吧！',
            fontSize: 32,
            color: '#FFF',
            textAlign: 'center',
            width: 200,
            left: 385,
            top: 1199
        });
        this.setData({
            painting: {
                width: 750,
                height: 1334,
                clear: true,

                views: listViews
            }
        })
    },
    eventGetImage(event) {
        console.log(event)
        const {
            tempFilePath
        } = event.detail
        this.setData({
            shareImage: tempFilePath
        })
        if (tempFilePath) {
            this.eventSave();
        }
    },

})
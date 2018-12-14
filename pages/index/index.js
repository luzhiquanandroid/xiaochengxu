var LOGIN = require('../../utils/wglogin.js');
var indexRequest = require('../../utils/indexRequest.js');
var UTL = require('../../utils/urls.js');
var REQUEST = require('../../utils/taskRequest.js');
var request = require('../../utils/request.js');

import NumberAnimate from "../../utils/NumberAnimate";


var awardIndexs;
var remainingTime;
var refID;
const app = getApp()
var mask;
var type = '';
var zuanshi = 0;
var reward_timer = null;
var scene_addWx = '';
var laiyuan = '';
var scene_haoWx = ''
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        mask: false,
        bgImg: '',
        bgClass: '',
        codeData: true,
        hasUserInfo: false,
        userInfo: {},
        btnBao: true,
        usersId: '',
        zuan: 0,
        huafei: 0,
        listImage: {},
        quanmin: false,
        navUrl: {},
        mount: '',
        arrPeople:{} ,
        Surplus:"",
        diamondCollar:false,
        get_diamond:false,
        canShare:true,
        radiusTrue:false,
        nick:''

    },
    onLoad: function (opt) {
        app.globalData.friend = '';
        app.globalData.refId = '';
        app.globalData.friendHome = opt.friendHome

    },
    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (res) {
        app.globalData.refId = ""
       
        wx.showLoading({
            title: '加载中',
        })

        var that = this;
        
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {   
                            if (mask == true) {
                                that.setData({
                                    mask: true,
                                })
                            } else {
                                that.setData({
                                    mask: false,
                                })
                            }
                            that.setData({
                                userInfo: res,
                                hasUserInfo: true,
                                codeData: false,

                            })
                            that.userLogin();
                            // 数据成功后，停止下拉刷新
                            wx.stopPullDownRefresh();
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
    /**

  * 生命周期函数--监听页面卸载

  */

    onHide: function () {

        clearInterval(reward_timer);

    },
    onPullDownRefresh() {
        clearInterval(reward_timer);
      this.onShow();
    },

    // 点击按钮转动转盘
    getLottery: function (e) {
        REQUEST.NC_REQUESTGETDATA({}, 'api/random/game', function (res) {
            that.setData({
                navUrl: res.data
            })
        }, function (fail) {
        })
        var that = this

        if (that.data.zuan < 5) {
            wx.showToast({
                title: '钻石不足',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (that.data.huafei >= 99) {
            wx.showToast({
                title: '话费金额已达上限，请提取后再进行操作',
                icon: 'none',
                duration: 4000
            })
            return;
        }
        that.setData({
            bgImg: '',
            btnBao: true,
            quanmin: false,
            mask: false,
            btnDisabled: 'disabled'
        })
        let userId = String(app.globalData.userId);
        var awardIndex;
        //获取后台返回奖品数
        var data = {
            'userId': app.globalData.userId
        };
        var params = {};
        params.userId = app.globalData.userId;
        request.POST({
            url: UTL.API_LUCK,
            params: params,
            success: function (res) {
                if(res.code == "OK"){
                    if (zuanshi < 5) {
                        zuanshi = zuanshi

                    } else {
                        zuanshi = zuanshi - 5
                    }
                    app.globalData.onlodeNum = zuanshi
                    that.setData({
                        zuan: zuanshi,

                    });
                    // 给转盘传值，后台返回值减一
                    // console.log(res)
                    if (res.data.data.type == '6') {
                        awardIndex = '4'
                    } else {
                        awardIndex = res.data.data.type - 1;
                    }
                    app.globalData.type = res.data.data.type,
                    // awardIndex = '4'
                    // app.globalData.type = 6
                        app.globalData.recordId = res.data.data.id,
                        awardIndexs = awardIndex
                    // 转盘转动后获取最新的钻石数量与话费
                    wx.request({
                        url: UTL.HTTP_URL + '/api/user/getUserInfo',
                        data: { data },
                        method: 'POST',
                        success: function (res) {

                        },
                        fail: function (res) {

                        },
                    })
                    // 获取奖品配置
                    var awardsConfig = app.awardsConfig,
                        runNum = 8
                    // 旋转抽奖
                    app.runDegs = app.runDegs || 0
                    app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / 7))


                    var animationRun = wx.createAnimation({
                        duration: 4000,
                        timingFunction: 'ease'
                    })
                    that.animationRun = animationRun
                    animationRun.rotate(app.runDegs).step()
                    that.setData({
                        animationData: animationRun.export(),
                        btnDisabled: 'disabled'
                    })
                    // 中奖提示
                    setTimeout(function () {
                        that.setData({

                            bgImg: '',
                        })
                        mask = true
                        // 1 助力话费弹窗  2 宝箱弹窗  3随机话费弹窗 4 钻石奖励 5 幸运奖
                        if (app.globalData.type == 1) {
                            that.setData({
                                bgImg: '/pages/images/zhuli.png',
                                bgClass: "zhuli",
                                btnBao: true,
                                quanmin: false,
                                mask: true,

                            })
                        } else if (app.globalData.type == 2) {

                            that.setData({
                                bgImg: '/pages/images/baoxiang.png',
                                bgClass: "baoxiang",
                                btnBao: false,
                                quanmin: false,
                                mask: true,
                            })
                        } else if (app.globalData.type == 3) {

                            that.setData({
                                bgImg: '/pages/images/suiji.png',
                                bgClass: "suiji",
                                btnBao: true,
                                quanmin: false,
                                mask: true,
                            })
                        } else if (app.globalData.type == 4) {
                            that.setData({
                                bgImg: '',
                                mask: false,
                                bgClass: "",
                                btnBao: true,
                                quanmin: false
                            })
                            mask = false
                            // 抽到钻石奖之后获取最新钻石数量
                            wx.request({
                                url: UTL.HTTP_URL + '/api/user/getUserInfo',
                                data: { data },
                                method: 'POST',
                                success: function (res) {
                                    that.setData({
                                        zuan: zuanshi,
                                    });
                                    let beforZuan = res.data.data.data.allDiamond
                                    app.globalData.loops = beforZuan - zuanshi
                                    app.globalData.increment = 1
                                    let n1 = new NumberAnimate({
                                        from: beforZuan,
                                        speed: 1000,
                                        refreshTime: 100,
                                        decimals: 0,
                                        onUpdate: () => {
                                            that.setData({
                                                zuan: n1.tempValue
                                            });
                                        },
                                        onComplete: () => {

                                        }
                                    });

                                    zuanshi = res.data.data.data.allDiamond
                                },
                                fail: function (res) {

                                },
                            })

                        } else if (app.globalData.type == 5) {
                            that.setData({
                                bgImg: '/pages/images/quanmin.png',
                                bgClass: "quanmin",
                                btnBao: true,
                                quanmin: true,
                                mask: true,
                            })
                        } else if (app.globalData.type == "6") {
                            that.setData({
                                bgImg: '/pages/images/onlineRetailers.png',
                                bgClass: "quanmin",
                                btnBao: true,
                                quanmin: false,
                                mask: true,
                            })
                        } else {
                            that.setData({
                                bgImg: '',
                                mask: false,
                                bgClass: "",
                                btnBao: true,
                                quanmin: false
                            })
                        }
                        if (awardsConfig.chance) {
                            that.setData({
                                btnDisabled: '',
                            })
                        }
                    }, 4000);
                }

            },
            fail: function (res) { },
        });
    },
    // 配置并且画出转盘
    onReady: function (e) {

        var that = this;

        // getAwardsConfig
        app.awardsConfig = {
            chance: true,
            awards: [
                { 'index': 0, 'name': '助力话费' },
                { 'index': 1, 'name': ' 宝箱' },
                { 'index': 2, 'name': ' 随机话费' },
                { 'index': 3, 'name': '10钻石' },
                { 'index': 4, 'name': '幸运奖' },
                { 'index': 5, 'name': '1元话费' },
                { 'index': 6, 'name': '5元话费' }
            ]
        }

        // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))


        // 绘制转盘
        var awardsConfig = app.awardsConfig.awards,
            len = awardsConfig.length,
            rotateDeg = 360 / len / 2 + 90,
            html = [],
            turnNum = 1 / len  // 文字旋转 turn 值
        that.setData({
            btnDisabled: app.awardsConfig.chance ? '' : 'disabled'
        })
        var ctx = wx.createCanvasContext()
        for (var i = 0; i < len; i++) {
            // 保存当前状态
            ctx.save();
            // 开始一条新路径
            ctx.beginPath();
            // 位移到圆心，下面需要围绕圆心旋转
            ctx.translate(150, 150);
            // 从(0, 0)坐标开始定义一条新的子路径
            ctx.moveTo(0, 0);
            // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
            ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
            // 绘制圆弧
            ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

            // 颜色间隔
            if (i % 2 == 0) {
                ctx.setFillStyle('rgba(255,184,32,.1)');
            } else {
                ctx.setFillStyle('rgba(255,203,63,.1)');
            }

            // 填充扇形
            ctx.fill();
            // 绘制边框
            ctx.setLineWidth(0.5);
            ctx.setStrokeStyle('rgba(228,55,14,.1)');
            ctx.stroke();

            // 恢复前一个状态
            ctx.restore();

            // 奖项列表
            html.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awardsConfig[i].name });
        }
        that.setData({
            awardsList: html
        });


    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail
        this.setData({
            userInfo: e.detail,
            hasUserInfo: true
        })
    },


    onGotUserInfo: function (e) {

        var parms = {};
        parms.img = e.detail.userInfo,
        parms.name = e.detail.nickName
        wx.setStorage({
            key: 'info',
            data: parms,
            success: function (res) {
            }
        })
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
                // ****************************
                // 点击授权用户数量
                wx.reportAnalytics('luck_clicklogin_num', {
                    flag: app.globalData.flag,
                    userid: String(res.data.userId),
                });
                // ****************************


            }, function () { }, e.detail, true)
        }
    },

    userLogin() {
        var that = this;
        var data = {};
        LOGIN.LOGIN(function (res) {
            if (res) {
                app.globalData.userId = res.data.userId;
                data = {
                    "userId": res.data.userId,
                }
                // 进入首页新老用户数量统计
                wx.reportAnalytics('luck_index_flag_num', {
                    flag: app.globalData.flag,
                    userid: String(res.data.userId),
                });
                // ****************************
               
                var params = {};
                params.userId = app.globalData.userId;
                // 获取钻石和话费信息
                REQUEST.NC_REQUESTPOSTDATA(params, UTL.API_USER, function (res) {
                    wx.hideLoading();
                    that.setData({
                        zuan: res.data.data.allDiamond,
                        huafei: res.data.data.allMount
                    });
                    zuanshi = res.data.data.allDiamond
                }, function (res) {

                })
                // 获取首页邀请人头像
                REQUEST.NC_REQUESTPOSTDATA(params, UTL.API_HOMELIST, function (res) {


                    if (res.data.data.length == "10") {
                        that.setData({
                            canShare: false
                        })
                    } else {
                        that.setData({
                            canShare: true
                        })
                    }
                    var arrPeoples = [{ headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }, { headImage: '/pages/images/btnYao.png', nickname: '' }];
                    arrPeoples.splice(0, res.data.data.length)
                    console.log(arrPeoples)
                    var newArrPeoples = res.data.data.concat(arrPeoples)
                    that.setData({
                        arrPeople: newArrPeoples
                    })
                }, function (fail) {
                });
                
                
            }
        }, function () { }, that.data.userInfo, false)

    },
    /*弹窗显示与隐藏*/
    clickMask: function () {
        this.setData({
            mask: false,
            bgImg: '',
            btnBao: true,
        })
        mask = false
    },
    clickMaskImg: function () {
        this.setData({
            mask: true
        })
    },
    /*跳转*/
    clickJump: function () {

        var that = this;
        mask = false;

        that.setData({
            mask: false,
            btnBao: true,
            quanmin: false
        })

        var params = {};
        params.userId = app.globalData.userId;
        params.type = app.globalData.type;
        params.recordId = app.globalData.recordId;
        if (app.globalData.type == 3) {

            request.POST({
                url: UTL.API_RANDOM,
                params: params,
                success: function (res) {
                    app.globalData.redRandom = res.data.data.mount
                    wx.navigateTo({
                        url: "/pages/index/randomRed/randomRed",
                    })
                },
                fail: function (res) {
                    fail(res)
                },
            });

        } else if (app.globalData.type == 1) {
            request.POST({
                url: UTL.API_OPEN,
                params: params,
                success: function (res) {
                    remainingTime = res.data.data.remainingTime,
                        refID = res.data.data.refID
                    wx.navigateTo({
                        url: "/pages/index/zhuliRed/zhuliRed?times=" + remainingTime + "&refId=" + refID,
                    })
                },
                fail: function (res) {
                    fail(res)
                },
            });
            that.setData({
                mask: false,

            })
        } else if (app.globalData.type == 2) {
            request.POST({
                url: UTL.API_OPEN,
                params: params,
                success: function (res) {
                    remainingTime = res.data.data.remainingTime,
                        refID = res.data.data.refID
                    wx.navigateTo({
                        url: "/pages/index/baibaoxiang/baibaoxiang?times=" + remainingTime + "&refId=" + refID,
                    })
                },
                fail: function (res) {
                    fail(res)
                },
            });
            that.setData({
                mask: false,

            })
        } else if (app.globalData.type == 5) {
            mask = false
            // 点击幸运奖允许用户数量
            // ***********************************
            wx.reportAnalytics('luck_clickgameid_num', {
                appid: that.data.navUrl.data.appId,
                userid: app.globalData.userId,
            });
            // ***********************************
            that.setData({
                mask: false,

            })
        } else if (app.globalData.type == 6) {
            wx.navigateTo({
                url: "/pages/index/onlineRetailers/onlineRetailers",
            })
        }
    },
    // 跳转个人中心
    clickUser: function () {
        // 点击“XXX元”此按钮的新老用户数量
        wx.reportAnalytics('luck_clickmoney_num', {
            flag: app.globalData.flag,
            userid: String(app.globalData.userId),
        });
        // **************************
        wx.navigateTo({
            url: "/pages/index/userCore/userCore",
        })
    },
    // 钻石数量增加效果
    animate: function () {
        var that = this;
        this.setData({
            mount: zuanshi,

        });
        let mount = zuanshi;
        let n1 = new NumberAnimate({
            from: mount,
            speed: 1000,
            refreshTime: 100,
            decimals: 0,
            onUpdate: () => {
                this.setData({
                    mount: n1.tempValue
                });
            },
            onComplete: () => {

            }
        });
    },
    onShareAppMessage(e) {

        console.log(app.globalData.userId)
        if (e.from =='menu'){
            // 分享用户数量
            // **********************
            wx.reportAnalytics('luck_share_num', {
                flag: app.globalData.flag,
                userid: app.globalData.userId,
                share: '抽奖-目录邀请好友-使用数量',
            });
            wx.reportAnalytics('click_invitep_times', {});
            return {
                title: this.data.nick + '@你，我正在免费提取话费，你也快来吧！！',
                imageUrl: '/pages/images/indexShare.jpg',
                path: 'pages/newIndex/newIndex?laiyuan=' + '1'
            }
        } else if (e.from == "button" && e.target.dataset.button == "1234") {
            // 分享用户数量
            // **********************
            wx.reportAnalytics('luck_share_num', {
                flag: app.globalData.flag,
                userid: app.globalData.userId,
                share: '抽奖页-邀请好友-使用数量',
            });
            wx.reportAnalytics('click_invitep_times', {});
            return {
                title: this.data.nick+'@你，我正在免费提取话费，你也快来吧！！',
                imageUrl: '/pages/images/indexShare.jpg',
                path: 'pages/newIndex/newIndex?friendHome=' + app.globalData.userId +"&laiyuan="+'3'
            }
        }
        if (e.from == "button" && e.target.dataset.button == "1234" && this.data.arrPeople.length < '10'){
            return
        }
    },
    // 点击得钻石跳转
    getDiamond: function () {
        wx.navigateTo({
            url: "/pages/index/getDiamonds/getDiamonds"
        })
    },
    // 时间倒计时
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
                Surplus: time
            })
            times_time--;
            if (times_time <= 0) {
                clearInterval(reward_timer);
            }
        }, 1000);

        if (times_time <= 0) {
            clearInterval(reward_timer);
            _this.setData({
                Surplus: ''
            })
        }
    }, 
// 领取钻石弹窗消失
    diamondCollarHide:function(){
        this.setData({
            diamondCollar: false,
            get_diamond: false
        })
    },
// 
// 跳转宝箱列表
treasureChest:function(){
    wx.navigateTo({
        url: "/pages/index/userCore/boxList/boxList",
    })
},
// 跳转助力红包列表
clickBill: function () {
    wx.navigateTo({
        url: "/pages/index/userCore/redEnvelopes_list/redEnvelopes_list",
    })
},
// 跳转提取话费页面
    extract: function () {
        wx.navigateTo({
            url: "/pages/index/userCore/huafei/huafei"
        })
    },
// 跳转个人中心
    personalCenter: function () {
        wx.navigateTo({
            url: "/pages/index/userCore/userCore"
        })
    }
})


var LOGIN = require('../../../utils/wglogin.js');
var indexRequest = require('../../../utils/indexRequest.js');
var URL = require('../../../utils/urls.js');
var REQUEST = require('../../../utils/taskRequest.js');
var request = require('../../../utils/request.js');
let diamondsNum = ""
const app = getApp()
let clickType = ''
Page({

    data: {
        indexs: '',
        arr: {},
        signIn_mask: false,
        addGameMask: false,
        gongGameMask: false,
        everyArr: {},
        days: '',
        gameArr: {},
        newTask: '',
        storetime: '',
        taskType: '',
        everyBox: false,
        gameBox: false,
        goFlg: true,
        nolist: false,
        diamondMission:false,
        finishMission:false

    },
    
    onLoad: function (opt) {
        console.log(opt)
        clickType = opt.clickType
        if (opt.clickType == '1'){
            this.setData({
                diamondMission:true,
                finishMission: false
            })
        }else{
            this.setData({
                diamondMission: false,
                finishMission: true
            })
        }
    },
    onShow: function () {
        // ****************************
        // 进入“得钻石”界面的用户数量
        wx.reportAnalytics('luck_getdoamon_num', {
            userid: app.globalData.userId,
        });
        // ****************************
        var that = this
        // 每日任务列表
        var params = {};
        params.userId = app.globalData.userId;


        // 获取每日任务列表
        REQUEST.NC_REQUESTPOSTDATA(params, URL.API_EVERYDAY, function (res) {
            // if (res.data.everyDayTaskList.length == '0') {
            //     that.setData({
            //         everyBox: false
            //     })
            // } else {
            //     that.setData({
            //         everyBox: true
            //     })
            // }
            // if (res.data.trySmallGameList.length == '0') {
            //     that.setData({
            //         gameBox: false
            //     })
            // } else {
            //     that.setData({
            //         gameBox: true
            //     })
            // }
            // if (res.data.everyDayTaskList.length == '0' && res.data.trySmallGameList.length == '0') {
            //     // ****************
            //     // 得钻石-清空任务人数
            //     wx.reportAnalytics('luck_nolist_num', {
            //         userid: app.globalData.userId,
            //     });
            //     // *******************
            //     that.setData({
            //         nolist: true
            //     })
            // }
            if (clickType == "1" && res.data.everyDayTaskList.length != '0'){
                that.setData({
                    gameBox: false,
                    everyBox: true
                })
            }
            if (clickType == "1" && res.data.everyDayTaskList.length == '0'){
                that.setData({
                    gameBox: false,
                    everyBox: false,
                    nolist: true
                })
            }
            if (clickType == "2" && res.data.trySmallGameList.length != '0') {
                that.setData({
                    everyBox: false,
                    gameBox: true
                })
            }
            if (clickType == "2" && res.data.trySmallGameList.length == '0') {
                that.setData({
                    everyBox: false,
                    gameBox: false,
                    nolist: true
                })
            }
            that.setData({
                everyArr: res.data.everyDayTaskList,
                gameArr: res.data.trySmallGameList,
            })
        }, function (res) {

        })
        let pars = wx.getStorageSync('task_active_time');
        console.log(pars)
        var timestamp = Date.parse(new Date());
        var adId = 'task_active_time';
        var timeParams = wx.getStorageSync(adId);
        let count = timeParams.residenceTime;
        var time = timestamp - timeParams.timestamp;
        let tips = `需要超过${count}秒才可以获取奖励哦`
        let awardValues = timeParams.awardValue
        if (timeParams) {

            if (time / 1000 < count) {
                
                this.data.taskId = timeParams.id
                this.setData({
                    goFlg: true
                })
                if (this.data.goFlg) {
                    wx.showModal({
                        title: '温馨提示',
                        content: tips,
                        showCancel: false
                    })
                }


                wx.removeStorageSync(adId);
            } else {
                var that = this;
                this.setData({
                    goFlg: false
                })
                this.data.taskId = '';
                var params = {};
                params.userId = app.globalData.userId
                params.taskId = pars.taskId
                params.taskType = pars.taskType
                request.POST({
                    url: URL.API_DOTASK,
                    params: params,
                    success: function (res) {
                        if (res.code == "OK") {
                            // ****************
                            // 得钻石-任务完成人数
                            wx.reportAnalytics('luck_finishdoam_num', {
                                userid: params.userId,
                                taskid: params.taskId,
                            });
                            // ****************
                            
                            wx.showToast({
                                title: '钻石+' + awardValues,
                                icon: 'none',
                                duration: 2000
                            })
                            that.onShow()
                        }


                    },
                    fail: function (res) {
                    },
                });
                wx.removeStorageSync(adId);
            }
        }



    },
    // 点击事件弹窗
    clickMask: function (e) {
        var that = this;
        let _id = e.currentTarget.dataset.tasktype
        if (_id == '4') {
            // 获取每日任务列表 
            var params = {};
            params.userId = app.globalData.userId;
            request.POST({
                url: URL.API_SIGNIN,
                params: params,
                success: function (res) {
                    if (res.code == "OK") {
                        // ****************
                        // 得钻石-任务完成人数
                        wx.reportAnalytics('luck_finishdoam_num', {
                            userid: params.userId,
                            taskid: '4',
                        });
                        // ****************
                        var num = 0;
                        for (let i in res.data.data) {
                            if (res.data.data[i].signIn == true) {
                                num++
                            }
                        }
                        that.setData({
                            arr: res.data.data,
                            days: num,
                            signIn_mask: true
                        })
                    } else {
                        wx.showToast({
                            title: '今日已经签到',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function (res) {
                    fail(res)
                },
            });
        } else if (_id == '1') {
            // 添加小程序（g）-页面进入用户数
            wx.reportAnalytics('luck_add_num', {
                userid: app.globalData.userId,
                tasktype: '1',
            });
            var params = {};
            params.userId = app.globalData.userId;
            params.taskType = '1';
            params.taskId = '1'
            request.POST({
                url: URL.API_DOTASK,
                params: params,
                success: function (res) {
                    if(res.code == "OK"){
                        
                    }
                    that.onShow()
                    app.globalData.scene = ""
                },
                fail: function (res) {
                    fail(res)
                },
            });
            this.setData({
                addGameMask: true,
            })
        } else if (_id == '2') {
            // 添加小程序（g）-页面进入用户数
            wx.reportAnalytics('luck_add_num', {
                userid: app.globalData.userId,
                tasktype: '2',
            });
            var params = {};
            params.userId = app.globalData.userId;
            params.taskType = '2';
            params.taskId = '2'
            request.POST({
                url: URL.API_DOTASK,
                params: params,
                success: function (res) {

                    that.onShow()
                },
                fail: function (res) {
                    fail(res)
                },
            });
            this.setData({
                gongGameMask: true,
            })


        }

    },

    noneMask: function () {
        this.setData({
            addGameMask: false,
            signIn_mask: false,
            gongGameMask: false
        })
        this.onShow()

    },
    yuyueMask: function () {
        wx.showToast({
            title: '预约成功',
            icon: 'none',
            duration: 2000
        })
        // ********************
        // 签到-预约签到提醒用户数
        wx.reportAnalytics('luck_yuyue_num', {
            userid: app.globalData.userId,
        });
        // ********************
        this.setData({
            signIn_mask: false
        })
        this.onShow()
    },
    formSubmit: function (e) {
        if (e.detail.target.dataset.type && e.detail.target.dataset.type == 'siginTip') {
            //签名提醒
            var parm = {};
            var that = this;
            parm.userId = app.globalData.userId;
            parm.formId = e.detail.formId;
            parm.boxType = '3';
            parm.remindType = '2';
            REQUEST.NC_REQUESTPOSTDATA(parm, URL.API_QIANDAO, function (res) {

            }, function (res) {

            })
        }
    },
    leaveGame: function (e) {
        console.log(e)
        this.setData({
            goFlg: false
        })
        let timestamp = ""
        let tiem = e.currentTarget.dataset.item.time;
        let userId = app.globalData.userId;
        let taskId = e.currentTarget.dataset.item.id
        let taskType = e.currentTarget.dataset.item.taskType
        let awardValue = e.currentTarget.dataset.item.awardValue

        timestamp = Date.parse(new Date());
        let ClickData = {};
        ClickData.timestamp = timestamp;
        ClickData.taskType = taskType;
        ClickData.taskId = taskId;
        ClickData.residenceTime = tiem;
        ClickData.awardValue = awardValue;
        var adId = 'task_active_time';
        wx.setStorage({
            key: adId,
            data: ClickData,
        })


    },

})
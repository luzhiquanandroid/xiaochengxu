let LOGIN = require('../../utils/wglogin.js');
let indexRequest = require('../../utils/indexRequest.js');
let URL = require('../../utils/urls.js');
let REQUEST = require('../../utils/taskRequest.js');
let request = require('../../utils/request.js');
const app = getApp()
import Allrequire from '../utils/classPage.js'
// import URL from '../../utils/urls.js'
const rq = new Allrequire.morePage
// const userid = "e4291b5220384b54851f768f9f3030ad"
var scene_addWx = '';
var scene_haoWx = ''
let laiyuan = ''
Page({
    data:{
        telephoneBill: '00.0000', 
        diamonds:'00.0000',
        avatarUrl:'',
        nickName:'',
        hasLogin:false,
        userInfo:'',
        receiveList:'',
        everyDatTaskTotal:false,
        trySmallGameTotal:true,
        ruleMask:false,
        num: [7, 5],
        list: [],
        newList: []
    },
    onLoad:function(ops){
        if (ops.laiyuan == undefined){
            laiyuan = 5
        }else{
            laiyuan = ops.laiyuan;
        }
        app.globalData.source = ops.source
        console.log(laiyuan)
        app.globalData.friend = '';
        app.globalData.refId = '';
        app.globalData.friendHome = ops.friendHome
    },
    onShow:function(){
        let that = this;
        
        wx.getSetting({
            success: res =>{
                if (res.authSetting['scope.userInfo']){
                    that.setData({
                        hasLogin:true
                    })
                    wx.getUserInfo({
                        success: res => {
                            that.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                nickName: res.userInfo.nickName,
                            })
                        }
                    })
                }
                that.userLogin()
                
            }            
        })
        let pars = wx.getStorageSync('getUserid');
        // 获取领取话费信息
        REQUEST.NC_REQUESTGETDATA({}, URL.API_FALSEHOOD, function (res) {
            that.setData({
                receiveList: res.data.data
            })
        }, function (fail) {
        });

        
    },
    // 授权
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail
        this.setData({
            userInfo: e.detail,
            hasLogin: true,
            
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
            this.setData({
                userInfo: e.detail,
                hasLogin: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName,
            });
            var that = this;
            LOGIN.LOGIN(function (res) {
                if(res.code == "OK"){
                    var parms = {};
                    parms.userid = res.data.userId,
                        wx.setStorage({
                            key: 'getUserid',
                            data: parms,
                            success: function (res) {
                            }
                        })
                }
                app.globalData.userId = res.data.userId     
            }, function () { }, e.detail, true)
        }
    },
    // 登陆
    userLogin() {
        let that = this;
        LOGIN.LOGIN(function (res) {
            // 进入首页新老用户数量统计
            wx.reportAnalytics('luck_index_flag_num', {
                flag: app.globalData.flag,
                userid: app.globalData.userId,
                laiyuan: laiyuan,
            });
            // ****************************
            if (res.code == "OK") {
                app.globalData.userId = res.data.userId
                let parms = {};
                parms.userId = res.data.userId,
                wx.setStorage({
                    key: 'getUserid',
                    data: parms,
                    success: function (res) {
                    }
                })
                that.random(res.data.userId)
                if (app.globalData.scene == "1089" && scene_addWx == "") {

                    let params = {};
                    params.userId = res.data.userId;
                    params.taskType = 1;
                    request.POST({
                        url: URL.API_FINISHTASK,
                        params: params,
                        success: function (res) {
                            if (res.code == "OK") {
                                // ****************
                                // 得钻石-任务完成人数
                                wx.reportAnalytics('luck_finishdoam_num', {
                                    userid: params.userId,
                                    taskid: '1',
                                });
                                // ****************
                                wx.showToast({
                                    title: '钻石+20',
                                    icon: 'none',
                                    duration: 2000
                                })
                                scene_addWx = '1089'
                            }
                        },
                        fail: function (res) {
                            fail(res)
                        },
                    });
                }

                if (app.globalData.scene == "1035" && scene_haoWx == "") {
                    var params = {};

                    params.userId = res.data.userId;
                    params.taskType = 2;
                    request.POST({
                        url: URL.API_FINISHTASK,
                        params: params,
                        success: function (res) {
                            if (res.code == "OK") {
                                // ****************
                                // 得钻石-任务完成人数
                                wx.reportAnalytics('luck_finishdoam_num', {
                                    userid: params.userId,
                                    taskid: '2',
                                });
                                // ****************
                                wx.showToast({
                                    title: '钻石+20',
                                    icon: 'none',
                                    duration: 2000
                                })
                                scene_haoWx = '1035'
                            }
                        },
                        fail: function (res) {
                        },
                    });
                }
                // 获取钻石和话费信息
                REQUEST.NC_REQUESTPOSTDATA(parms, URL.API_USER, function (res) {
                    let everyDatTaskTotal = res.data.data.everyDatTaskTotal
                    let trySmallGameTotal = res.data.data.trySmallGameTotal
                    if (everyDatTaskTotal != "0"){
                        that.setData({
                            everyDatTaskTotal: true,
                        });
                    }else{
                        that.setData({
                            everyDatTaskTotal: false,
                        });
                    }
                    if (trySmallGameTotal != "0") {
                        that.setData({
                            trySmallGameTotal: true
                        });
                    }else{
                        that.setData({
                            trySmallGameTotal: false
                        });
                    }
                    that.setData({
                        diamonds: res.data.data.allDiamond,
                        telephoneBill: res.data.data.allMount,
                    });
                }, function (res) {

                })
                
        }
            
        }, function () { }, that.data.userInfo, true)
    },
    // 点击跳转
    // 跳转提取页
    clickTelephoneBill:function(){
        wx.navigateTo({
            url: "/pages/index/userCore/huafei/huafei"
        })
    },
    // 跳转转盘页
    clickToluck: function () {
        wx.navigateTo({
            url: "/pages/index/index"

        })
    },
    // 跳转得钻石页

    trySmallGameList: function () {
        wx.navigateTo({
            url: "/pages/index/getDiamonds/getDiamonds?clickType="+'1'

        })
    },
    // 跳转得钻石页
    clickEveryDatTaskTotal: function () {
        wx.navigateTo({
            url: "/pages/index/getDiamonds/getDiamonds?clickType=" + '2'

        })
    },
    // 跳转个人中心
    personalCenter: function () {
        wx.navigateTo({
            url: "/pages/index/userCore/userCore"
        })
    },
    // 规则弹窗
    clickruleMask:function(){
        this.setData({
            ruleMask:true
        })
    },
    clickruleMasknone: function () {
        this.setData({
            ruleMask: false
        })
    },
    
    random(preams) {
        var that = this
        let data = {}
        let url = URL.API_GETRECEIVELIST
        data.userId = preams
        rq.more(data, url)
            .then((res) => {
                that.setData({
                    list: res.data.data.data
                })
            })
            .then((res)=>{
                that.randomBubble()
            })


            .catch((err) => {
            })
    },
    //产生指定范围和数量的随机整数

    randomBubble() {

        const bubble1 = new Array()
        let arr = this.data.list
        let randomTop = this.data.num[0]
        let randomLeft = this.data.num[1]

        for (var i = 0; i < 42; i++) {
            let lefts2 = Math.floor(Math.random() * 44)
            bubble1.push(lefts2)
        }


        let newArr = new Array(35)
            .fill(0)
            .map((v, i) => i + 1)
            .sort(() => 0.5 - Math.random())
            .filter((v, i) => i < 12);

        let list = this.data.list


        for (let [index, value] of list.entries()) {
            list[index].tops = Math.floor(newArr[index] / 8) * 110
            list[index].lefts = newArr[index] % 8 * 80
        }
            this.setData({
                newList: list
            })


    },
    // 点击钻石
    bubble: function (e) {
        let that = this
        // *************************
        // 点击钻石埋点
        wx.reportAnalytics('luck_lingzuanshi_num', {
            
            flag: app.globalData.flag,
            userid: app.globalData.userId,
        });
        // ********************
        let receiveId = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        let userid = e.currentTarget.dataset.userid
        let newList = this.data.newList;
        let data = {}
        data.receiveId = receiveId
        data.userId = userid
        let url = URL.API_BUBBLE

        
        // 点击最后一个调用接口
        if (newList.length == 1) {
            newList.splice(index, 1)
            request.POST({
                url: url,
                params: data,
                success(res) {
                    // 获取钻石和话费信息
                    REQUEST.NC_REQUESTPOSTDATA(data, URL.API_USER, function (res) {

                        that.setData({
                            diamonds: res.data.data.allDiamond,
                            telephoneBill: res.data.data.allMount
                        });
                    }, function (res) {

                    })
                    that.random(userid)
                }
            })
        } else {
            request.POST({
                url: url,
                params: data,
                success(res) {
                    newList.splice(index, 1)
                    // 获取钻石和话费信息
                    REQUEST.NC_REQUESTPOSTDATA(data, URL.API_USER, function (res) {

                        that.setData({
                            diamonds: res.data.data.allDiamond,
                            telephoneBill: res.data.data.allMount
                        });
                    }, function (res) {

                    })
                    that.setData({
                        newList: newList
                    })

                }
            })
        }

    },
    onShareAppMessage(e) {
        wx.reportAnalytics('click_invitep_times', {});
        return {
            title: this.data.nickName + '@你，我正在免费提取话费，你也快来吧！！',
            imageUrl: '/pages/images/newIndexshare.png',
            path: 'pages/newIndex/newIndex?laiyuan=' + '6'
        }
    }
    
})
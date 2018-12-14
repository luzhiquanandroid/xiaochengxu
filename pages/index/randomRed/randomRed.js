var indexRequest = require('../../../utils/indexRequest.js');
var gameRequest = require('../../../utils/gameRequest.js');
var searchJS = require('../../../utils/search.js');
var LOGIN = require('../../../utils/wglogin.js');

var UTL = require('../../../utils/urls.js');
import NumberAnimate from "../../../utils/NumberAnimates";
const app = getApp();
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        mask: false,
        bgImg: '',
        bgClass: '',
        mount:'0.0000',
        listImage:{},
        id:'0',
        navUrl: {}
       
    },
    /**
  * 生命周期函数--监听页面显示
  */
    onShow: function () { 
        var that= this;
        wx.showLoading({
            title: '加载中',
        })
        //进入此界面的用户数量
        // **********************************
        wx.reportAnalytics('luck_phonemoney_num', {
            userid: String(app.globalData.userId),
        });
        // **********************************
        wx.request({
            url: UTL.HTTP_URL + 'api/random/game',
            data: {},
            method: 'GET',
            success: function (res) {
                console.log(res.data.data)
                that.setData({
                    navUrl: res.data.data
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
                                
                                
                                that.animate();
                                wx.request({
                                    url: UTL.HTTP_URL +'/api/phone/falsehood',
                                    data: { },
                                    method: 'get',
                                    success: function (res) {
                                        wx.hideLoading();
                                            that.setData({
                                                listImage: res.data.data.data
                                            })
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
    },
    animate: function () {
        var that = this;
        this.setData({
            mount: '0.0000',
           
        });
       
        
        let mount = app.globalData.redRandom;
        
        let n1 = new NumberAnimate({
            from: mount,
            speed: 1000,
            refreshTime: 100,
            decimals: 4,
            onUpdate: () => {
                this.setData({
                    mount: n1.tempValue
                });
            },
            onComplete: () => {
                
            }
        });
    },
    getRedrandom:function(){
        var data = {
            'userId': app.globalData.userId,
            'type': app.globalData.type,
            'recordId': app.globalData.recordId,
        }
        wx.request({
            url: UTL.HTTP_URL +'/api/random/open',
            data: { data },
            method: 'POST',
            success: function (res) {

            },
            fail: function (res) {

            },
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
})
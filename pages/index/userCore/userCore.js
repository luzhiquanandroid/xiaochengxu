var indexRequest = require('../../../utils/indexRequest.js');
var gameRequest = require('../../../utils/gameRequest.js');
var searchJS = require('../../../utils/search.js');
var LOGIN = require('../../../utils/wglogin.js');

var UTL = require('../../../utils/urls.js'); 
var zuanshi = 0;
const app = getApp()
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        mask: false,
        bgImg: '',
        bgClass: '',
        zuan:0,
        huafei:0,
        hasUserInfo:true
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
                hasUserInfo: true
            });
            var that = this;
            LOGIN.LOGIN(function (res) {
                app.globalData.userId = res.data.userId;
                var data = {
                    "userId": app.globalData.userId,
                }
                wx.request({
                    url: UTL.HTTP_URL + '/api/user/getUserInfo',
                    data: { data },
                    method: 'POST',
                    success: function (res) {
                        that.setData({
                            zuan: res.data.data.data.allDiamond,
                            huafei: res.data.data.data.allMount
                        });
                        zuanshi = res.data.data.data.allDiamond
                    },
                    fail: function (res) {

                    },
                })
            }, function () { }, e.detail, true)
        }
    },
  userLogin() {
    var that = this;
    LOGIN.LOGIN(function (res) {
      if (res) {
        var data = {
            "userId": res.data.userId,
        }
        console.log(res)
        console.log(22222222)
        wx.request({
            url: UTL.HTTP_URL +'/api/user/getUserInfo',
          data: { data },
          method: 'POST',
          success: function (res) {
            that.setData({
              zuan: res.data.data.data.allDiamond,
              huafei: res.data.data.data.allMount
            });
            zuanshi = res.data.data.data.allDiamond
          },
          fail: function (res) {

          },
        })
      }


    }, function () { }, that.data.userInfo, false)

  },
    /*跳转页面*/
    baoxiang:function(){
        var data = {
            userId: app.globalData.userId,
            type:'3',
            currentPage:'1',
            pageSize:'180'
        }
        wx.request({
            url: UTL.HTTP_URL +'/api/person/list',
            data: { data },
            method: 'POST',
            success: function (res) {
                
            },
            fail: function (res) {

            },
        })
        wx.navigateTo({
            url: "/pages/index/userCore/boxList/boxList",
  
        })
    },
    zhuli: function () {
        wx.navigateTo({
            url: "/pages/index/userCore/redEnvelopes_list/redEnvelopes_list",
     
        })
    },
    zuanshi: function () {
        wx.navigateTo({
            url: "/pages/index/userCore/zuanshi_list/zuanshi_list",

        })
    },
    commpoblem:function(){
        wx.navigateTo({
            url: "/pages/index/userCore/CommProblem/CommProblem"

        })
    },
    aboutUs: function() {
        wx.navigateTo({
            url:"/pages/index/userCore/aboutUs/aboutUs"

        })
    },
    huafei:function() {
        wx.navigateTo({
            url: "/pages/index/userCore/huafei/huafei"

        })
    },
})
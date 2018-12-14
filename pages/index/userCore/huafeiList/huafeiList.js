var indexRequest = require('../../../../utils/indexRequest.js');
var gameRequest = require('../../../../utils/gameRequest.js');
var searchJS = require('../../../../utils/search.js');
var LOGIN = require('../../../../utils/wglogin.js');
var UTL = require('../../../../utils/urls.js');
const app = getApp()
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        mask: false,
        bgImg: '',
        bgClass: '',
        huafei:0,
        listImage: {},
        hasList:''
        
    },
    /**
 * 生命周期函数--监听页面显示
 */
    onShow: function () {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        var data = {
            userId: app.globalData.userId,
            currentPage: '1',
            pageSize: '180'
        }
        wx.request({
            url: UTL.HTTP_URL + '/api/phone/record',
            data: { data },
            method: 'POST',
            success: function (res) {
                wx.hideLoading();
                var lists = res.data.data.data
                if (lists == 0) {
                    that.setData({
                        listImage: res.data.data.data,
                        hasList: false
                    })

                } else {
                    that.setData({
                        listImage: res.data.data.data,
                        hasList: true
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
                            that.setData({
                                userInfo: res,
                                hasUserInfo: true,
                                codeData: false,
                                mask: false,
                            })
                        }
                    })

                } else {
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
                app.globalData.userId = res.userId;
                that.getUserBurning(app.globalData.userId);
            }, function () { }, e.detail, true)
        }
    },
  userLogin() {
    var that = this;
    
    LOGIN.LOGIN(function (res) {
      if (res) {
          app.globalData.userId = res.data.userId ;
        
        var data = {
            "userId": app.globalData.userId,
        }
        wx.request({
            url: UTL.HTTP_URL +'/api/user/getUserInfo',
          data: { data },
          method: 'POST',
          success: function (res) {
            that.setData({
              huafei: res.data.data.data.allMount
            });
          },
          fail: function (res) {

          },
        })
      }


    }, function () { }, that.data.userInfo, false)

  },
  // 获取到焦点
  focus: function (e) {
    var that = this;
    console.log(e.detail.height)
    this.setData({
      focus: true,
      input_bottom: e.detail.height
    })
  },
  // 失去焦点
  no_focus: function (e) {
    this.setData({
      focus: false
    })
  },
  // 跳转首页
    goPageIndex: function () {
        wx.navigateTo({
            url: "/pages/index/index"
        })
    }
})
var LOGIN = require('../../../utils/wglogin.js');
var indexRequest = require('../../../utils/indexRequest.js');
var URL = require('../../../utils/urls.js');
var REQUEST = require('../../../utils/taskRequest.js');
var request = require('../../../utils/request.js');
var images =""
const app = getApp()
Page({
    data:{
        painting: {},
        mask:false,
        navUrl:{}
    },
    onShow:function(res){
        var that = this;
        console.log(1111111)
        REQUEST.NC_REQUESTGETDATA({}, URL.API_GOOD, function (res) {
            that.setData({
                navUrl: res.data
            })
            images = res.data.data.sellerCode
        }, function (fail) {
        })
    },
    // 点击事件
    clickBtn:function(){
        this.setData({
            mask:true
        })
    },
    clicknoBtn: function () {
        this.setData({
            mask: false
        })
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
                var falg = res.authSetting['scope.writePhotosAlbum']
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.hideLoading()
                    wx.showModal({
                        content: '打开设置授权保存图片到相册',
                        success: function (res) {
                            if (falg == false) {
                                wx.openSetting({
                                    success(res) {
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
        var listViews = new Array();
        listViews.push({
            type: 'image',
            url: images,
            top: 0,
            left: 0,
            width: 320,
            height:320
        });

        this.setData({
            painting: {
                width: 320,
                height: 320,
                clear: true,

                views: listViews
            }
        })
    },
    eventGetImage(event) {
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
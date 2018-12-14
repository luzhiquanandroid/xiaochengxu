var indexRequest = require('../../../../utils/indexRequest.js');
var gameRequest = require('../../../../utils/gameRequest.js');
var searchJS = require('../../../../utils/search.js');
var LOGIN = require('../../../../utils/wglogin.js');
var UTL = require('../../../../utils/urls.js');
import cuurPage from '../../../utils/classPage.js'
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
        hasList:[],
      hasListFlg:false,
        currentPage:1,
        pageSize:10,
        allList:''
        
    },
    /**
 * 生命周期函数--监听页面显示
 */
    onShow: function () {
      console.log(cuurPage)
        var that = this;


       // maidian
        wx.reportAnalytics('luck_indoamlist_num', {
            userid: app.globalData.userId,
        });




      that.moreList(that.data.currentPage + 1)
        // wx.showLoading({
        //     title: '加载中',
        // })
        var data = {
            userId: app.globalData.userId,
            currentPage: '1',
            pageSize: '180'
        }
      
   
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
    // 请求函数
  moreList: function (currentPage,flg){
     let that  = this;
      let currentPage1 = that.data.currentPage  //当前页
      let pages = that.data.pageSize  // 一页多少条
      let url = 'api/asset/diamond'
      let users = app.globalData.userId
      let data2 = {}
      data2.currentPage = currentPage1

      data2.userId = users;
      data2.pageSize = pages

      let re = new cuurPage.morePage();
        wx.showLoading({
          title: '加载中',
        })
      re.more(data2, url)   
        .then((res) => {
          console.log(res)
          // 合并
          let newArr = that.data.hasList.concat(res.data.data.data)
          that.setData({
            hasList: newArr,
            currentPage: currentPage,
            allList: res.data.data.totalCount,
            
          })
            if (res.data.data.totalCount != 0){
                that.setData({
                    hasListFlg: true

                })
                
            }else{
                that.setData({
                    hasListFlg: false

                })
               
            }
          wx.hideLoading();
          if (flg){
            wx.stopPullDownRefresh()
          }
        })
        .catch((res) => {
          console.log(res)
        })

    },
  // 加载更多
  onReachBottom: function () {
    let that =this
   
    if ((that.data.currentPage-1) * that.data.pageSize <that.data.allList){
      that.moreList(that.data.currentPage + 1)
    }
   
  },
//下拉加载
  onPullDownRefresh:function(){
   
    this.setData({
      hasList: [],
      currentPage:1
     
    })
    this.moreList(this.data.currentPage + 1,true)
    
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


  // 跳转首页
    goPageIndex: function () {
        wx.navigateBack({
            delta: 1
        })
    }
})
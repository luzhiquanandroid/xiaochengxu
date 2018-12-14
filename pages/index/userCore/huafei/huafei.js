var indexRequest = require('../../../../utils/indexRequest.js');
var gameRequest = require('../../../../utils/gameRequest.js');
var searchJS = require('../../../../utils/search.js');
var LOGIN = require('../../../../utils/wglogin.js');
var UTL = require('../../../../utils/urls.js');
var request = require('../../../../utils/request.js');

const app = getApp()
var numbers = '1';
var phones;
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: '',
        bgImg: '',
        bgClass: '',
        huafei:0,
        indexs :'',
        arr:["1","5","10"],
        btnDisabled:'disabled',
        phonetitle:'',
        mask:false,
        success:false,
        font:'',
        hasUserInfo:true,
        content:''
        
    },
    /**
 * 生命周期函数--监听页面显示
 */
    onShow: function () {
        var that = this;
        // 记录进入提取话费界面的用户数量
        // ****************************
        wx.reportAnalytics('luck_extract_num', {
        });
        // ****************************
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
                app.globalData.userId = res.dat.userId;
            }, function () { }, e.detail, true)
        }
    },
  userLogin() {
    var that = this;
    var data = {};
    LOGIN.LOGIN(function (res) {
      
      if (res) {
          app.globalData.userId = res.data.userId ;
        
        data = {
            "userId": res.data.userId,
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
      input_bottom: e.detail.height,
     
    })
  },
  // 失去焦点
  no_focus: function (e) {
    phones = e.detail.value
    console.log(phones)
    this.setData({
        focus: false,
    })
  },
  // 按键输入
  touchStar : function(e){
    var that = this;
    let length = e.detail.value.length
    var isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|1703|1705|1706|18[2-478])\d{7,8}$/; //移动
    var isChinaUnion = /^(?:13[0-2]|145|15[56]|176|1704|1707|1708|1709|171|18[56])\d{7,8}$/; //联通
    var isChinaTelcom = /^(?:133|153|1700|1701|1702|177|173|18[019])\d{7,8}$/; // 电信
    if(length >0){
        that.setData({
            font: 'bigFont'
        })      
    }else{
        that.setData({
            font: ''
        })
    }
    if (length >= 11 ){
      that.setData({
        btnDisabled: ''
      })
        if (isChinaMobile.test(e.detail.value)) {
            that.setData({
                phonetitle: '中国移动',
                btnDisabled: ''
            })
        } else if (isChinaUnion.test(e.detail.value)) {
            that.setData({
                phonetitle: '中国联通',
                btnDisabled: ''
            })
        } else if (isChinaTelcom.test(e.detail.value)) {
            that.setData({
                phonetitle: '中国电信',
                btnDisabled: ''
            })
        } else {
            that.setData({
                phonetitle: '未知号码',
                btnDisabled: 'disabled'
            })
            if (isChinaMobile.test(e.detail.value)) {
                that.setData({
                    phonetitle: '中国移动',
                    btnDisabled: ''
                })
            } else if (isChinaUnion.test(e.detail.value)) {
                that.setData({
                    phonetitle: '中国联通',
                    btnDisabled: ''
                })
            } else if (isChinaTelcom.test(e.detail.value)) {
                that.setData({
                    phonetitle: '中国电信',
                    btnDisabled: ''
                })
            } else {
                that.setData({
                    phonetitle: '未知号码',
                    btnDisabled: 'disabled'
                })
            }
        }
    }else{
        that.setData({
            btnDisabled: 'disabled'
        })
    }
  },
  //跳转
  clickList:function(){
      wx.navigateTo({
          url: "/pages/index/userCore/huafeiList/huafeiList",
      })
  },
  numbered:function(e){
    console.log(e)
    let index =e.target.dataset.index;
    numbers = e.target.dataset.num
    this.setData({
      indexs:index
    })
  },
//   提取话费
  tiqu:function(){
      var that =this
      var params = {};
      params.userId = app.globalData.userId;
      params.phone = phones;
      params.amount = numbers;
      request.POST({
          url: UTL.API_RECHARGE,
          params: params,
          success: function (res) {
              if (res.code == "OK") {
                  that.setData({
                      mask: true,
                      success: true
                  })
                  //   记录提取成功的用户数量
                  wx.reportAnalytics('luck_success_num', {
                  });
                  //   ***********************
                  var data = {
                      "userId": app.globalData.userId,
                  }
                  wx.request({
                      url: UTL.HTTP_URL + '/api/user/getUserInfo',
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

              } else if (res.code == 'AMOUNT_NOT_ENOUGH') {
                  that.setData({
                      mask: true,
                      content: res.msg,
                      success: false
                  })

              } else if (res.code == 'REPEAT_OPERATE') {
                  that.setData({
                      mask: true,
                      content: '亲，上一笔话费到账后才可以继续提取哦！~',
                      success: false
                  })

              } else {
                  that.setData({
                      mask: true,
                      content: '话费余额不足',
                      success: false
                  })
              }
          },
          fail: function (res) {
              fail(res)
          },
      });
  },
    onShareAppMessage(e) {
        // 分享用户数量
        // **********************
        wx.reportAnalytics('luck_share_num', {
            flag: app.globalData.flag,
            userid: app.globalData.userId,
            share: '话费页',
        });
        /*
             微信点击首页分享按钮
        */
        wx.reportAnalytics('click_invitep_times', {});
        return {
            title: '我已成功免费提取充值话费，你也来吧！',
            imageUrl: '/pages/images/tishiHua.jpg',
            path: 'pages/newIndex/newIndex?laiyuan=' + '4'
        }

    },
    //关闭弹窗
    clickClose:function(){
        var that = this
        that.setData({
            mask: false
        })
    }
})
var gameRequest = require('./utils/gameRequest.js');
var tmep_enter = 0;

App({
    onLaunch: function (options) {

        // 获取用户信息
        const updateManager = wx.getUpdateManager()
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },
    onload: function (opt) {
        console.log(opt)
    },

    onShow: function (options) {
        console.log("[onshow] 场景值:", options.scene)
        this.globalData.scene = options.scene;
        if (options.referrerInfo.extraData && options.referrerInfo.extraData != undefined) {
            this.globalData.source = options.referrerInfo.extraData.source;
        }
        var timestamp = Date.parse(new Date());
        tmep_enter = timestamp / 1000;
        wx.getNetworkType({
            success: function (res) {
                wx.setStorageSync('network', res.networkType)
            }
        })
        if (wx.getStorageSync('system')) {

        } else {
            wx.getSystemInfo({
                success: function (res) {
                    wx.setStorageSync('system', res)
                }
            })
        }
    },
    onHide: function () {
        // var timestamp = Date.parse(new Date());
        // var temp_out = timestamp / 1000;
        // var totaltime = temp_out - tmep_enter;
        // var parsm = {};
        // parsm.uid = this.globalData.userId;
        // parsm.is_new_user = this.globalData.flag;
        // parsm.scene = this.globalData.source;
        // parsm.total_time = temp_out;
        // parsm.event = EVENTS.EVENT_USERSTAYTIME;
        // EVENTS.EVENT_LOGPOST(parsm)
    },
    globalData: {
        userInfo: null,
        balance: '0.0',
        friend: '',
        gameId: '',
        userId: '',
        source: '1', //2 步数宝来源 1 其他
        flag: '2',//2老用户 1 新用户
        taskId: '',
        type: '',
        recordId: '',
        redRandom: '0.0000',
        refId: '',
        msg: '',
        onlodeNum: 0,
        loops: 0,
        increment: 0,
        friendHome: '',
        scene: ''
    }
})
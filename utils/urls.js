
//var HTTP_URL = 'https://game-test.imsidang.com/'
// var HTTP_URL = 'http://47.94.107.37:9455/'
// var HTTP_URL = 'http://192.168.1.244:9455/'
// var HTTP_URL = 'https://game.imsidang.com/'
// 鲁智权IP
 var HTTP_URL = 'http://192.168.1.135:9500/'

// 牛欢IP
// var HTTP_URL = 'http://192.168.1.244:9500/'

// 测试
// var HTTP_URL = 'https://game-draw-test.bushubao.cn/'

// 线上
// var HTTP_URL = 'https://game-draw.bushubao.cn/'

//获取OpenId接口
var API_LOGIN = "api/wx/login"

// 获取奖品接口
var API_LUCK = 'api/random/lucky'

// 打开随机话费接口
var API_RANDOM = 'api/random/open'

//获取用户话费余额和钻石接口
var API_USER = '/api/user/getUserInfo'

//打开助力红包和宝箱接口

var API_OPEN = '/api/invitation/open' 

// 获取助力话费和宝箱列表接口 

var API_LIST = 'api/person/list'


// 获取助力话费或者宝箱详情页接口 
var API_DETAIL = 'api/person/detail'


///获取随机红包提取列表和首页提取提示的接口  
var API_FALSEHOOD = 'api/phone/falsehood'


// 充值话费接口 
var API_RECHARGE = 'api/phone/recharge' 


// 记录充值话费列表 
var API_RECORD = 'api/phone/record'


//获取幸运奖微信小程序跳转所需要的图片路径接口  /
var API_GAME = 'api/random/game'


//领取助力话费和宝箱奖励接口 
var API_RECEIVE = 'api/invitation/receive'

// 首页领取钻石剩余时间接口
var API_GETDOAM = 'api/receive/getInfo'

// 首页点击领取钻石接口
var API_CLICK_GETDOAM ='api/receive/receive'

// 首页邀请好友头像列表
var API_HOMELIST = 'api/invitation/homeList' 

// 获取每日任务列表
var API_EVERYDAY = 'api/task/allList'

// 点击签到
var API_SIGNIN = 'api/sign/signIn'

// 获取签到列表
var API_SIGNINLIST = 'api/sign/signInList'

// 预约签到
var API_QIANDAO = "api/subReserve/report"

// 从小程序或者公众号接口进来
var API_FINISHTASK = 'api/task/finishTask'

// 从小程序或者公众号接口进来
var API_DOTASK = 'api/task/doTask'

// 获取分享二维码图片接口
var API_GETiMG = 'api/wx/wxaCode'
// 电商接口
var API_GOOD = 'api/random/good'

// 首页气泡钻石列表
var API_GETRECEIVELIST = 'api/receive/getReceiveList'
//领取气泡钻石
var API_BUBBLE = 'api/receive/bubble'
module.exports = {
    HTTP_URL:HTTP_URL,
    API_LOGIN:API_LOGIN,
    API_LUCK:API_LUCK,
    API_OPEN:API_OPEN ,
    API_RANDOM: API_RANDOM,
    API_RECEIVE: API_RECEIVE,
    API_RECHARGE: API_RECHARGE,
    API_GETDOAM: API_GETDOAM,
    API_USER: API_USER,
    API_FALSEHOOD: API_FALSEHOOD,
    API_CLICK_GETDOAM: API_CLICK_GETDOAM,
    API_HOMELIST: API_HOMELIST,
    API_EVERYDAY: API_EVERYDAY,
    API_SIGNIN: API_SIGNIN,
    API_SIGNINLIST: API_SIGNINLIST,
    API_QIANDAO: API_QIANDAO,
    API_FINISHTASK: API_FINISHTASK,
    API_DOTASK: API_DOTASK,
    API_GETiMG: API_GETiMG,
    API_GOOD: API_GOOD,
    API_GETRECEIVELIST: API_GETRECEIVELIST,
    API_BUBBLE: API_BUBBLE

}
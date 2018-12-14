// 分页
import URL from '../../utils/urls.js'
// console.log(URL)
class morePage{
  more(data, url, types ='POST'){
      return new Promise((resole,reject)=>{
        wx.request({
          url: URL.HTTP_URL+ url,
          data: { data },
          method: types,
          success: function (res) {
            resole(res)

          },
          fail: function (res) {
            reject(res)
          },
        })
      })
    }

}
module.exports = {
  morePage: morePage
}
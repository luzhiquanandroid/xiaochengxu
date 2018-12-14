function showToast(title, icon,duration, mask, fnsucc) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration || 2000,
      mask: mask || false,
      success: function (res) {
        fnsucc && fnsucc(res);
      },
      fail: function (res) {
        fnsucc && fnsucc(res);  
      },
      complete: function (res) {
        fnsucc && fnsucc(res);
      },
    })
}

function success(title) {
  showToast(title,'none');
}

function fail(title) {
    showToast(title,'none');
}
module.exports = {
    SUCCESS: success,
    FAIL: fail,
    SHOW: showToast
}  
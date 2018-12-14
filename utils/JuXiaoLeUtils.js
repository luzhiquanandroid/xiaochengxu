var juxiaoleKey = 'e665b8da93e44f40918953137eab49bd';
var md5 = require("./md5");
function appendValue(jsonObj, key){
    if(jsonObj){
        var value = jsonObj[key];
        if(value){
            return value;
        }
    }
    return '';
}

function cryptoData(data){
    var result = '';
    if(data != null){
        var dataType = typeof (data);
        if(dataType == "object"){
            if(data.length){
                for(var i = 0; i < data.length; i++){
                    result += cryptoData(data[i]);
                }
            }else{
                var newkey = Object.keys(data).sort();　
                for(var i = 0; i < newkey.length; i++) {
                    var key = newkey[i];
                    result += cryptoData(data[key]);
                }
            }

        }else{
            result += data;
        }
    }

    return result;
}

  function str2utf8(str)
{
    // UCS-2和UTF8都是unicode的一种编码方式
    // js代码中使用的是UCS-2编码
    var code;
    var utf = "";
    for (var i = 0; i < str.length; i++)
    {
        code = str.charCodeAt(i);//返回每个字符的Unicode 编码
        if (code < 0x0080) {
            utf += str.charAt(i);//返回指定位置的字符
        }
        else if (code < 0x0800) {
            utf += String.fromCharCode(0xC0 | ((code >> 6) & 0x1F));
            utf += String.fromCharCode(0x80 | ((code >> 0) & 0x3F));
        }
        else if (code < 0x10000) {
            utf += String.fromCharCode(0xE0 | ((code >> 12) & 0x0F));
            utf += String.fromCharCode(0x80 | ((code >>  6) & 0x3F));
            utf += String.fromCharCode(0x80 | ((code >>  0) & 0x3F));
        }
        else
        {
            throw "不是UCS-2字符集"
        }
 
    }
    return utf;
}

/**
 * 对JSON对象进行加密
 */
function crypto(originalJson){
    var str = '';
    str += appendValue(originalJson, 'api');
    str += appendValue(originalJson, 'v');
    str += appendValue(originalJson, 'app');
    str += appendValue(originalJson, 'channel');
    str += cryptoData(originalJson.data);
    str = str2utf8(str);
    // str = str.toString();
    var result = md5.hex_hmac_md5(juxiaoleKey, str); 
    return result;
}


module.exports = {
    'crypto': crypto,
};
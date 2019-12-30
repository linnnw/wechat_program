const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const gd = {
   ARAMETER: {
    OSS_PREFIX: 'https://yunqi-file.oss-cn-shenzhen.aliyuncs.com/',
    WEB_HOST: 'http://localhost:3012/yc',
    MAX_INTEGER: 100000000
  },
  REGULAR: {
    INTEGER: /^\d+$/,//匹配整数
    FLOAT: /^\d+(\.\d+)?$/,//匹配浮点数
    EMAIL: /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/,//邮箱校验
    PHONE: /^1(3|4|5|7|8)\d{9}$/,//手机号校验
    TEL: /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/,//校验座机号
    PHONE_AND_TEL: /^((0\d{2,3}-\d{7,8})|(0\d{9,11})|(1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}))$/,//校验手机或座机
    CHINESE: /^[\u4E00-\u9FA5]+$/,//检验是否全中文
    IDENTITY_CARD: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//校验身份证
    CHINESE_NAME: /^[\u4e00-\u9fa5]{2,5}$/,//校验中国人姓名
    POST_CODE: /^[1-9][0-9]{5}$/,//校验邮编
    TRIM: /^\s+|\s+$/g,//匹配前后两端的空格，和replace搭配去除前后空格
    PICTURE: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/,
    VIDEO: /(.*)\.(avi|mov|mpeg|mpg|ram|qt|wmv|mp4|ogg|AVI|MOV|MPEG|MPG|RAM|QT|WMV|MP4|OGG)$/,
    TEXT: /(.*)\.(txt|TXT)$/,
    DOC: /(.*)\.(doc|docx|DOC|DOCX)$/,
    EXCEL: /(.*)\.(xls|xlsx|XLS|XLSX)$/,
    PDF: /(.*)\.(pdf|PDF)$/,
    PPT: /(.*)\.(ppt|PPT)$/
  },
}

module.exports = {
  formatTime: formatTime,
  gd
}

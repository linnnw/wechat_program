// const gd_method = require('../../../utils/gd_method')
import request from '../../../utils/request.js'
const PARAMETER = {
  OSS_PREFIX: 'https://yunqi-file.oss-cn-shenzhen.aliyuncs.com/',
  WEB_HOST: 'http://localhost:3012/yc',
  MAX_INTEGER: 100000000
};
const REGULAR = {
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
};
Component({
  data: {
    visiblefd: false,
    remark: '',
    show: true,
    fandanData: [],
    val1: '请选择到达时间',
    val2: '请选择离开时间',
    lang: 'zh_CN',
    price_arr: [], //总金额计算
    form: {
      ...getApp().globalData.commonField(),
      type: 'cbd',
      contract_code: null,
      contract_bill_code: null,
      contract_term: null,
      service_method: null,
      client_email: null,
      client_phone: null,
      cost_sum: 0
    },
    code_2_3_price: {},
    imagesrc: [],
    paths: []  // 记录图片本地路径
  },
  properties: {
    handleData: {
      type: Object,
      value: {}
    },
    shebeiData: {
      type: Object,
      value: []
    }
  },
  pageLifetimes: {
    show: function () {
      if(this.data.form.data.length == 0) {
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
      }
      this.setData({
        ['form.sign']: getApp().globalData._base64
      })
      
      // console.log(this.data.form.sign)
      // getApp().globalData._base64 = '';
      // 页面被展示
      // console.log(getApp().globalData._base64)
      // const ctx = wx.createCanvasContext('autograph',this)

      // ctx.drawImage(getApp().globalData._base64, 0, 0, wx.getSystemInfoSync().windowWidth, 200)
      // ctx.draw()
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  lifetimes: {
    attached: function () {
      console.log(this.properties.handleData)
      let temp_list = this.transferImageList(this.properties.handleData.imageList)
      let imglist = [];
      for (let i = 0; i < temp_list.length; i++) {
        imglist.push(temp_list[i].url)
      }
      this.setData({
        imagesrc: imglist
      })
      // console.log(this.data.imagesrc)
      let data = this.properties.handleData
      let shebei = this.properties.shebeiData

      // 基础信息
      Object.keys(data).forEach(key => {
        if (key in this.data.form && !['imageList'].includes(key)) {
          // this.data.form[key] = data[key]
          this.setData({
            [`form.${key}`]: data[key]
          })
        }
        if (this.data.form.arrive_time == null || this.data.form.arrive_time == undefined) {
          this.setData({
            [`form.arrive_time`]: ''
          })
        } else if (this.data.form.leave_time == null || this.data.form.leave_time == undefined) {
          this.setData({
            [`form.leave_time`]: ''
          })
        } else if (this.data.form.remark == null || this.data.form.remark == undefined) {
          this.setData({
            [`form.remark`]: ''
          })
        }
      })
      // 获取设备 计算工单费用
      this.setData({
        ['form.data']: shebei
      })
      // console.log(this.data.form)
      console.log(this.data.form.data)
      for (let i = 0; i < this.data.form.data.length; i++) {
        this.setData({
          ['form.data[' + i + '].hb_cost']: 0,
          ['form.data[' + i + '].cl_cost']: 0,
        })
        // 计算总费用
        this.is_code(i, 'hb');
        this.is_code(i, 'cl');
      }


      if (this.data.form.sign != '' && this.data.form.sign != null && this.data.form.sign != undefined) {
        getApp().globalData._base64 = this.data.form.sign
      }
      // console.log(this.data.form)

      let item = this.properties.handleData;
      // 在组件实例进入页面节点树时执行
      if (JSON.stringify(item) != '{}' && item != undefined) {
        this.setData({
          show: true
        })
        request._post('/workOrder/api/getActionHistory', { "id": item.id, "type": item.type, "action": "返单" }, res => {
          // console.log(res)
          if (res.data.status == 200) {
            let fandanData = []
            if (res.data.list != null && res.data.list != undefined) {
              fandanData = res.data.list;
            }
            this.setData({
              fandanData
            })
          }
        })
      } else {
        this.setData({
          show: false
        })
      }

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    transferImageList(imageList) {
      // console.log(imageList)
      if (this.isEmpty(imageList)) return [];
      let temp_list = [];
      let tp = Array.isArray(imageList) ? imageList.map(i => i.url || i) : imageList.split(',');
      console.log(tp)
      for (let item of tp) {
        if (this.isEmpty(item)) continue;
        let name_arr = item.replace(PARAMETER.OSS_PREFIX, '').split('/'),
          name = name_arr[name_arr.length - 1].split('-separate-');
        let x = item.split('-create_time-');
        let fileName = decodeURIComponent(name[name.length - 1].split('-create_time-')[0]),
          url = x[0],
          downloadUrl = x[0],
          create_time = x[1] || 0;
        create_time = parseInt(create_time);
        if (REGULAR.PICTURE.test(fileName)) url = x[0];
        else if (REGULAR.DOC.test(fileName)) url = '/images/fileExample/doc.png';
        else if (REGULAR.EXCEL.test(fileName)) url = '/images/fileExample/excel.png';
        else if (REGULAR.VIDEO.test(fileName)) url = '/images/fileExample/video.png';
        else if (REGULAR.PDF.test(fileName)) url = '/images/fileExample/pdf.png';
        else if (REGULAR.PPT.test(fileName)) url = '/images/fileExample/ppt.png';
        else if (REGULAR.TEXT.test(fileName)) url = '/images/fileExample/txt.png';
        else url = '/images/fileExample/unknown.png';
        temp_list.push({
          name: fileName,
          url,
          downloadUrl,
          create_time,
          loading: false
        });
      }
      temp_list.sort((a, b) => {
        return a.create_time < b.create_time ? -1 : 1
      });
      return temp_list
    },
    close(e) {
      console.log(e)
      let file = this.transferImageList(this.properties.handleData.imageList)
      let imgindex = e.currentTarget.dataset.index - file.length
      file = file[e.currentTarget.dataset.index]
      
      let wen_host = wx.getStorageSync('user').WEB_HOST
      let that = this;
      let imgdata = this.data.imagesrc;

      // //若是删除已上传至OSS的图片，则将url传出
      if(file != undefined && file != null){
        if (file.downloadUrl && file.downloadUrl.indexOf(PARAMETER.OSS_PREFIX) === 0) {
          let deleteUrl = file.create_time && file.create_time !== 0 ? file.downloadUrl + '-create_time-' + file.create_time : file.downloadUrl;
          // this.$emit('delete-oss-attachment', deleteUrl);
          // console.log(deleteUrl)
          this.data.form.deleteImageList.push(deleteUrl)
        }
      } else {
        this.data.form.uploadImageList.splice(imgindex,1)
      }
      // console.log(that.data.form.uploadImageList[imgindex])
      wx.request({
        url: wen_host + '/public/attachment/deleteImage',
        data: {
          path: that.data.form.uploadImageList[imgindex]
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          // success
          console.log(res)
          if (res.data.status == 200) {
            // file.blobUrl && URL.revokeObjectURL(file.blobUrl);

            imgdata.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              imagesrc: imgdata
            })
          }
        },
        fail: function (err) {
          // fail
          console.log(err)
        }
      })


    },
    // 图片上传
    photo() {
      let wen_host = wx.getStorageSync('user').WEB_HOST
      console.log(wen_host)
      let that = this;
      wx.chooseImage({
        count: 5,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log(res)
          if(that.data.imagesrc.length >= 10) {
            console.log(10)
            wx.showModal({
              title: '提示',
              content: '最多10张',
              showCancel: false
            })
            return
          }
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          that.setData({
            imagesrc: that.data.imagesrc.concat(tempFilePaths)
          })
          // let data = {}
          // for (var i = 0; i < tempFilePaths.length; i++) {
          //   data[tempFilePaths[i].name] = tempFilePaths[i].path
          // }
          // console.log(data)
          // console.log(tempFilePaths[0].path)
          for (var i = 0; i < that.data.imagesrc.length; i++) {
            wx.uploadFile({
              url: wen_host + '/public/attachment/uploadImage',
              filePath: that.data.imagesrc[i],
              name: 'file',
              // formData: {
              //   'user': 'test'
              // },
              success(res) {
                console.log(res)
                let data = JSON.parse(res.data)
                if (data.status == 200) {
                  // let imgdata = JSON.parse(data);
                  let path_str = data.path
                  console.log(path_str)
                  //do something
                  that.data.paths.push(path_str)
                  console.log(that.data.paths)
                  that.setData({
                    ['form.uploadImageList']: that.data.paths
                  })
                  console.log(that.data.form.uploadImageList)
                }
              }
            })
          }

          // wx.request({
          //   url: wen_host + '/public/attachment/uploadMultiple',
          //   data,
          //   header: {
          //     'content-type': 'application/json',
          //     // 'token': wx.getStorageSync("token")
          //     'cookie': wx.getStorageSync('cookie')
          //   },
          //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          //   // header: {}, // 设置请求的 header
          //   success: function (res) {
          //     // success
          //     console.log(res)
          //   },
          //   fail: function () {
          //     // fail
          //   },
          //   complete: function () {
          //     // complete
          //   }
          // })


          // console.log(tempFilePaths)
          // console.log(that.data.imagesrc)
        },
        fail: err => {
          console.log(err)
        }
      })

    },

    // 预览图片
    previewImg(e) {
      //获取当前图片的下标
      var index = e.currentTarget.dataset.index;
      console.log(index)
      //所有图片
      var imgs = this.data.imagesrc;
      wx.previewImage({
        //当前显示图片
        current: imgs[index],
        //所有图片
        urls: imgs
      })
    },
    onConfirm(e) {
      // console.log(e)
      let val = e.detail.label
      if (e.currentTarget.dataset.index == 'arrive') {
        this.setData({
          ['form.arrive_time']: val,
          val1: val
        })
        console.log(this.data.form.arrive_time)
      } else {
        this.setData({
          ['form.leave_time']: val,
          val2: val
        })
      }
    },
    onVisibleChange(e) {
      this.setData({ visible: e.detail.visible })
    },
    // 字符串转时间戳
    timeformat(timestr) {
      return Date.parse(new Date(timestr)) / 1000
    },
    // 保存
    save() {
      // console.log(this.timeformat('2014-07-10 10:21:12'))
      // console.log(this.data.form.draft_price)
      this.saveORcommit('/save')

    },
    // 提交
    commit() {
      this.saveORcommit('/commit')
    },
    saveORcommit(cs_path) {

      if (this.data.form.data.length <= 0) {
        wx.showModal({
          title: '提示',
          content: '没有抄表设备',
          showCancel: false
        })
        return
      }
      if (this.data.form.arrive_time == '') {
        wx.showModal({
          title: '提示',
          content: '请选择到达时间',
          showCancel: false
        })
        return
      }
      if (this.data.form.leave_time == '') {
        wx.showModal({
          title: '提示',
          content: '请选择离开时间',
          showCancel: false
        })
        return
      }
      if (this.timeformat(this.data.form.arrive_time) > this.timeformat(this.data.form.leave_time)) {
        wx.showModal({
          title: '提示',
          content: '离开时间不能早于到达时间',
          showCancel: false
        })
        return
      } else if (this.data.form.remark == "" || (this.data.form.remark.length > 0 && this.data.form.remark.trim().length == 0)) {
        wx.showModal({
          title: '不能为空',
          content: '请输入备注内容',
          showCancel: false
        })
        return
      }



      let index = 1;
      for (let i of this.data.form.data) {
        if (i.hasdevid !== 1) {
          wx.showModal({
            title: '提示',
            content: `读数表第${index}行发现无机器码的设备`,
            showCancel: false
          })
          return
        }
        if (i.counter >= 1 && i.this_hb_reading != '' && i.this_hb_reading != null) {
          if (!/^\d+$/.test(i.this_hb_reading)) {
            wx.showModal({
              title: '提示',
              content: `读数表第${index}行本次黑白读数填写有误`,
              showCancel: false
            })
            return
          }
          if (typeof i.this_hb_reading == 'number' ? i.this_hb_reading > 100000000 : parseInt(i.this_hb_reading) > 100000000) {
            if (!/^\d+$/.test(i.this_hb_reading)) {
              wx.showModal({
                title: '提示',
                content: `读数表第${index}行本次黑白读数过大`,
                showCancel: false
              })
              return
            }
          }
        }
        if (i.counter >= 2 && i.this_cl_reading != '' && i.this_cl_reading != null) {
          if (!/^\d+$/.test(i.this_cl_reading)) {
            wx.showModal({
              title: '提示',
              content: `读数表第${index}行本次彩色读数填写有误`,
              showCancel: false
            })
            return
          }
          if (typeof i.this_cl_reading == 'number' ? i.this_cl_reading > 100000000 : parseInt(i.this_cl_reading) > 100000000) {
            wx.showModal({
              title: '提示',
              content: `读数表第${index}行本次彩色读数过大`,
              showCancel: false
            })
            return
          }
        }
        if (i.counter >= 1 && i.hb_invalid_num != '' && i.hb_invalid_num != null) {
          if (!/^\d+$/.test(i.hb_invalid_num)) {
            wx.showModal({
              title: '提示',
              content: `读数表第${index}行黑白无效张数填写有误`,
              showCancel: false
            })
            return
          }
          if (typeof i.hb_invalid_num == 'number' ? i.hb_invalid_num > 100000000 : parseInt(i.hb_invalid_num) > 100000000) {
            wx.showModal({
              title: '提示',
              content: `读数表第${index}行黑白无效张数过大`,
              showCancel: false
            })
            return
          }
        }

        if (i.counter >= 1 && i.cl_invalid_num != '' && i.cl_invalid_num != null) {
          if (!/^\d+$/.test(i.cl_invalid_num)) {
            wx.showModal({
              title: '提示',
              content: `读数表第${index}行彩色无效张数填写有误`,
              showCancel: false
            })
            return
          }
          if (typeof i.cl_invalid_num == 'number' ? i.cl_invalid_num > 100000000 : parseInt(i.cl_invalid_num) > 100000000) {
            wx.showModal({
              title: '提示',
              content: `读数表第${index}行彩色无效张数过大`,
              showCancel: false
            })
            return
          }
        }
        (i.this_time == '' && i.this_time == null) && (i.this_time = this.data.form.arrive_time);
        index++;
      }



      console.log('成功')
      if (cs_path == '/save') {
        request._post(getApp().globalData.api + cs_path, this.data.form, res => {
          console.log(res)
          if (res.data.status == 200) {
            wx.showLoading();
            wx.hideLoading();
            setTimeout(() => {
              wx.showToast({
                title: '保存成功',
                icon: "success",
              });
              setTimeout(() => {
                wx.hideToast();
              }, 2000)
            }, 0);
          } else {
            console.log(res.data)
          }
        })
      } else if (cs_path == '/commit') {
        let that = this;
        wx.showModal({
          title: '提示',
          content: '是否提交',
          success(data) {
            if (data.confirm) {
              // console.log('用户点击确定')
              request._post(getApp().globalData.api + cs_path, that.data.form, res => {
                console.log(res)
                if (res.data.status == 200) {
                  wx.showLoading();
                  wx.hideLoading();
                  setTimeout(() => {
                    wx.showToast({
                      title: '提交成功',
                      icon: "success",
                    });
                    setTimeout(() => {
                      wx.hideToast();
                    }, 2000)
                  }, 0);
                  that.triggerEvent('commit')
                } else {
                  console.log(res.data)
                }
              })
            } else if (data.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    
    handlefd() {
      console.log(11)
      this.setData({
        visiblefd: true
      });
    },
    handleClose() {
      this.setData({
        visiblefd: false
      });
    },

    // input点击事件
    val(e) {
      // console.log(e)
      this.setData({
        remark: e.detail.value
      })
    },
    handle_result(e) {
      // console.log(e)
      this.setData({
        ['form.handle_result']: e.detail.value
      })
    },
    draft_price(e) {
      this.setData({
        ['form.draft_price']: e.detail.value
      })
    },
    // 如果input为空把input赋值为0
    ifValIsNull(index,key,val) {
      if(this.isEmpty(val)){
        this.setData({
          [`form.data[${index}].${key}`]: 0
        })
      }else {
        this.setData({
          [`form.data[${index}].${key}`]: val
        })
      }
    },
    // 本次黑白读数
    this_hb_reading(e) {
      let index = e.currentTarget.dataset.index
      this.ifValIsNull(index,'this_hb_reading',e.detail.value)
      
      this.is_code(index, 'hb');
    },
    // 本次彩色读数
    this_cl_reading(e) {
      let index = e.currentTarget.dataset.index
      this.ifValIsNull(index,'this_cl_reading',e.detail.value)
      this.is_code(index, 'cl');
    },
    // 判断是否为空
    isEmpty(val) {
      return val == '' || val == null || val == undefined || val == NaN
    },
    ifnull(val) {
      return this.isEmpty(val) ? 0 : val
    },


    // 黑白本次无效张数
    hb_invalid_num(e) {
      let index = e.currentTarget.dataset.index
      this.ifValIsNull(index,'hb_invalid_num',e.detail.value)
      this.is_code(index, 'hb')
    },
    // 彩色本次无效张数
    cl_invalid_num(e) {
      let index = e.currentTarget.dataset.index
      this.ifValIsNull(index,'cl_invalid_num',e.detail.value)
      this.is_code(index, 'cl')
    },

    beizu_remark(e) {
      this.setData({
        ['form.remark']: e.detail.value
      })
    },


    qianming() {
      // console.log(11)
      wx.navigateTo({
        url: '../../pages/routePage/signature/signature'
      })
    },
    handleOk() {
      // gd_method.handleOk();

      let form = this.properties.handleData
      console.log(form)
      // console.log(this.data.remark)
      if (this.data.remark == "" || (this.data.remark.length > 0 && this.data.remark.trim().length == 0)) {
        wx.showModal({
          title: '不能为空',
          content: '请输入内容',
          showCancel: false
        })
        return
      } else {
        request._post('/workOrder/api/return', { "id": form.id, "status": form.status, "type": form.type, "remark": this.data.remark }, res => {
          console.log(res)
          this.setData({
            visible: false,
            remark: ''
          })
          this.triggerEvent('handleOk')
        })
      }


      console.log(this.properties.handleData)
    },

    // 本次使用计算
    this_use(index, type) {
      let dyjData = this.data.form.data[index];
      // 本次使用等于本次读数-上次读数-无效张数
      let this_use = this.ifnull(dyjData[`this_${type}_reading`]) - this.ifnull(dyjData[`last_${type}_reading`]) - this.ifnull(dyjData[`${type}_invalid_num`])
      this_use = this_use >= 0 ? this_use : 0
      this.setData({
        ['form.data[' + index + '].this_' + type + '_use']: this_use
      })
    },

    // 基本计费
    code_1(index, type) {
      // 彩色_黑白 费用
      let sum = 0;
      // console.log(this.data.form.data);
      // 打印机使用数据
      let dyjData = this.data.form.data[index];
      // 月租
      // let base_price = dyjData.base_price;
      // sum += base_price;
      // 本次使用计算
      this.this_use(index, type)
      // let base_price = this.data.form.data
      // 计算打印机计数器有没有超出基本套餐张数 基本张数-本次读数
      let is_Exceeded = dyjData[`${type}_num`] - dyjData[`this_${type}_use`] >= 0 ? 0 : -(dyjData[`${type}_num`] - dyjData[`this_${type}_use`]) * dyjData[`${type}_over_price`]

      sum += is_Exceeded;

      // console.log(sum)
      this.setData({
        ['form.data[' + index + '].' + type + '_cost']: sum
      })

      this.setData({
        [`price_arr[${index}]`]: this.data.form.data[index].hb_cost + this.data.form.data[index].cl_cost + this.data.form.data[index].base_price
      })
      console.log(this.data.price_arr)
    },
    // 合并计费
    code_2(index, type) {
      let dyjData = this.data.form.data[index];
      this.this_use(index, type)
      //  this.data.form.data[index].this_hb_use
      let hb_cl_sum = [0, 0];
      for (let i = 0; i < this.data.form.data.length; i++) {
        if (this.data.form.data[i].merge_devid == this.data.form.data[index].devid) {
          hb_cl_sum[0] += this.data.form.data[i].this_hb_use
          hb_cl_sum[1] += this.data.form.data[i].this_cl_use
        }

      }

      let total = [];
      total[0] = this.data.form.data[index].this_hb_use + hb_cl_sum[0]
      total[1] = this.data.form.data[index].this_cl_use + hb_cl_sum[1]
      let price = this.sum_this_use(index, total)
      this.setData({
        [`price_arr[${index}]`]: price[0] + price[1] + this.data.form.data[index].base_price
      })
      console.log(this.data.price_arr)
    },
    // 总张数计算
    sum_this_use(index, num) {
      let hb_price = this.data.form.data[index].hb_num - num[0] >= 0 ? 0 : -(this.data.form.data[index].hb_num - num[0]) * this.data.form.data[index].hb_over_price
      let cl_price = this.data.form.data[index].cl_num - num[1] >= 0 ? 0 : -(this.data.form.data[index].cl_num - num[1]) * this.data.form.data[index].cl_over_price
      return [hb_price, cl_price]
    },
    // 合计计费
    code_3(index, type) {
      this.this_use(index, type);
      let parentuse = [0, 0];
      let chiluse = [0, 0];
      let _i = 0
      // this.data.form.data[index].this_hb_use
      for (let i = 0; i < this.data.form.data.length; i++) {
        if (this.data.form.data[i].devid == this.data.form.data[index].merge_devid) {
          _i = i;
          parentuse[0] += this.data.form.data[i].this_hb_use
          parentuse[1] += this.data.form.data[i].this_cl_use
        }
        if (this.data.form.data[i].merge_devid == this.data.form.data[index].merge_devid) {
          chiluse[0] += this.data.form.data[i].this_hb_use
          chiluse[1] += this.data.form.data[i].this_cl_use
        }
      }
      console.log(parentuse)
      console.log(chiluse)
      let total = [];
      total[0] = parentuse[0] + chiluse[0]
      total[1] = parentuse[1] + chiluse[1]
      let price = this.sum_this_use(_i, total);
      this.setData({
        [`price_arr[${_i}]`]: price[0] + price[1] + this.data.form.data[_i].base_price
      })
      console.log(price[0] + price[1] + this.data.form.data[_i].base_price)
      console.log(this.data.price_arr)
    },
    // 打包计费
    code_4(index, type) {
      let dyjData = this.data.form.data[index];
      // 本次使用计算
      this.this_use(index, type)
      let price = dyjData[`this_${type}_use`] * dyjData[`${type}_over_price`]
      this.setData({
        ['form.data[' + index + '].' + type + '_cost']: price
      })

      this.setData({
        [`price_arr[${index}]`]: this.data.form.data[index].hb_cost + this.data.form.data[index].cl_cost < this.data.form.data[index].base_price ? this.data.form.data[index].base_price : this.data.form.data[index].hb_cost + this.data.form.data[index].cl_cost
      })
      console.log(this.data.price_arr)
    },

    // 固定计费
    code_5(index, type) {
      this.setData({
        ['form.data[' + index + '].' + type + '_cost']: 0
      })
      // 本次使用计算
      this.this_use(index, type)
      // 月租
      let base_price = this.data.form.data[index].base_price;
      this.setData({
        [`price_arr[${index}]`]: base_price
      })
      console.log(this.data.price_arr)
    },

    // 最终价格计算
    final_price() {
      let price = 0
      this.data.price_arr.forEach(item => {
        price += item
      })
      this.setData({
        ['form.final_price']: price
      })
      // console.log(this.data.form.final_price)
    },
    // 判断是哪种计数规则
    is_code(index, type) {
      switch (this.data.form.data[index].price_model) {
        case 1:
          console.log('code1_标准计费')
          this.code_1(index, type)
          this.final_price()  // 计算最终费用
          break;
        case 2:
          console.log('code2_标准计费')
          this.code_2(index, type)
          this.final_price()  // 计算最终费用
          break;
        case 3:
          console.log('code3_标准计费')
          this.code_3(index, type)
          this.final_price()  // 计算最终费用
          break;
        case 4:
          console.log('code4_打包计费')
          this.code_4(index, type)
          this.final_price()
          break;
        case 5:
          console.log('code5_固定计费')
          this.code_5(index, type)
          this.final_price()  // 计算最终费用
          break;
      }

    }
  }
})
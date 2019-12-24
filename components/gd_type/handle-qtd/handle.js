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
    form: {
      ...getApp().globalData.commonField(),
      type: 'qtd',
      service_type: null,
      service_content: null,
      handle_result: null,
      draft_price: 0,
    },
    imagesrc: [],
    paths: []  // 记录图片本地路径
  },
  properties: {
    handleData: {
      type: Object,
      value: {}
    }
  },
  pageLifetimes: {
    show: function () {

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
      console.log(this.data.imagesrc)
      let data = this.properties.handleData
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
      if (this.data.form.sign != '' && this.data.form.sign != null && this.data.form.sign != undefined) {
        getApp().globalData._base64 = this.data.form.sign
      }
      console.log(this.data.form)

      let item = this.properties.handleData;
      // 在组件实例进入页面节点树时执行
      if (JSON.stringify(item) != '{}' && item != undefined) {
        this.setData({
          show: true
        })
        request._post('/workOrder/api/getActionHistory', { "id": item.id, "type": item.type, "action": "返单" }, res => {
          console.log(res)
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
    isEmpty(val) {
      return val == '' || val == null || val == undefined
    },
    transferImageList(imageList) {
      console.log(imageList)
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

    save() {
      // console.log(this.timeformat('2014-07-10 10:21:12'))
      // console.log(this.data.form.draft_price)
      this.saveORcommit('/save')

    },
    commit() {
      this.saveORcommit('/commit')
    },
    saveORcommit(cs_path) {
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
      }
      if (this.data.form.handle_result == "" || (this.data.form.handle_result.length > 0 && this.data.form.handle_result.trim().length == 0)) {
        wx.showModal({
          title: '不能为空',
          content: '请输入处理结果',
          showCancel: false
        })
        return
      }
      if (!(/^\d+(\.\d+)?$/).test(this.data.form.draft_price)) {
        wx.showModal({
          title: '提示',
          content: '拟定费用填写错误',
          showCancel: false
        })
        return
      }
      if (!(/^\d+(\.\d+)?$/).test(this.data.form.final_price)) {
        wx.showModal({
          title: '提示',
          content: '最终费用填写错误',
          showCancel: false
        })
        return
      }
      if (this.data.form.remark == "" || (this.data.form.remark.length > 0 && this.data.form.remark.trim().length == 0)) {
        wx.showModal({
          title: '不能为空',
          content: '请输入备注内容',
          showCancel: false
        })
        return
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
    final_price(e) {
      this.setData({
        ['form.final_price']: e.detail.value
      })
    },
    beizu_remark(e) {
      this.setData({
        ['form.remark']: e.detail.value
      })
    },


    qianming() {
      // console.log(11)
      wx.navigateTo({
        url: '../../pages/routePage/signature/signature',
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
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
    }
  }
})
import request from '../../utils/request.js'
import WxValidate from "../../utils/WxValidate.js";
import { hexMD5 } from "../../utils/md5.js";
Component({
  data: {
    user: '',
    pwd: ''
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.initValidate()//验证规则函数
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  properties: {},
  methods: {
    test() {

    },
    user(e) {
      // console.log(this.getTabBar())
      this.setData({
        user: e.detail.value
      })
    },
    pwd(e) {
      this.setData({
        pwd: e.detail.value
      })
    },
    ok() {
      console.log(this.data.user)
      console.log(this.data.pwd)
    },
    initValidate() {
      let rules = {
        user: {
          required: true,
          maxlength: 21
        },
        pwd: {
          required: true,
          maxlength: 21
        }
      }

      let message = {
        user: {
          required: '用户名不能为空',
          maxlength: '字段不能超过21个字'
        },
        pwd: {
          required: '密码不能为空',
          maxlength: '字段不能超过21个字'
        }
      }
      //实例化当前的验证规则和提示消息
      this.WxValidate = new WxValidate(rules, message);
    },
    //调用验证函数
    formSubmit: function (e) {
      let that = this;
      // console.log(hexMD5(this.data.user))
      // console.log('form发生了submit事件，携带的数据为：', e.detail.value)
      const params = e.detail.value
      //校验表单
      if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0]
        this.showModal(error)
        return false
      }


      request._post('/bind', {
        "username": this.data.user,
        "password": hexMD5(this.data.pwd)
      }, res => {
        console.log(res)
        if (res.data.status == 200) {
          console.log(res)
          wx.showLoading();
          wx.hideLoading();
          setTimeout(() => {

            wx.showToast({
              title: '绑定成功',
              icon: 'success',//当icon：'none'时，没有图标 只有文字
              duration: 2000
            })
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);

          let unioid = wx.getStorageSync('unionid')
          // 页面被展示
          // 在组件实例进入页面节点树时执行
          wx.request({
            url: `${getApp().globalData.url}/login?unionid=${unioid}`,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/json' // 默认值
            },
            // header: {}, // 设置请求的 header
            success: function (res) {
              // success
              if (res.data.status == 200) {
                console.log('登录成功')
                wx.setStorageSync('user', res.data.user);
                if (res.header['Set-Cookie'] != '' && res.header['Set-Cookie'] != null && res.header['Set-Cookie'] != undefined) {
                  wx.setStorageSync('cookie', res.header['Set-Cookie']);
                } else {
                  wx.setStorageSync('cookie', res.header['set-cookie']);
                }
                // this.getTabBar().attached()
                getApp().globalData.login_show = true
                that.triggerEvent('myevent');
              }

            }

          })

        } else {
          wx.showModal({
            title: '提示',
            content: '账号或密码错误',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })

    },

    //报错 
    showModal(error) {
      wx.showModal({
        content: error.msg,
        showCancel: false,
      })
    }
  }
})
import request from '../utils/request.js'
Component({
  data: {
    selected: 0,
    current: '',
    show: false,
    flag: false,  /* 判断显示的是登录还是工单 */
    dot: false,
    list: [
      {
        key: "statement",
        pagePath: "/pages/statement/statement",
        text: "报表统计"
      },
      {
        key: "order",
        pagePath: "/pages/order/order",
        text: "工单"
      },
      {
        key: "orderlogin",
        pagePath: "/pages/orderlogin/orderlogin",
        text: "工单"
      },
      {
        key: "info",
        pagePath: "/pages/info/info",
        text: "实时信息"
      },
      {
        key: "warn",
        pagePath: "/pages/warn/warn",
        text: "预警"
      },
      {
        key: "setup",
        pagePath: "/pages/setup/setup",
        text: "设置"
      }]
  },

  lifetimes: {
    attached: function () {
      // console.log(11)
      // 在组件实例进入页面节点树时执行

      if (wx.getStorageSync('user').dbTemplate == 'ymp_yichaoyun') {
        this.setData({
          show: true
        })
        let user = wx.getStorageSync('user');
        if (user.status == 1) {
          getApp().globalData.login_show = true
          request._post('/workOrder/api/getHandling', {}, res => {
            // console.log(res)
            if (JSON.stringify(res.data.row) == '{}' || res.data.row == undefined) {
              getApp().globalData.dot = false
            } else {
              getApp().globalData.dot = true
            }
          })
        } else {
          getApp().globalData.login_show = false
        }
      } else {
        // console.log(11)
        this.setData({
          show: false
        })
        let user = wx.getStorageSync('user');
        if (user.status == 1) {
          getApp().globalData.login_show = true
        } else {
          getApp().globalData.login_show = false
        }

      }

      this.setData({
        dot: getApp().globalData.dot
      })
      // console.log(app.globalData.current)
      // if (typeof app.globalData.current === 'string') {
      //   this.setData({
      //     current: app.globalData.current
      //   })
      // }
      // console.log(this.data.current)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {

    switchTab(e) {
      console.log(e)
      let url = e.currentTarget.dataset.path;
      wx.switchTab({ url })

      // console.log(e)
    }


  }
})
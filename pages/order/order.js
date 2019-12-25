import request from '../../utils/request.js'
import { $stopWuxRefresher, $stopWuxLoader, $wuxDialog } from '../../dist/index'
// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    shebeiData: [],
    handleData: {},
    page: 1,
    dot: false,
    current: '工单',
    _show: false,
    show: false
  },
  //获取工单数据
  getwork() {
    request._post('/workOrder/api/search', { "page": this.data.page, "pageSize": 10 }, res => {
      // console.log(res)
      this.setData({
        orderData: res.data.list
      })
      console.log(this.data.orderData)
      if (this.data.orderData.length == 0) {
        this.setData({
          _show: true
        })
      } else {
        this.setData({
          _show: false
        })
      }
    })
  },
  //获取处理中的数据
  gethandle() {
    //接口/workOrder/api/getHandling返回的row有值就说明有数据 空就说明没有
    // 如果有值就继续调用/workOrder/api/getById和/workOrder/api/getDetailById接口
    request._post('/workOrder/api/getHandling', {}, res => {
      // console.log(res)
      if (JSON.stringify(res.data.row) == '{}' || res.data.row == undefined) {
        getApp().globalData.dot = false;
        this.getdot();
        this.setData({
          handleData: {}
        })
      } else {
        getApp().globalData.dot = true
        this.getdot();
        request._post('/workOrder/api/getDetailById', { "id": res.data.row.id, "type": res.data.row.type }, res => {
          console.log(res.data.list)
          if (res.data.status == 200) {
            this.setData({
              shebeiData: res.data.list
            })
            console.log(this.data.shebeiData)
          }
        })
        request._post('/workOrder/api/getById', { "id": res.data.row.id, "type": res.data.row.type }, res => {
          console.log(res)
          if (res.data.status == 200) {
            this.setData({
              handleData: res.data.row
            })
            // console.log(this.data.handleData)
          }
        })

      }
    })
  },
  //获取dot状态
  getdot() {
    this.setData({
      dot: getApp().globalData.dot
    })
    this.getTabBar().setData({
      dot: getApp().globalData.dot
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const ctx = wx.createCanvasContext('autograph')

    // ctx.drawImage('http://tmp/wx99fca1b9d8455954.o6zAJs3CgHDkuEMBX__ocDTT2qIg.sfjQ5511ZKjD872c7669c2904e0600cfc9d170c930d9.png', 0, 0, 150, 100)
    // ctx.draw()
    this.setData({
      show: getApp().globalData.login_show,
      dot: getApp().globalData.dot
    })

    let user = wx.getStorageSync('user');
    // console.log(user.status)
    if (user.status == 1) {
      // console.log(11)
      getApp().globalData.login_show = true
      this.setData({
        show: getApp().globalData.login_show
      })

      // 获取工单数据
      this.getwork();
      //获取处理中数据
      this.gethandle();

    }
  },
  myevent() {
    this.setData({
      show: getApp().globalData.login_show
    })
    this.getwork();
    this.gethandle();
  },
  jiedan() {
    this.setData({
      current: '处理中'
    })

    this.gethandle();
    this.getwork();

  },
  // 提交工单
  commit() {
    this.setData({
      current: '工单'
    })
    this.gethandle();
    this.getwork();
  },
  handleOk() {
    this.setData({
      current: '工单'
    })
    this.getwork();
    this.gethandle();
  },
  onTabsChange(e) {
    // console.log('onTabsChange', e)
    this.setData({
      current: e.detail.key
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.show !== getApp().globalData.login_show) {
      this.setData({
        show: getApp().globalData.login_show
      })
      this.getwork();
      this.gethandle();
    }
    this.getTabBar().setData({
      // current: 'order'
      selected: 1
    })
  }


})
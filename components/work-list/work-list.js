import request from '../../utils/request';
Component({
  data: {
    time: new Date().getTime()
  },
  properties: {
    listData: {
      type: Object,
      value: []
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log(this.properties.listData)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  methods: {
    toggleRight1(e) {
      console.log(e.currentTarget.dataset.item)
      let item = e.currentTarget.dataset.item
      request._post('/workOrder/api/getActionHistory', { "id": item.id, "type": item.type, "action": "返单" }, res => {
        console.log(res)
        let fandanData = []
        if (res.data.list != null && res.data.list != undefined) {
          fandanData = res.data.list;
        }
        if (res.data.status == 200) {
          // this.triggerEvent('jiedan')
          wx.navigateTo({
            url: '../../pages/workRoute/fandanmsg/fandanmsg?fandanData=' + JSON.stringify(fandanData),
            success: function (res) {
              // success
            }
          })
        }
      })
    },
    jiedan(e) {
      console.log(e.currentTarget.dataset)
      console.log(1)
      let item = e.currentTarget.dataset.item
      if (item.status == 10) {
        request._post('/workOrder/api/receive', { "id": item.id, "type": item.type, "status": item.status }, res => {
          console.log(res)
          if (res.data.status == 200) {
            this.triggerEvent('jiedan')
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success(res) {
                console.log('用户点击确定')
              }
            })
          }
        })
      } else {
        request._post('/workOrder/api/handle', { "id": item.id, "type": item.type, "status": item.status }, res => {
          console.log(res)
          if (res.data.status == 200) {
            this.triggerEvent('jiedan')
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success(res) {
                console.log('用户点击确定')
              }
            })
          }
        })
      }

    }
  }
})
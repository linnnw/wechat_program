import request from '../../utils/request.js'

Component({
  data: {
    visible: false,
    remark: '',
    show: true,
    fandanData: [],
    timekey1: [],  //到达
    val1: '请选择到达时间',
    timekey2: [],  //离开
    val2: '请选择离开时间',
    lang: 'zh_CN',
    form: {
      type: 'qtd',
      service_type: null,
      service_content: null,
      handle_result: null,
      draft_price: 0,
    }
  },
  properties: {
    handleData: {
      type: Object,
      value: {}
    }
  },
  lifetimes: {
    attached: function () {
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
    setValue(values, key, mode) {
      this.setData({
        [`timekey${key}`]: values.value,
        [`val${key}`]: values.label,
        // [`displayValue${key}`]: values.displayValue.join(' '),
      })
    },
    onConfirm(e) {
      const { index, mode } = e.currentTarget.dataset
      this.setValue(e.detail, index, mode)
      console.log(`onConfirm${index}`, e.detail)
    },
    onVisibleChange(e) {
      this.setData({ visible: e.detail.visible })
    },

    handlefd() {
      this.setData({
        visible: true
      });
    },
    handleClose() {
      this.setData({
        visible: false
      });
    },
    val(e) {
      // console.log(e)
      this.setData({
        remark: e.detail.value
      })
    },
    handleOk() {
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


      // console.log(this.properties.handleData)
    }
  }
})